import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, ScrollView, Modal } from 'react-native';
import { createTable, dropTable, getDbConnection, listTables } from './db-service';
import { BlueButton } from './components/blue-button';
import { TextButton } from './components/text-button';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {StackParams} from "../App.tsx";
import { ListItem } from './components/list-item.tsx';
import { AddButton } from './components/add-button.tsx';

export const MyCollectionsPage = () => {
  const navigation = useNavigation<NativeStackNavigationProp<StackParams>>();

  const [collections, setCollections] = useState<string[]>([]);
  const [newCollectionName, setNewCollectionName] = useState<string>("");
  const [addModalVisibility, setAddModalVisibility] = useState<boolean>(false);

  const newCollection = async (collectionName: string) => {
    const db = await getDbConnection();
    await createTable(db, collectionName);
  };

  const deleteCollection = async (collectionName: string) => {
    const db = await getDbConnection();
    await dropTable(db, collectionName);
  };

  const listCollections = useCallback(async () => {
    const db = await getDbConnection();
    const collectionListQuery = await listTables(db);

    const names: string[] = [];
    collectionListQuery.forEach(result => {
        for (let i = 0; i < result.rows.length; i++) {
            console.log(result.rows)
            names.push(result.rows.item(i).name);
        }
    });

    setCollections(names);
  },[]);

  useEffect(() => {
    listCollections();
  }, [listCollections]);
  
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
                placeholder="TableName"
                value={newCollectionName}
                onChangeText={setNewCollectionName}
            />
            <BlueButton
              label="Create"
              onPress={async () => {
                await newCollection(newCollectionName);
                await listCollections();
                setNewCollectionName("");
                setAddModalVisibility(false);
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
        {collections.map((collection) => {
          return (
            <ListItem
              key={`${collection}`}
              onLongPress={async () => {
                await deleteCollection(collection);
                await listCollections();
              }}
              onPress={() => navigation.navigate(
                "CardsPage",
                {collectionName: collection}
              )}
              mainText={collection}
              secondaryText='number of cards'
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
