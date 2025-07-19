import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, ScrollView, Text, Platform } from 'react-native';
import {
  createTable,
  dropTable,
  getDbConnection,
  listTables,
  numberOfRecords,
  renameTable,
} from '../services/db-service.ts';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StackParams } from '../../App.tsx';
import { ListItemWrapper } from '../components/list-item-wrapper.tsx';
import { AddButton } from '../components/add-button.tsx';
import { ModalWrapper } from '../components/modal-wrapper.tsx';
import { colors } from '../theme/colors.ts';
import Toast from 'react-native-toast-message';

export const MyCollectionsPage = () => {
  const navigation = useNavigation<NativeStackNavigationProp<StackParams>>();

  const [collections, setCollections] = useState<string[]>([]);
  const [cardCount, setCardCount] = useState<{ [key: string]: number }>({});
  const [newCollectionName, setNewCollectionName] = useState<string>('');
  const [oldCollectionName, setOldCollectionName] = useState<string>('');
  const [addModalVisibility, setAddModalVisibility] = useState<boolean>(false);
  const [forUpdate, setForUpdate] = useState<boolean>(true);
  const [inputError, setInputError] = useState<boolean>(false);

  const newCollection = async (collectionName: string) => {
    const db = await getDbConnection();
    const prettyName = collectionName.trim().replaceAll(/\s+/g, '_');
    await createTable(db, prettyName);
  };

  const renameCollection = async (collectionName: string, newName: string) => {
    const db = await getDbConnection();
    const prettyName = newName.trim().replaceAll(/\s+/g, '_');
    await renameTable(db, collectionName, prettyName);
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
        names.push(result.rows.item(i).name);
      }
    });

    setCollections(names);
  }, []);

  const cardCountRetriever = async () => {
    const db = await getDbConnection();

    const counts: { [key: string]: number } = {};

    for (const name of collections) {
      const result = await numberOfRecords(db, name);
      counts[name] = result.rows.item(0).count;
    }

    setCardCount(counts);
  };

  useEffect(() => {
    listCollections();
  }, [listCollections]);

  cardCountRetriever();

  return (
    <View style={styles.container}>
      <ModalWrapper
        visible={addModalVisibility}
        forUpdate={forUpdate}
        onBlueButtonPress={async () => {
          forUpdate
            ? await renameCollection(oldCollectionName, newCollectionName)
            : await newCollection(newCollectionName);
          await listCollections();
          setNewCollectionName('');
          setAddModalVisibility(false);
        }}
        onRedButtonPress={() => {
          setAddModalVisibility(false);
          setNewCollectionName('');
          setInputError(false);
        }}
      >
        <View style={styles.inputFieldWrapper}>
          <TextInput
            style={styles.inputField}
            placeholder="Collection name"
            placeholderTextColor={colors.night.placeholder}
            value={newCollectionName.replaceAll('_', ' ')}
            onChangeText={text => {
              if (/^[a-zA-Z0-9 ]*$/.test(text)) {
                setInputError(false);
                setNewCollectionName(text);
              } else {
                setInputError(true);
              }
            }}
          />
          {inputError && (
            <Text style={styles.errorText}>
              Only use letters, numbers & spaces
            </Text>
          )}
        </View>
      </ModalWrapper>
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {collections.length > 0 ? (
          collections.map((collection, index) => {
            return (
              <ListItemWrapper
                key={collection}
                index={index}
                listView="Collection"
                mainText={collection.replaceAll('_', ' ')}
                secondaryText={`${cardCount[collection]} Cards`}
                onPress={() =>
                  navigation.navigate('CardsPage', {
                    collectionName: collection,
                  })
                }
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
                onQuiz={() =>
                  cardCount[collection] > 1
                    ? navigation.navigate('QuizPage', {
                        collectionName: collection,
                      })
                    : Toast.show({
                        type: 'error',
                        text1: 'Quiz Not Available',
                        text2: 'Please add at least 2 cards before starting.',
                        position: 'bottom',
                      })
                }
              />
            );
          })
        ) : (
          <Text style={styles.emptyText}>
            {'You do not have any collections.' +
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
    backgroundColor: colors.pale_purple.standard,
  },
  scrollView: {
    width: '100%',
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 8,
  },
  inputFieldWrapper: {
    width: '100%',
    marginBottom: 16,
  },
  inputField: {
    borderWidth: 2,
    borderColor: colors.night.standard,
    backgroundColor: colors.pale_purple.light,
    borderRadius: 8,
    padding: 16,
    width: '100%',
    fontSize: 16,
    fontFamily: 'SpaceMono-Bold',
  },
  emptyText: {
    fontFamily: 'SpaceMono-Regular',
    textAlign: 'center',
    paddingTop: '70%',
    color: colors.night.placeholder,
  },
  errorText: {
    fontFamily: 'SpaceMono-Regular',
    color: colors.imperialRed,
  },
});
