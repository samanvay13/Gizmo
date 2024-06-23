import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthProvider';
import { supabase } from '../lib/supabase';
import { BackgroundImage } from '@rneui/themed/dist/config';

const ProfileScreen = () => {
  const { session, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [contact_number, setContactNumber] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, contact_number, avatar_url`)
        .eq('id', session?.user.id)
        .single();
        
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setContactNumber(data.contact_number);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      const updates = {
        id: session?.user.id,
        username,
        contact_number,
        avatar_url: avatarUrl,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
      navigation.navigate('Home');
    }
  }

  const handleLogout = () => {
    signOut();
    navigation.navigate('Login');
  };

  const IMAGE_URI = 'https://i.pinimg.com/564x/cc/34/a3/cc34a35e193df5f9a722083c53e86b76.jpg';

  return (
    <BackgroundImage source={{ uri: IMAGE_URI }} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={{ paddingLeft: 10 }} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="close-outline" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="exit-outline" size={24} color="white" />
          <Text style={styles.logoutText}>Sign-out</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.profileCard}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: avatarUrl || 'https://i.pinimg.com/564x/e6/33/ee/e633eefbeb77cd4323a1557d33c91c83.jpg' }}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editIcon}>
            <Ionicons name="camera-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={session?.user?.email || ''}
            editable={false}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contact Number</Text>
          <TextInput
            style={styles.input}
            value={contact_number || ''}
            onChangeText={setContactNumber}
            keyboardType="phone-pad"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={username || ''}
            onChangeText={setUsername}
          />
        </View>
      </View>
      <TouchableOpacity onPress={updateProfile}>
          <LinearGradient
            colors={['#8A2BE2', '#4B0082']}
            style={styles.saveButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </LinearGradient>
        </TouchableOpacity>
    </BackgroundImage>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEEEEE',
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
  profileCard: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Transparent white for glass effect
    borderRadius: 10,
    padding: 30,
    zIndex: 1,
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
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  saveButton: {
    width: 150,
    height: 50,
    alignSelf: 'center',
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
