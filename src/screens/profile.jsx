import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, TextInput, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStreamChat } from '../context/StreamChatContext';
import { LinearGradient } from 'expo-linear-gradient';

const ProfileScreen = ({ navigation }) => {
  const { client } = useStreamChat();
  const [username, setUsername] = useState(client.user.name);
  const [contactNumber, setContactNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  const handleSave = () => {
    navigation.navigate('Home');
  };

  return (
    <ImageBackground source={require('../assets/backgrounds/profileBackground3.png')} style={styles.container}>
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
      <View style={styles.profileContent}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: client.user.image }}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editIcon}>
            <Ionicons name="camera-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contact Number</Text>
          <TextInput
            style={styles.input}
            value={contactNumber}
            onChangeText={setContactNumber}
            keyboardType="phone-pad"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <TouchableOpacity onPress={handleSave}>
          <LinearGradient
            colors={['#8A2BE2', '#4B0082']}
            style={styles.saveButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

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
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
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
  profileContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4B0082',
    borderRadius: 15,
    padding: 5,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4B0082',
    margin: 10,
  },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 10,
    backgroundColor: '#fff',
  },
  saveButton: {
    width: 150,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
