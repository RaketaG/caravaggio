import { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { runOnJS, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { colors } from '../theme/colors';
import { useCardAnimationState } from '../hooks/use-card-animation-state';
import { Background_Colors } from './cards-list-item';

export type CardDataType = {
  id: string;
  word: string;
  description: string;
};

export type DirectionType = -1 | 1;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const CardSwipeView = ({ cardsData }: { cardsData: CardDataType[] }) => {
  const [isDescription, setIsDescription] = useState<boolean>(false);
  const [currentIndex, setcurrentIndex] = useState<number>(0);

  const indexer = (direction: DirectionType, index?: number): number => {
    index = index ? index : currentIndex;
    return direction === -1
      ? (index - 1 + cardsData.length) % cardsData.length
      : (index + 1) % cardsData.length;
  };

  const aState = useCardAnimationState(-SCREEN_WIDTH, cardsData[indexer(-1)]);
  const bState = useCardAnimationState(0, cardsData[currentIndex]);
  const cState = useCardAnimationState(SCREEN_WIDTH, cardsData[indexer(1)]);
  const cards = [aState, bState, cState];

  const equalizer = (
    direction: DirectionType,
    cardsToUpdate: ReturnType<typeof useCardAnimationState>[],
  ) => {
    setcurrentIndex(prevCount => indexer(direction, prevCount));
    cardsToUpdate.map(card => {
      card.translateX.value === -SCREEN_WIDTH &&
        card.setData(cardsData[indexer(-1)]);
      card.translateX.value === SCREEN_WIDTH &&
        card.setData(cardsData[indexer(1)]);
    });
  };

  const swipeGesture = Gesture.Pan().onEnd(event => {
    const direction = event.translationX > 0 ? -1 : 1;

    cards.forEach(card => {
      card.translateX.value =
        card.translateX.value === -SCREEN_WIDTH * direction
          ? SCREEN_WIDTH * direction
          : withTiming(card.translateX.value + -SCREEN_WIDTH * direction);
    });

    runOnJS(equalizer)(direction, cards);
  });

  const longPressGesture = Gesture.LongPress()
    .minDuration(200)
    .onStart(() => {
      runOnJS(setIsDescription)(true);
      cards.forEach(card => {
        if (card.translateX.value === 0) {
          card.fontFamily.value = 'SpaceMono-Regular';
          card.fontSize.value = 16;
          card.textAlign.value = 'left';
          card.justifyCard.value = "flex-start"
          card.pressedColor.value = withTiming(`${colors.fawn[500]}FF`);
          card.scale.value = withTiming(1.1);
        }
      });
    })
    .onEnd(() => {
      runOnJS(setIsDescription)(false);
      cards.forEach(card => {
        if (card.translateX.value === 0) {
          card.fontFamily.value = 'SpaceMono-Bold';
          card.fontSize.value = 26;
          card.textAlign.value = 'center';
          card.justifyCard.value = "center"
          card.pressedColor.value = '#00000000';
          card.scale.value = 1;
        }
      });
    });

  const composedGesture = Gesture.Race(swipeGesture, longPressGesture);

  return (
    <GestureDetector gesture={composedGesture}>
      <View style={styles.container}>
        {cards.map((card, index) => {
          return (
            <Animated.View
              key={`${card.data.id}_${index}`}
              style={[
                styles.card,
                card.animatedStyle,
                {
                  backgroundColor:
                    Background_Colors[currentIndex % Background_Colors.length],
                },
              ]}
            >
              <Animated.View
                style={[styles.insideCard, card.animatedStyleInsiceCard]}
              >
                <Animated.Text style={[card.animatedStyleText]}>
                  {card.data[isDescription ? 'description' : 'word']}
                </Animated.Text>
              </Animated.View>
            </Animated.View>
          );
        })}
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    position: 'absolute',
    width: '80%',
    height: '30%',
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 2,
  },
  insideCard: {
    height: '100%',
    width: '100%',
    padding: 8,
    borderRadius: 8,
  },
});
