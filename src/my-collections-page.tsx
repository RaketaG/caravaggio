import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, ScrollView } from 'react-native';
import { createTable, dropTable, getDbConnection, listTables } from './db-service';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {StackParams} from "../App.tsx";
import { ListItem } from './components/list-item.tsx';
import { AddButton } from './components/add-button.tsx';
import { ModalWrapper } from './components/modal-wrapper.tsx';

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
    
      <ModalWrapper
        visible={addModalVisibility}
        onBlueButtonPress={async () => {
          await newCollection(newCollectionName);
          await listCollections();
          setNewCollectionName("");
          setAddModalVisibility(false);
        }}
        onRedButtonPress={() => setAddModalVisibility(false)}
      >
        <TextInput
          style={styles.inputField}
          placeholder="TableName"
          value={newCollectionName}
          onChangeText={setNewCollectionName}
        />
      </ModalWrapper>

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
});
