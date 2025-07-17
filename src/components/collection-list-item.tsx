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
    borderColor: colors.night.standard,
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 8,
    width: '100%',
    fontSize: 16,
    marginBottom: 8,
  },
  mainText: {
    fontSize: 22,
    fontFamily: 'SpaceMono-Bold',
    color: colors.night.standard,
    marginBottom: 4,
  },
  secondaryText: {
    fontSize: 16,
    fontFamily: 'SpaceMono-Bold',
    color: colors.night.light,
  },
});
