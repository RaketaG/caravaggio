import { Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

type BlueButtonProps = {
  label: string;
  onPress: () => void;
};

export const BlueButton = ({ label, onPress }: BlueButtonProps) => {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.mindaro,
    borderRadius: 8,
    padding: 16,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.night["standard"],
    fontFamily: 'SpaceMono-Bold',
    fontSize: 16,
  },
});
