import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, ScrollView } from 'react-native';
import { createTable, dropTable, getDbConnection, listTables, numberOfRecords, renameTable } from './db-service';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {StackParams} from "../App.tsx";
import { ListItem } from './components/list-item.tsx';
import { AddButton } from './components/add-button.tsx';
import { ModalWrapper } from './components/modal-wrapper.tsx';

export const MyCollectionsPage = () => {
  const navigation = useNavigation<NativeStackNavigationProp<StackParams>>();

  const [collections, setCollections] = useState<string[]>([]);
  const [cardCount, setCardCount] = useState<{[key: string]: number}>({});
  const [newCollectionName, setNewCollectionName] = useState<string>("");
  const [oldCollectionName, setOldCollectionName] = useState<string>("");
  const [addModalVisibility, setAddModalVisibility] = useState<boolean>(false);
  const [forUpdate, setForUpdate] = useState<boolean>(true);

  const newCollection = async (collectionName: string) => {
    const db = await getDbConnection();
    await createTable(db, collectionName);
  };

  const renameCollection = async (collectionName: string, newName: string) => {
    const db = await getDbConnection();
    await renameTable(db, collectionName, newName);
  };

  const deleteCollection = async (collectionName: string) => {
    const db = await getDbConnection();
    await dropTable(db, collectionName);
  };

  const listCollections = useCallback(async () => {
    const db = await getDbConnection();
    const collectionListQuery = await listTables(db);

    const names: string[] = [];
    const counts: { [key: string]: number } = {};

    collectionListQuery.forEach(result => {
        for (let i = 0; i < result.rows.length; i++) {
            names.push(result.rows.item(i).name);
        }
    });
    
    for (const name of names) {
      const result = await numberOfRecords(db, name);
      counts[name] = result.rows.item(0).count;
    }

    setCollections(names);
    setCardCount(counts);
  },[]);

  useEffect(() => {
    listCollections();
  }, [listCollections]);

  return (
    <View style={styles.container}>
    
      <ModalWrapper
        visible={addModalVisibility}
        forUpdate={forUpdate}
        onBlueButtonPress={async () => {
          forUpdate ? await renameCollection(oldCollectionName, newCollectionName)
            : await newCollection(newCollectionName);
          await listCollections();
          setNewCollectionName("");
          setAddModalVisibility(false);
        }}
        onRedButtonPress={() => {
          setAddModalVisibility(false);
          setNewCollectionName("");
        }}
      >
        <TextInput
          style={styles.inputField}
          placeholder="Collection name"
          value={newCollectionName}
          onChangeText={setNewCollectionName}
        />
      </ModalWrapper>

      <ScrollView style={styles.scrollView}>
        {collections.map((collection) => {
          return (
            <ListItem
              key={collection}
              mainText={collection}
              secondaryText={`${cardCount[collection]} Cards`}
              onPress={() => navigation.navigate("CardsPage", {collectionName: collection})}
              onDelete={async () => {
                await deleteCollection(collection);
                await listCollections();
              }}
              onRename={async () => {
                setForUpdate(true);
                setNewCollectionName(collection);
                setOldCollectionName(collection);
                setAddModalVisibility(true);
              }}
              onQuizz={() => navigation.navigate("QuizzPage", {collectionName: collection})}
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
    overflow: 'visible'
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
});
