import { Pressable, StyleSheet } from 'react-native';
import { IconAdd } from '../../assets/icon-add';

type ListItemType = {
  onPress: () => void;
};

export const AddButton = ({ onPress }: ListItemType) => {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      onPress={onPress}
    >
      <IconAdd />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 42,
    bottom: 64,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    borderRadius: 60,
    elevation: 3,
  },
  buttonPressed: {
    opacity: 0.6,
  },
});
