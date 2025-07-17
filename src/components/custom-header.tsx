import { Pressable, StyleSheet, Text, View, Platform } from 'react-native';
import { colors } from '../theme/colors';
import { IconBack } from '../../assets/icon-back';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconExercise } from '../../assets/icon-exercise';
import { IconHome } from '../../assets/icon-home';

type CustomerHeaderType = {
  goBack?: () => void;
  onAction?: () => void;
  headerText: string;
  action?: string;
};

export const CustomHeader = ({
  headerText,
  onAction,
  action,
  goBack,
}: CustomerHeaderType) => {
  return (
    <SafeAreaView style={styles.safeAreaView} edges={['top']}>
      <View
        style={[
          styles.container,
          // eslint-disable-next-line react-native/no-inline-styles
          { justifyContent: goBack ? 'space-between' : 'center' },
        ]}
      >
        {goBack && (
          <Pressable
            style={({ pressed }) => [
              styles.buttonStyle,
              pressed && styles.buttonPressed,
            ]}
            onPress={goBack}
          >
            <IconBack color={colors.night.standard} />
          </Pressable>
        )}
        <Text style={styles.headerText}>{headerText}</Text>
        {onAction && (
          <Pressable
            style={({ pressed }) => [
              styles.buttonStyle,
              pressed && styles.buttonPressed,
            ]}
            onPress={onAction}
          >
            {action === 'quiz' ? (
              <IconExercise color={colors.night.standard} size={24} />
            ) : (
              <IconHome color={colors.night.standard} size={24} />
            )}
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    width: '100%',
    backgroundColor: colors.lightCyan,
  },
  container: {
    height: Platform.OS === 'android' ? 64 : 40,
    backgroundColor: colors.lightCyan,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: Platform.OS === 'android' ? 8 : 0,
  },
  buttonStyle: {
    backgroundColor: colors.fawn,
    borderColor: colors.night.standard,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  buttonPressed: {
    opacity: 0.6,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'SpaceMono-Bold',
  },
});
