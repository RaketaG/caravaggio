import {
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../theme/colors';
import { IconExercise } from '../../assets/icon-exercise';
import { IconHome } from '../../assets/icon-home';
import { IconBack } from '../../assets/icon-back';

type CustomerHeaderType = {
  onAction?: () => void;
  action: 'back' | 'exercise' | 'home';
};

export const HeaderButton = ({ onAction, action }: CustomerHeaderType) => {
  const actionIcon = () => {
    switch (action) {
      case 'back':
        return <IconBack color={colors.night.standard} />;
      case 'exercise':
        return <IconExercise color={colors.night.standard} size={24} />;
      case 'home':
        return <IconHome color={colors.night.standard} size={24} />;
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity
      onPress={onAction}
      style={styles.buttonStyle}
      activeOpacity={0.6}
    >
      {actionIcon()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
});
