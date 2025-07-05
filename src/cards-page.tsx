import React, { useCallback, useEffect, useState } from 'react';
import {StyleSheet, View, Text, ScrollView, Pressable} from 'react-native';
import { getDbConnection, listRecords } from './db-service.ts';
import { StackParams } from '../App.tsx';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export const CardsPage = ({ route }: NativeStackScreenProps<StackParams, "CardsPage">) => {
  const  { collectionName } = route.params;
  const [cards, setCards] = useState<any[]>([]);

  const listCards = useCallback(async () => {
    const db = await getDbConnection();
    const cardListQuery = await listRecords(db, collectionName);
    
    const records = [];

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
      <ScrollView style={styles.scrollView}>
        {cards.map((card, index) => {
          return (
            <Pressable
              key={`${card.id}${index}`}
              style={styles.tableView}
              onLongPress={async () => {
                // await deleteCollection(table);
                // await listCollections();
              }}
              onPress={() => {}}
            >
              <Text>{card.id}</Text>
              <Text>Number of cards</Text>
            </Pressable>
          );
        })}
      </ScrollView>
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
  tableView: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    width: "100%",
    fontSize: 16,
    marginBottom: 8,
  },
});