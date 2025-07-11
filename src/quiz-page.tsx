import { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { getDbConnection, listRecords } from './db-service';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { StackParams } from '../App';
import { CardType } from './cards-page';
import { TextButton } from './components/text-button';
import { useNavigation } from '@react-navigation/native';
import { CardSwipeView } from './components/card-swipe-view';
import { colors } from './theme/colors';
import { CustomHeader } from './components/custom-header';

export const QuizPage = ({
  route,
}: NativeStackScreenProps<StackParams, 'QuizPage'>) => {
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

  return (
    <View style={styles.container}>
      <CustomHeader
        headerText="Quiz"
        goBack={() => navigation.goBack()}
        onAction={() => navigation.popToTop()}
        actionText="Collections"
      />
      <CardSwipeView cards={cards} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.pale_purple[500],
  },
});
