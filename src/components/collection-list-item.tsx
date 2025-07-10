import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export const CollectionListItem = ({
  mainText,
  secondaryText,
}: {
  mainText: string;
  secondaryText: string;
}) => {
  return (
    <View style={styles.listItemContainer}>
      <Text style={styles.mainText}>{mainText}</Text>
      <Text style={styles.secondaryText}>{secondaryText}</Text>
    </View>
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
});
