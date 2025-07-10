import { Pressable, StyleSheet } from 'react-native';
import { IconAdd } from '../../assets/icon-add';
import { colors } from '../theme/colors';

type ListItemType = {
  onPress: () => void;
};

export const AddButton = ({ onPress }: ListItemType) => {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      onPress={onPress}
    >
      <IconAdd color={colors.night[500]}/>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 42,
    bottom: 64,
    backgroundColor: colors.fawn[500],
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  buttonPressed: {
    opacity: 0.6,
  },
});
