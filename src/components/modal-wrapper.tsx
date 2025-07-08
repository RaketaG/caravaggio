import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { BlueButton } from './blue-button';
import { TextButton } from './text-button';

type ModalWrapperType = {
  visible: boolean;
  forUpdate: boolean;
  onBlueButtonPress: () => void;
  onRedButtonPress: () => void;
  children: React.ReactNode;
};

export const ModalWrapper = ({
  visible,
  forUpdate,
  onBlueButtonPress,
  onRedButtonPress,
  children,
}: ModalWrapperType) => {
  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.centeredView}
      >
        <View style={styles.modalView}>
          {children}
          <BlueButton
            label={forUpdate ? 'Change' : 'Create'}
            onPress={onBlueButtonPress}
          />
          <TextButton
            label="Cancel"
            color="#ff383c"
            marginTop={16}
            onPress={onRedButtonPress}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalView: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    backgroundColor: '#FFFFFF',
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
