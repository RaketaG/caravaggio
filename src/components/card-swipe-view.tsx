import { useState } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import Animated, { runOnJS, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { colors } from '../theme/colors';
import { useCardAnimationState } from '../hooks/use-card-animation-state';

export type CardDataType = {
  id: string;
  word: string;
  description: string;
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const CardSwipeView = ({ cardsData }: { cardsData: CardDataType[] }) => {
  const [currentIndex, setcurrentIndex] = useState<number>(0);

  const prevIndex = (): number => {
    return (currentIndex - 1 + cardsData.length) % cardsData.length;
  };
  const nextIndex = (): number => {
    return (currentIndex + 1) % cardsData.length;
  };

  const aState = useCardAnimationState(-SCREEN_WIDTH, cardsData[prevIndex()]);
  const bState = useCardAnimationState(0, cardsData[currentIndex]);
  const cState = useCardAnimationState(SCREEN_WIDTH, cardsData[nextIndex()]);
  const cards = [aState, bState, cState];

  const equalizer = (
    direction: 1 | -1,
    cardsToUpdate: ReturnType<typeof useCardAnimationState>[],
  ) => {
    setcurrentIndex(prevCount => prevCount + direction);
    cardsToUpdate.map(card => {
      card.translateX.value === -SCREEN_WIDTH &&
        card.setData(cardsData[prevIndex()]);
      card.translateX.value === SCREEN_WIDTH &&
        card.setData(cardsData[nextIndex()]);
    });
  };

  const swipeGesture = Gesture.Pan()
  .onEnd(event => {
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
              <Text style={styles.textView}>{card.data.word}</Text>
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
    backgroundColor: colors.white[500],
    borderColor: colors.night[500],
    borderWidth: 2,
  },
  insideCard: {
    height: '100%',
    width: '100%',
    backgroundColor: colors.periwinkle[500],
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  textView: {
    fontSize: 26,
    fontFamily: 'SpaceMono-Bold',
  },
});
