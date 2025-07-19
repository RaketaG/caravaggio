import { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { getDbConnection, listRecords } from '../services/db-service';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { StackParams } from '../../App';
import { useNavigation } from '@react-navigation/native';
import { CardDataType, CardSwipeView } from '../components/card-swipe-view';
import { colors } from '../theme/colors';
import { HeaderButton } from '../components/header-button';

export const QuizPage = ({
  route,
}: NativeStackScreenProps<StackParams, 'QuizPage'>) => {
  const navigation = useNavigation<NativeStackNavigationProp<StackParams>>();
  const { collectionName } = route.params;
  const [cards, setCards] = useState<CardDataType[]>([]);

  const headerRight = useCallback(() => {
    return (
      <HeaderButton action="home" onAction={() => navigation.popToTop()} />
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

    const records: CardDataType[] = [];

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
      {cards.length > 0 && <CardSwipeView cardsData={cards} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.pale_purple.standard,
  },
});
