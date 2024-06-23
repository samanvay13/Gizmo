import React, { useState } from 'react';
import { Alert, StyleSheet, View, Text } from 'react-native';
import { Input, Button } from '@rneui/themed';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthProvider';

export default function Auth({ navigation }) {
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signIn(email, password);
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert(error.message);
    }
    setLoading(false);
  };

  const handleSignUp = async () => {
    setLoading(true);
    try {
      await signUp(email, password);
      Alert.alert('Account registered successfully!');
    } catch (error) {
      Alert.alert(error.message);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={{ paddingLeft: 10 }} onPress={() => navigation.goBack()}>
          <Ionicons name="close-outline" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="exit-outline" size={24} color="white" />
          <Text style={styles.logoutText}>Sign-out</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Email"
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Password"
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button title="Sign in" disabled={loading} onPress={handleSignIn} />
      </View>
      <View style={styles.verticallySpaced}>
        <Button title="Sign up" disabled={loading} onPress={handleSignUp} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 40,
    backgroundColor: '#4B0082',
    paddingVertical: 18,
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
    marginLeft: 20,
  },
  logoutButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 10,
  },
  logoutText: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
  },
  verticallySpaced: {
    marginTop: 40,
    padding: 12,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
});
