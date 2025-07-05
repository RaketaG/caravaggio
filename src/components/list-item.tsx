import { Pressable, StyleSheet, Text } from "react-native";

type ListItemType = {
    onLongPress: () => void;
    onPress: () => void;
    mainText: string;
    secondaryText: string;
};

export const ListItem = ({ onLongPress, onPress, mainText, secondaryText }: ListItemType) => {
    return(
        <Pressable
            style={styles.listItemContainer}
            onLongPress={onLongPress}
            onPress={onPress}
        >
            <Text style={styles.mainText}>{mainText}</Text>
            <Text style={styles.secondaryText}>{secondaryText}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
  listItemContainer: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    width: "100%",
    fontSize: 16,
    marginBottom: 8,
  },
  mainText: {
    fontSize: 20,
    fontWeight: 600,
    color: "#000000",
    marginBottom: 8,
  },
  secondaryText: {
    fontSize: 16,
    fontWeight: 400,
    color: "#333333",
  }
});