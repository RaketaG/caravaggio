import { useState } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { BlueButton } from '../components/green-button';
import { TextButton } from '../components/text-button';

export const LoginPage = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.inputFields}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.inputFields}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
      />
      <BlueButton label="Log In" onPress={() => {}} />
      <View style={styles.noAccountView}>
        <Text style={styles.noAccountText}>Do not have an account ?</Text>
        <TextButton label="Create one" onPress={() => {}} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: -168,
  },
  inputFields: {
    borderWidth: 2,
    borderColor: '#DDDDDD',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    width: '100%',
    fontSize: 16,
  },
  noAccountView: {
    alignItems: 'center',
    gap: 8,
  },
  noAccountText: {
    fontSize: 16,
    color: '#333333',
  },
});
