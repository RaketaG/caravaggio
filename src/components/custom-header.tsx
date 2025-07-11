import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { IconBack } from '../../assets/icon-back';

type CustomerHeaderType = {
  goBack?: () => void;
  onAction?: () => void;
  headerText: string;
  actionText?: string;
};

export const CustomHeader = ({
  headerText,
  onAction,
  actionText,
  goBack,
}: CustomerHeaderType) => {
  return (
    <View style={styles.container}>
      {goBack && (
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={goBack}
        >
          <IconBack color={colors.night[500]} />
        </Pressable>
      )}
      <Text style={styles.headerText}>{headerText}</Text>
      {onAction && (
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={onAction}
        >
          <Text style={styles.actionText}>{actionText}</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.light_cyan[500],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
    zIndex: 1,
  },
  backButton: {
    backgroundColor: colors.fawn[500],
    borderColor: colors.night[500],
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
    height: 32,
    borderRadius: 8,
    zIndex: 2,
  },
  actionButton: {
    backgroundColor: colors.fawn[500],
    borderColor: colors.night[500],
    borderWidth: 2,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    height: 32,
    borderRadius: 8,
    zIndex: 2,
  },
  buttonPressed: {
    opacity: 0.6,
  },
  headerText: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'SpaceMono-Bold',
    zIndex: 1,
  },
  actionText: {
    fontFamily: 'SpaceMono-Bold',
  },
});
