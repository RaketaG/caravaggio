import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, TextInput, Text } from 'react-native';
import {
  deleteRecord,
  getDbConnection,
  insertRecord,
  listRecords,
  updateRecord,
} from '../services/db-service.ts';
import { StackParams } from '../../App.tsx';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import uuid from 'react-native-uuid';
import { ListItemWrapper } from '../components/list-item-wrapper.tsx';
import { AddButton } from '../components/add-button.tsx';
import { ModalWrapper } from '../components/modal-wrapper.tsx';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors.ts';
import { CustomHeader } from '../components/custom-header.tsx';
import Toast from 'react-native-toast-message';

export type CardType = {
  id: string;
  word: string;
  description: string;
};

export const CardsPage = ({
  route,
}: NativeStackScreenProps<StackParams, 'CardsPage'>) => {
  const { collectionName } = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<StackParams>>();
  const [newWord, setNewWord] = useState<string>('');
  const [newDescription, setNewDescription] = useState<string>('');
  const [cards, setCards] = useState<CardType[]>([]);
  const [addModalVisibility, setAddModalVisibility] = useState<boolean>(false);
  const [cardId, setCardId] = useState<string>('');
  const [forUpdate, setForUpdate] = useState<boolean>(true);

  const newCard = async () => {
    const db = await getDbConnection();
    const generatedId = uuid.v4();
    await insertRecord(
      db,
      collectionName,
      generatedId,
      newWord,
      newDescription,
    );
  };

  const updateCard = async (id: string) => {
    const db = await getDbConnection();
    await updateRecord(db, collectionName, id, newWord, newDescription);
  };

  const deleteCard = async (id: string) => {
    const db = await getDbConnection();
    await deleteRecord(db, collectionName, id);
  };

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
      <ModalWrapper
        visible={addModalVisibility}
        forUpdate={forUpdate}
        onBlueButtonPress={async () => {
          forUpdate ? await updateCard(cardId) : await newCard();
          await listCards();
          setAddModalVisibility(false);
          setNewWord('');
          setNewDescription('');
        }}
        onRedButtonPress={() => {
          setAddModalVisibility(false);
          setNewWord('');
          setNewDescription('');
        }}
      >
        <TextInput
          style={styles.inputField}
          placeholder="Word"
          placeholderTextColor={colors.night[700]}
          value={newWord}
          onChangeText={setNewWord}
        />
        <TextInput
          style={[styles.inputField, styles.descriptionHeight]}
          placeholder="Description"
          placeholderTextColor={colors.night[700]}
          multiline={true}
          value={newDescription}
          onChangeText={setNewDescription}
        />
      </ModalWrapper>

      <CustomHeader
        headerText="Cards"
        actionText="Quiz"
        onAction={() => {
          if (cards.length > 1) {
            navigation.navigate('QuizPage', { collectionName });
          } else {
            Toast.show({
              type: 'error',
              text1: 'Quiz Not Available',
              text2: 'Please add at least 2 cards before starting.',
              position: 'bottom',
            });
          }
        }}
        goBack={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {cards.length > 0 ? (
          cards.map((card, index) => {
            return (
              <ListItemWrapper
                key={`${card.id}`}
                listView="Cards"
                index={index}
                onDelete={async () => {
                  await deleteCard(card.id);
                  await listCards();
                }}
                onPress={async () => {
                  setForUpdate(true);
                  setAddModalVisibility(true);
                  setNewWord(card.word);
                  setNewDescription(card.description);
                  setCardId(card.id);
                }}
                mainText={card.word}
                secondaryText={card.description}
              />
            );
          })
        ) : (
          <Text style={styles.emptyText}>
            {'You do not have any cards.' +
              '\n Press the plus button below to add one'}
          </Text>
        )}
      </ScrollView>

      <AddButton
        onPress={() => {
          setForUpdate(false);
          setAddModalVisibility(true);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.pale_purple[500],
  },
  scrollView: {
    width: '100%',
    paddingTop: 16,
    paddingHorizontal: 16,
    overflow: 'visible',
  },
  inputField: {
    borderWidth: 2,
    borderColor: colors.night[500],
    backgroundColor: colors.pale_purple[600],
    borderRadius: 8,
    padding: 16,
    width: '100%',
    fontSize: 16,
    fontFamily: "SpaceMono-Bold",
    marginBottom: 16,
  },
  descriptionHeight: {
    height: 128,
    textAlignVertical: 'top',
  },
  emptyText: {
    fontFamily: 'SpaceMono-Bold',
    textAlign: 'center',
    paddingTop: '70%',
    color: colors.night[700],
  },
});
