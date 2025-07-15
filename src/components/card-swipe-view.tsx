import { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { runOnJS, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { colors } from '../theme/colors';
import { useCardAnimationState } from '../hooks/use-card-animation-state';

export type CardDataType = {
  id: string;
  word: string;
  description: string;
};

export type DirectionType = -1 | 1;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const CardSwipeView = ({ cardsData }: { cardsData: CardDataType[] }) => {
  const [isDescription, setIsDescription] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const indexer = (direction: DirectionType, index?: number): number => {
    index = index === undefined ? currentIndex : index;
    return direction === -1
      ? (index - 1 + cardsData.length) % cardsData.length
      : (index + 1) % cardsData.length;
  };

  const aState = useCardAnimationState(-SCREEN_WIDTH, cardsData[indexer(-1)]);
  const bState = useCardAnimationState(0, cardsData[currentIndex]);
  const cState = useCardAnimationState(SCREEN_WIDTH, cardsData[indexer(1)]);

  const [cards, setCards] = useState([aState, bState, cState]);

  const equalizer = (direction: DirectionType) => {
    const nextIndex = indexer(direction);

    const shifted =
      direction === 1
        ? [cards[1], cards[2], cards[0]]
        : [cards[2], cards[0], cards[1]];

    setCards([
      { ...shifted[0], data: cardsData[indexer(-1, nextIndex)] },
      { ...shifted[1], data: cardsData[nextIndex] },
      { ...shifted[2], data: cardsData[indexer(1, nextIndex)] },
    ]);

    setCurrentIndex(nextIndex);
  };

  const swipeGesture = Gesture.Pan()
    .onUpdate(event => {
      cards[1].translateX.value = event.translationX;
      event.translationX > 0
        ? (cards[0].translateX.value = event.translationX - SCREEN_WIDTH)
        : (cards[2].translateX.value = event.translationX + SCREEN_WIDTH);
    })
    .onEnd(event => {
      const direction = event.translationX > 0 ? -1 : 1;
      cards[1 - direction].translateX.value = SCREEN_WIDTH * direction;
      cards[1 + direction].translateX.value = withTiming(0);
      cards[1].translateX.value = withTiming(-SCREEN_WIDTH * direction);

      runOnJS(equalizer)(direction);
    });

  const longPressGesture = Gesture.LongPress()
    .minDuration(200)
    .onStart(() => {
      runOnJS(setIsDescription)(true);
      cards.forEach(card => {
        if (card.translateX.value === 0) {
          card.fontFamily.value = 'SpaceMono-Regular';
          card.fontSize.value = 16;
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
              style={[styles.card, card.animatedStyle]}
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
    backgroundColor: colors.melon[500],
    borderRadius: 8,
    borderWidth: 2,
  },
  insideCard: {
    height: '100%',
    width: '100%',
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
