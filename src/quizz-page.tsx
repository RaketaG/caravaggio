import { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import { getDbConnection, listRecords } from "./db-service";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackParams } from "../App";
import { CardType } from "./cards-page";
import { TextButton } from "./components/text-button";
import { useNavigation } from "@react-navigation/native";

export const QuizzPage = ({ route }: NativeStackScreenProps<StackParams, "QuizzPage">) => {
    const navigation = useNavigation<NativeStackNavigationProp<StackParams>>();
    const  { collectionName } = route.params;
    const [cards, setCards] = useState<CardType[]>([]);
    const [counter, setCounter] = useState<number>(0);

    const headerRight = useCallback(() => {
        return (
          <TextButton
            label="Collections"
            onPress={() => navigation.popToTop()}
          />
        );
      }, [navigation])
      
      useEffect(() => {
        navigation.setOptions({
          headerRight: headerRight
        })
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

    return(
        <View style={styles.container}>
            <Pressable
                style={styles.card}
                onPress={() => counter < cards.length - 1 ? setCounter(counter + 1) : setCounter(0)}
            >
                {cards[counter] && <Text>{cards[counter].word}</Text>}
            </Pressable>
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
  card: {
    width: "50%",
    height: "50%",
    backgroundColor: "linen",
    elevation: 3
  }
})