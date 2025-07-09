import { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { getDbConnection, listRecords } from './db-service';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { StackParams } from '../App';
import { CardType } from './cards-page';
import { TextButton } from './components/text-button';
import { useNavigation } from '@react-navigation/native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const QuizzPage = ({
  route,
}: NativeStackScreenProps<StackParams, 'QuizzPage'>) => {
  const navigation = useNavigation<NativeStackNavigationProp<StackParams>>();
  const { collectionName } = route.params;
  const [cards, setCards] = useState<CardType[]>([]);

  const headerRight = useCallback(() => {
    return (
      <TextButton label="Collections" onPress={() => navigation.popToTop()} />
    );
  }, [navigation]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: headerRight,
    });
  }, [headerRight, navigation]);

  const listCards = useCallback(async () => {
    const db = await getDbConnection();
    const cardListQuery = await listRecords(db, collectionName);

    const records: CardType[] = [];

    for (let i = 0; i < cardListQuery.rows.length; i++) {
      records.push(cardListQuery.rows.item(i));
    }

    setCards(records);
  }, [collectionName]);

  useEffect(() => {
    listCards();
  }, [listCards]);

  const [counter, setCounter] = useState<number>(1);

  const translateXOne = useSharedValue(0);
  const translateXTwo = useSharedValue(SCREEN_WIDTH);
  const pressedColor = useSharedValue('#FFFFFF');
  const cardScale = useSharedValue(1);

  const animatedStyleOne = useAnimatedStyle(() => ({
    backgroundColor: pressedColor.value,
    transform: [
      { translateX: translateXOne.value },
      { scale: cardScale.value },
    ],
  }));

  const animatedStyleTwo = useAnimatedStyle(() => ({
    transform: [{ translateX: translateXTwo.value }],
  }));

  const incrementCounter = () => {
    setCounter(prevCount => (prevCount < cards.length ? prevCount + 1 : 1));
  };

  const handleCardChange = () => {
    translateXOne.value = withSpring(-SCREEN_WIDTH, {}, isFinished => {
      if (isFinished) {
        runOnJS(incrementCounter)();
        translateXOne.value = 0;
        translateXTwo.value = SCREEN_WIDTH;
      }
    });
    translateXTwo.value = withSpring(0);
  };

  const swipeGesture = Gesture.Pan()
    .onUpdate(event => {
      translateXOne.value = event.translationX;
      translateXTwo.value = SCREEN_WIDTH + event.translationX;
    })
    .onEnd(() => {
      if (translateXOne.value < -150) {
        runOnJS(handleCardChange)();
      } else {
        translateXOne.value = withSpring(0);
        translateXTwo.value = withSpring(SCREEN_WIDTH);
      }
    });

  const longPressGesture = Gesture.LongPress()
    .onBegin(() => {
      cardScale.value = withTiming(1.2, {
        duration: 200,
        easing: Easing.bezier(0.31, 0.04, 0.03, 1.04),
      });
      pressedColor.value = withTiming('linen', {
        duration: 500,
        easing: Easing.bezier(0.31, 0.04, 0.03, 1.04),
      });
    })
    .onFinalize(() => {
      cardScale.value = 1;
      pressedColor.value = '#FFFFFF';
    });

  const composedGesture = Gesture.Race(swipeGesture, longPressGesture);

  return (
    <View style={styles.container}>
      <GestureDetector gesture={composedGesture}>
        <Animated.View style={[styles.card, animatedStyleOne]}>
          {cards[counter - 1] && (
            <Text style={styles.textView}>{cards[counter - 1].word}</Text>
          )}
        </Animated.View>
      </GestureDetector>

      <Animated.View style={[styles.card, animatedStyleTwo]}>
        {cards[counter - 1] && (
          <Text style={styles.textView}>
            {cards[counter % cards.length].word}
          </Text>
        )}
      </Animated.View>
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
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  textView: {
    fontSize: 26,
    fontWeight: 'bold',
  },
});
