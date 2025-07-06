import React, { useCallback, useEffect, useState } from 'react';
import {StyleSheet, View, ScrollView, TextInput} from 'react-native';
import { deleteRecord, getDbConnection, insertRecord, listRecords, updateRecord } from './db-service.ts';
import { StackParams } from '../App.tsx';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import uuid from 'react-native-uuid';
import { ListItem } from './components/list-item.tsx';
import { AddButton } from './components/add-button.tsx';
import { ModalWrapper } from './components/modal-wrapper.tsx';

type CardType = {
  id: string;
  word: string;
  description: string;
};

export const CardsPage = ({ route }: NativeStackScreenProps<StackParams, "CardsPage">) => {
  const  { collectionName } = route.params;
  const [newWord, setNewWord] = useState<string>("");
  const [newDescription, setNewDescription] = useState<string>("");
  const [cards, setCards] = useState<CardType[]>([]);
  const [addModalVisibility, setAddModalVisibility] = useState<boolean>(false)
  const [cardId, setCardId] = useState<string>("");
  const [forUpdate, setForUpdate] = useState<boolean>(true)

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
    await updateRecord(
      db,
      collectionName,
      id,
      newWord,
      newDescription,
    );
  };

  const deleteCard = async (id: string) => {
    const db = await getDbConnection();
    await deleteRecord(db, collectionName,id );
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
          setNewWord("");
          setNewDescription("");
        }}
        onRedButtonPress={() => setAddModalVisibility(false)}
      >
        <TextInput
            style={styles.inputField}
            placeholder="Word"
            value={newWord}
            onChangeText={setNewWord}
        />
        <TextInput
            style={[
              styles.inputField,
              styles.descriptionHeight
            ]}
            placeholder="Description"
            multiline={true}
            value={newDescription}
            onChangeText={setNewDescription}
        />
      </ModalWrapper>

      <ScrollView style={styles.scrollView}>
        {cards.map((card) => {
          return (
            <ListItem
              key={`${card.id}`}
              onLongPress={async () => {
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
        })}
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  scrollView: {
    width: "100%",
    paddingTop: 16,
  },
  inputField: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    width: "100%",
    fontSize: 16,
    marginBottom: 16,
  },
  descriptionHeight: {
    height: 128,
    textAlignVertical: "top"
  }
});