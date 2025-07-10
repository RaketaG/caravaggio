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
    backgroundColor: colors.mindaro[500],
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
    color: colors.night[500],
    fontWeight: '600',
    fontSize: 16,
  },
});
