import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

const Background_Colors = [
  colors.periwinkle[500],
  colors.melon[500],
  colors.vanilla[500],
];

export const CardsListItem = ({
  mainText,
  secondaryText,
  index,
}: {
  mainText: string;
  secondaryText: string;
  index: number;
}) => {
  return (
    <View style={styles.listItemContainer}>
      <View
        style={[
          styles.mainTextContainer,
          { backgroundColor: Background_Colors[index] },
        ]}
      >
        <Text style={styles.mainText}>{mainText}</Text>
      </View>
      <View style={styles.secondaryTextContainer}>
        <Text style={styles.secondaryText}>{secondaryText}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  listItemContainer: {
    borderWidth: 2,
    padding: 2,
    borderColor: colors.night[500],
    backgroundColor: colors.white[500],
    borderRadius: 8,
    width: '100%',
    marginBottom: 8,
  },
  mainTextContainer: {
    borderRadius: 8,
    width: '100%',
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainText: {
    fontSize: 20,
    fontWeight: 600,
    color: colors.night[500],
    marginBottom: 8,
  },
  secondaryTextContainer: {
    padding: 14,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  secondaryText: {
    fontSize: 16,
    fontWeight: 400,
    color: colors.night[600],
  },
});
