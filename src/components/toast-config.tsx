import { ErrorToast } from 'react-native-toast-message';
import { colors } from '../theme/colors.ts';
import { StyleSheet } from 'react-native';
import { ToastConfig } from 'react-native-toast-message';

export const toastConfig: ToastConfig = {
  error: (props) => (
    <ErrorToast
      {...props}
      style={styles.container}
      text1Style={styles.text1Style}
      text2Style={styles.text2Style}
    />
  ),
};

const styles = StyleSheet.create({
  container: {
    borderLeftColor: colors.imperialRed,
    backgroundColor: colors.white,
  },
  text1Style: {
    fontSize: 14,
    fontFamily: 'SpaceMono-Bold',
    color: colors.night.standard,
  },
  text2Style: {
    fontSize: 10,
    fontFamily: 'SpaceMono-Regular',
    color: colors.night.standard,
  },
});
