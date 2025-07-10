import { useState } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { colors } from '../theme/colors';

type CardType = {
  id: string;
  word: string;
  description: string;
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const CardSwipeView = ({ cards }: { cards: CardType[] }) => {
  const [counter, setCounter] = useState<number>(1);

  const setCounterWrapper = (type: 'increment' | 'decrement') => {
    if (type === 'increment') {
      setCounter(prevCount => (prevCount < cards.length ? prevCount + 1 : 1));
    } else if (type === 'decrement') {
      setCounter(prevCount => (prevCount > 1 ? prevCount - 1 : cards.length));
    }
  };

  const [isDescription, setIsDescription] = useState<boolean>(false);

  const translateXA = useSharedValue(-SCREEN_WIDTH);
  const translateXB = useSharedValue(0);
  const translateXC = useSharedValue(SCREEN_WIDTH);

  const pressedColor = useSharedValue('#FFFFFF');
  const cardScale = useSharedValue(1);

  const animatedStyleA = useAnimatedStyle(() => ({
    backgroundColor: pressedColor.value,
    transform: [{ translateX: translateXA.value }, { scale: cardScale.value }],
  }));

  const animatedStyleB = useAnimatedStyle(() => ({
    backgroundColor: pressedColor.value,
    transform: [{ translateX: translateXB.value }, { scale: cardScale.value }],
  }));

  const animatedStyleC = useAnimatedStyle(() => ({
    backgroundColor: pressedColor.value,
    transform: [{ translateX: translateXC.value }, { scale: cardScale.value }],
  }));

  const handleCardChange = (direction: 'next' | 'previous') => {
    if (direction === 'next') {
      translateXB.value = withSpring(-SCREEN_WIDTH, {}, isFinished => {
        if (isFinished) {
          runOnJS(setCounterWrapper)('increment');
          translateXB.value = 0;
          translateXC.value = SCREEN_WIDTH;
        }
      });
      translateXC.value = withSpring(0);
    } else if (direction === 'previous') {
      translateXB.value = withSpring(SCREEN_WIDTH, {}, isFinished => {
        if (isFinished) {
          runOnJS(setCounterWrapper)('decrement');
          translateXB.value = 0;
          translateXA.value = -SCREEN_WIDTH;
        }
      });
      translateXA.value = withSpring(0);
    }
  };

  const swipeGesture = Gesture.Pan()
    .onUpdate(event => {
      translateXA.value = -SCREEN_WIDTH + event.translationX;
      translateXB.value = event.translationX;
      translateXC.value = SCREEN_WIDTH + event.translationX;
    })
    .onEnd(() => {
      if (translateXB.value < -150) {
        runOnJS(handleCardChange)('next');
      } else if (translateXB.value > 150) {
        runOnJS(handleCardChange)('previous');
      } else {
        translateXA.value = withSpring(-SCREEN_WIDTH);
        translateXB.value = withSpring(0);
        translateXC.value = withSpring(SCREEN_WIDTH);
      }
    });

  const longPressGesture = Gesture.LongPress()
    .minDuration(200)
    .onStart(() => {
      cardScale.value = withTiming(1.2, {
        duration: 200,
        easing: Easing.bezier(0.31, 0.04, 0.03, 1.04),
      });
      pressedColor.value = withTiming('linen', {
        duration: 500,
        easing: Easing.bezier(0.31, 0.04, 0.03, 1.04),
      });
      runOnJS(setIsDescription)(true);
    })
    .onFinalize(() => {
      cardScale.value = 1;
      pressedColor.value = '#FFFFFF';
      runOnJS(setIsDescription)(false);
    });

  const composedGesture = Gesture.Race(swipeGesture, longPressGesture);

  console.log(counter);

  return (
    <View style={styles.container}>
      {/* <GestureDetector gesture={composedGesture}> */}
      <Animated.View style={[styles.card, animatedStyleA]}>
        <View style={styles.insideCard}>
          {cards[counter - 1] && (
            <Text style={styles.textView}>
              {cards[counter - 2 === -1 ? cards.length - 1 : counter - 2].word}
            </Text>
          )}
        </View>
      </Animated.View>
      {/* </GestureDetector> */}

      <GestureDetector gesture={composedGesture}>
        <Animated.View style={[styles.card, animatedStyleB]}>
          <View style={styles.insideCard}>
            {cards[counter - 1] && (
              <Text style={styles.textView}>
                {cards[counter - 1][isDescription ? 'description' : 'word']}
              </Text>
            )}
          </View>
        </Animated.View>
      </GestureDetector>

      {/* <GestureDetector gesture={composedGesture}> */}
      <Animated.View style={[styles.card, animatedStyleC]}>
        <View style={styles.insideCard}>
          {cards[counter - 1] && (
            <Text style={styles.textView}>
              {cards[counter % cards.length].word}
            </Text>
          )}
        </View>
      </Animated.View>
      {/* </GestureDetector> */}
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
    fontWeight: 'bold',
  },
});
