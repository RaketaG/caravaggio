import React, { useCallback, useEffect, useState } from 'react';
import {StyleSheet, View, ScrollView, Modal, TextInput} from 'react-native';
import { deleteRecord, getDbConnection, insertRecord, listRecords } from './db-service.ts';
import { StackParams } from '../App.tsx';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BlueButton } from './components/blue-button.tsx';
import { TextButton } from './components/text-button.tsx';
import uuid from 'react-native-uuid';
import { ListItem } from './components/list-item.tsx';
import { AddButton } from './components/add-button.tsx';

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

  const newCard = async () => {
    const db = await getDbConnection();
    const generatedId = uuid.v4();
    console.log(generatedId);
    await insertRecord(
      db,
      collectionName,
      generatedId,
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
    
      <Modal
        animationType="fade"
        transparent={true}
        visible={addModalVisibility}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
                style={styles.inputField}
                placeholder="Word"
                value={newWord}
                onChangeText={setNewWord}
            />
            <TextInput
                style={styles.inputField}
                placeholder="Description"
                value={newDescription}
                onChangeText={setNewDescription}
            />
            <BlueButton
              label="Create"
              onPress={async () => {
                await newCard();
                await listCards();
                setAddModalVisibility(false);
                setNewWord("");
                setNewDescription("");
              }}
            />
            <TextButton
              label="Cancel"
              color="red"
              marginTop={16}
              onPress={() => setAddModalVisibility(false)}
            />
          </View>
        </View>
      </Modal>

      <ScrollView style={styles.scrollView}>
        {cards.map((card) => {
          return (
            <ListItem
              key={`${card.id}`}
              onLongPress={async () => {
                await deleteCard(card.id);
                await listCards();
              }}
              onPress={() => {}}
              mainText={card.word}
              secondaryText={card.description}
            />
          );
        })}
      </ScrollView>
      
      <AddButton onPress={() => setAddModalVisibility(true)}/>

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
  addTableCircle: {
    position: "absolute",
    right: 42,
    bottom: 64,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 60,
    borderRadius: 60,
  },
  addTableCirclePressed: {
    backgroundColor: "#005BBB",
  },
  plusStyle: {
    fontSize: 32,
    color: "#FFFFFF",
    marginTop: -4
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.4)'
  },
  modalView: {
    marginTop: -48,
    width: "100%",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    backgroundColor: "#FFFFFF",
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});