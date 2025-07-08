import { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Pressable, Text, Dimensions } from 'react-native';
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
} from 'react-native-reanimated';

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

  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  const animatedStyleOne = useAnimatedStyle(() => ({
    transform: [{ translateX: translateXOne.value }],
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

  return (
    <View style={styles.container}>
      <AnimatedPressable
        style={[styles.card, animatedStyleOne]}
        onPress={handleCardChange}
      >
        {cards[counter - 1] && (
          <Text style={styles.textView}>{cards[counter - 1].word}</Text>
        )}
      </AnimatedPressable>

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
