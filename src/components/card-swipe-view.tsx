import { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  Easing,
  ReduceMotion,
  runOnJS,
  withTiming,
} from 'react-native-reanimated';
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
      if (Math.abs(event.translationX) > 25) {
        cards[1 - direction].translateX.value = SCREEN_WIDTH * direction;
        cards[1 + direction].translateX.value = withTiming(0);
        cards[1].translateX.value = withTiming(-SCREEN_WIDTH * direction);

        runOnJS(equalizer)(direction);
      } else {
        cards[1].translateX.value = withTiming(0);
      }
    });

  const longPressGesture = Gesture.LongPress()
    .minDuration(200)
    .maxDistance(SCREEN_WIDTH * 0.9)
    .onStart(() => {
      cards[1].fontFamily.value = 'SpaceMono-Regular';
      cards[1].pressedColor.value = withTiming(`${colors.fawn}FF`);
      cards[1].scale.value = withTiming(1.1, {
        duration: 400,
        easing: Easing.elastic(5),
        reduceMotion: ReduceMotion.System,
      });
      cards[1].fontSize.value = 16;
      runOnJS(setIsDescription)(true);
    })
    .onFinalize(() => {
      runOnJS(setIsDescription)(false);
      cards[1].fontFamily.value = 'SpaceMono-Bold';
      cards[1].fontSize.value = withTiming(26);
      cards[1].pressedColor.value = '#00000000';
      cards[1].scale.value = withTiming(1);
    });

  const composedGesture = Gesture.Race(swipeGesture, longPressGesture);

  return (
    <View style={styles.container}>
      {cards.map((card, index) => {
        return (
          <GestureDetector
            key={`${card.data.id}_${index}`}
            gesture={index === 1 ? composedGesture : Gesture.Exclusive()}
          >
            <Animated.View style={[styles.card, card.animatedStyle]}>
              <Animated.View
                style={[styles.insideCard, card.animatedStyleInsiceCard]}
              >
                <Animated.Text style={[card.animatedStyleText]}>
                  {card.data[isDescription ? 'description' : 'word']}
                </Animated.Text>
              </Animated.View>
            </Animated.View>
          </GestureDetector>
        );
      })}
    </View>
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
    backgroundColor: colors.melon,
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
