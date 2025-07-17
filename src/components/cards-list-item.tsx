import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export const Background_Colors = [
  colors.periwinkle,
  colors.melon,
  colors.vanilla,
  colors.lightCyan,
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
          {
            backgroundColor:
              Background_Colors[
                index % Background_Colors.length
              ],
          },
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
    borderColor: colors.night.standard,
    backgroundColor: colors.white,
    borderRadius: 8,
    width: '100%',
    marginBottom: 8,
  },
  mainTextContainer: {
    borderRadius: 8,
    borderColor: colors.white,
    borderWidth: 2,
    width: '100%',
    padding: 8,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainText: {
    fontSize: 18,
    fontFamily: 'SpaceMono-Bold',
    color: colors.night.standard,
  },
  secondaryTextContainer: {
    paddingHorizontal: 8,
    paddingBottom: 8,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  secondaryText: {
    fontSize: 14,
    fontFamily: 'SpaceMono-Regular',
    color: colors.night.light,
  },
});
