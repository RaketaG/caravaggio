import { Pressable, StyleSheet, Text } from 'react-native';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import { colors } from '../theme/colors';
import { CollectionListItem } from './collection-list-item';
import { CardsListItem } from './cards-list-item';

type ListItemType = {
  onDelete?: () => void;
  onRename?: () => void;
  onQuiz?: () => void;
  onPress?: () => void;
  mainText: string;
  secondaryText: string;
  index: number;
  listView: 'Collection' | 'Cards';
};

export const ListItemWrapper = ({
  onDelete,
  onRename,
  onQuiz,
  onPress,
  mainText,
  secondaryText,
  index,
  listView,
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
        {listView === 'Collection' ? (
          <CollectionListItem
            mainText={mainText}
            secondaryText={secondaryText}
          />
        ) : (
          <CardsListItem
            mainText={mainText}
            secondaryText={secondaryText}
            index={index}
          />
        )}
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
  textFormat: {
    fontSize: 16,
  },
  deleteText: {
    color: colors.imperialRed,
  },
});
