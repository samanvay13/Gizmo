import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthProvider';
import { supabase } from '../lib/supabase';

const ProfileScreen = () => {
  const { session, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [contact_number, setContact_Number] = useState(null);
  const [website, setWebsite] = useState(null);
  const navigation = useNavigation();

  const avatarData = [
    require('../assets/avatarsBackgrounds/sapiensBG1.png'),
    require('../assets/avatarsBackgrounds/sapiensBG2.png'),
    require('../assets/avatarsBackgrounds/sapiensBG3.png'),
    require('../assets/avatarsBackgrounds/sapiensBG4.png'),
    require('../assets/avatarsBackgrounds/sapiensBG5.png'),
    require('../assets/avatarsBackgrounds/sapiensBG6.png'),
    require('../assets/avatarsBackgrounds/sapiensBG7.png'),
    require('../assets/avatarsBackgrounds/sapiensBG8.png'),
    require('../assets/avatarsBackgrounds/sapiensBG9.png'),
    require('../assets/avatarsBackgrounds/sapiensBG10.png'),
    require('../assets/avatarsBackgrounds/sapiensBG11.png'),
    require('../assets/avatarsBackgrounds/sapiensBG12.png'),
  ];
  
  const avatarURLs = [
    'https://i.postimg.cc/Tw7XxhjH/sapiens1.png',
    'https://i.postimg.cc/1XbhgTjG/sapiens2.png',
    'https://i.postimg.cc/C5RpxYmM/sapiens3.png',
    'https://i.postimg.cc/NMfwZRXH/sapiens4.png',
    'https://i.postimg.cc/RCYzb6ZW/sapiens5.png',
    'https://i.postimg.cc/4NhTCfYB/sapiens6.png',
    'https://i.postimg.cc/jS0YtpNK/sapiens7.png',
    'https://i.postimg.cc/zGCZBxSh/sapiens8.png',
    'https://i.postimg.cc/cJdq8fXb/sapiens9.png',
    'https://i.postimg.cc/s2mkP1LD/sapiens10.png',
    'https://i.postimg.cc/Y9SJdMcN/sapiens11.png',
    'https://i.postimg.cc/QtnvPws2/sapiens12.png',
  ];

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, avatar_url, contact_number, website`)
        .eq('id', session?.user.id)
        .single();
        
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setAvatarUrl(data.avatar_url);
        setContact_Number(data.contact_number);
        setWebsite(data.website);
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
        contact_number,
        website: website,
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

  const avatarIndex = avatarURLs.indexOf(avatarUrl);
  const avatarBackground = avatarIndex !== -1 ? avatarData[avatarIndex] : require('../assets/images/image.png');

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={['#4B0082', '#000']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Ionicons name="arrow-back-outline" size={25} color="white" />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.headerTitle}>@ {username}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="exit-outline" size={25} color="white" />
        </TouchableOpacity>
      </LinearGradient>
      <View style={styles.imageContainer}>
        <Image
          source={avatarBackground}
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.editIcon} onPress={() => navigation.navigate('AvatarSelection')}>
          <Ionicons name="build-outline" size={20} color="white" />
        </TouchableOpacity>
      </View>
      <LinearGradient
        colors={['#4B0082', '#000']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.profileCard}
      >
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
            onChangeText={setContact_Number}
            keyboardType="phone-pad"
            placeholder='+91 XXXXXXXXXX'
            placeholderTextColor={'#ccc'}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Website</Text>
          <TextInput
            style={styles.input}
            value={website || ''}
            onChangeText={setWebsite}
            placeholder='https://example.com'
            placeholderTextColor={'#ccc'}
          />
        </View>
        <TouchableOpacity onPress={updateProfile}>
          <LinearGradient
            colors={['#00ff7f', '#006400']}
            style={styles.saveButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 25,
    backgroundColor: '#4B0082',
    paddingBottom: 20,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 22,
  },
  profileCard: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    backgroundColor: '#4B0082',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    top: -25,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,  
    elevation: 10
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',  
    marginHorizontal: 50,
  },
  profileImage: {
    width: 350,
    height: 350,
  },
  editIcon: {
    position: 'absolute',
    top: 20,
    right: 40,
    backgroundColor: '#4B0082',
    borderRadius: 15,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,  
    elevation: 10
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFAA0',
    margin: 10,
  },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
  },
  saveButton: {
    width: 150,
    height: 50,
    alignSelf: 'center',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
