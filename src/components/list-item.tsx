import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import { colors } from '../theme/colors';

type ListItemType = {
  onDelete?: () => void;
  onRename?: () => void;
  onQuiz?: () => void;
  onPress?: () => void;
  mainText: string;
  secondaryText: string;
};

export const ListItem = ({
  onDelete,
  onRename,
  onQuiz,
  onPress,
  mainText,
  secondaryText,
}: ListItemType) => {
  return (
    <Menu>
      <MenuTrigger
        triggerOnLongPress={true}
        customStyles={{
          TriggerTouchableComponent: Pressable,
          triggerTouchable: {
            onPress: onPress,
          },
        }}
      >
        <View style={styles.listItemContainer}>
          <Text style={styles.mainText}>{mainText}</Text>
          <Text style={styles.secondaryText}>{secondaryText}</Text>
        </View>
      </MenuTrigger>

      <MenuOptions
        customStyles={{
          optionsContainer: {
            backgroundColor: '#FFFFFF',
            paddingVertical: 4,
            borderRadius: 8,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowOffset: { width: 0, height: 4 },
            shadowRadius: 12,
            elevation: 6,
            marginLeft: 128,
          },
          optionWrapper: {
            paddingVertical: 12,
            paddingHorizontal: 16,
          },
        }}
      >
        {onQuiz && (
          <MenuOption onSelect={onQuiz}>
            <Text style={styles.textFormat}>Quiz</Text>
          </MenuOption>
        )}
        {onRename && (
          <MenuOption onSelect={onRename}>
            <Text style={styles.textFormat}>Rename</Text>
          </MenuOption>
        )}
        <MenuOption onSelect={onDelete}>
          <Text style={[styles.deleteText, styles.textFormat]}>Delete</Text>
        </MenuOption>
      </MenuOptions>
    </Menu>
  );
};

const styles = StyleSheet.create({
  listItemContainer: {
    borderWidth: 2,
    borderColor: colors.night[500],
    backgroundColor: colors.white[500],
    borderRadius: 8,
    padding: 16,
    width: '100%',
    fontSize: 16,
    marginBottom: 8,
  },
  mainText: {
    fontSize: 20,
    fontWeight: 600,
    color: colors.night[500],
    marginBottom: 8,
  },
  secondaryText: {
    fontSize: 16,
    fontWeight: 400,
    color: colors.night[600],
  },
  textFormat: {
    fontSize: 16,
  },
  deleteText: {
    color: colors.imperial_red[500],
  },
});
