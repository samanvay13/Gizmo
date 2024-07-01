import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, FlatList, Image, TouchableOpacity, Dimensions, Text, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthProvider';
import { supabase } from '../lib/supabase';

const avatarData = [
  require('../assets/avatars/sapiens1.png'),
  require('../assets/avatars/sapiens2.png'),
  require('../assets/avatars/sapiens3.png'),
  require('../assets/avatars/sapiens4.png'),
  require('../assets/avatars/sapiens5.png'),
  require('../assets/avatars/sapiens6.png'),
  require('../assets/avatars/sapiens7.png'),
  require('../assets/avatars/sapiens8.png'),
  require('../assets/avatars/sapiens9.png'),
  require('../assets/avatars/sapiens10.png'),
  require('../assets/avatars/sapiens11.png'),
  require('../assets/avatars/sapiens12.png'),
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

const { width } = Dimensions.get('window');
const ITEM_SIZE = width * 0.7;

const AvatarSelectionScreen = () => {
  const { session } = useAuth();
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const [data, setData] = useState([...avatarData, ...avatarData, ...avatarData]);
  const [selectedIndex, setSelectedIndex] = useState(avatarData.length);
  const [pseudonym, setPseudonym] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(avatarURLs[0]);

  useEffect(() => {
    // Scroll to the middle of the list
    setTimeout(() => {
      flatListRef.current.scrollToIndex({ index: avatarData.length, animated: false });
    }, 0);

    // Fetch user profile data
    const fetchProfile = async () => {
      try {
        if (!session?.user) throw new Error('No user on the session!');
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, avatar_url')
          .eq('id', session.user.id)
          .single();
        if (error) {
          throw error;
        }
        setPseudonym(data.username);
        setAvatarUrl(data.avatar_url);

        const avatarIndex = avatarURLs.indexOf(data.avatar_url);
        if (avatarIndex !== -1) {
          setSelectedIndex(avatarIndex + avatarData.length);
          flatListRef.current.scrollToIndex({ index: avatarIndex + avatarData.length, animated: false });
        }
      } catch (error) {
        if (error instanceof Error) {
          Alert.alert('Error', error.message);
        }
      }
    };

    fetchProfile();
  }, [session]);

  const renderItem = ({ item, index }) => {
    const isCentered = index === selectedIndex;
    const scale = isCentered ? 1.7 : 0.8;
    const opacity = isCentered ? 1 : 0.5;

    return (
      <View style={{ width: ITEM_SIZE }}>
        <Image
          source={item}
          style={[styles.avatar, { transform: [{ scale }], opacity }]}
          resizeMode="contain"
        />
      </View>
    );
  };

  const scrollToIndex = (index) => {
    setSelectedIndex(index);
    flatListRef.current.scrollToIndex({ animated: true, index });
    setAvatarUrl(avatarURLs[index % avatarData.length]);
  };

  const handleLeftPress = () => {
    const newIndex = selectedIndex > 0 ? selectedIndex - 1 : data.length - 1;
    scrollToIndex(newIndex);
  };

  const handleRightPress = () => {
    const newIndex = selectedIndex < data.length - 1 ? selectedIndex + 1 : 0;
    scrollToIndex(newIndex);
  };

  const onMomentumScrollEnd = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / ITEM_SIZE);

    if (index === 0) {
      flatListRef.current.scrollToIndex({ index: avatarData.length, animated: false });
      setSelectedIndex(avatarData.length);
    } else if (index === data.length - 1) {
      flatListRef.current.scrollToIndex({ index: avatarData.length - 1, animated: false });
      setSelectedIndex(avatarData.length - 1);
    } else {
      setSelectedIndex(index);
    }
  };

  const getItemLayout = (data, index) => ({
    length: ITEM_SIZE,
    offset: ITEM_SIZE * index,
    index,
  });

  const updateProfile = async () => {
    try {
      if (!session?.user) throw new Error('No user on the session!');

      const updates = {
        id: session?.user.id,
        username: pseudonym,
        avatar_url: avatarUrl,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) {
        throw error;
      }
      Alert.alert('Success', 'Profile updated successfully');
      navigation.navigate('Home');
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      }
    }
  };

  return (
    <LinearGradient
      colors={['#4B0082', '#000']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-outline" size={25} color="white" />
      </TouchableOpacity>
      <View style={styles.avatarHeader}>
        <Text style={styles.avatarHeaderText}>Pseudonym</Text>
        <Text style={styles.avatarHeaderSubText}>Use a cool avatar and create an anonymous name for yourself!</Text>
      </View>
      <View style={styles.pseudonym}>
        <Text style={styles.preInput}>@ |</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your pseudonym"
          placeholderTextColor="#aaa"
          value={pseudonym}
          onChangeText={setPseudonym}
          autoCapitalize="none"
        />
      </View>
      <View style={styles.arrowsContainer}>
        <TouchableOpacity onPress={handleLeftPress} style={styles.arrowButton}>
          <Ionicons name="chevron-back-outline" size={40} color="white" />
        </TouchableOpacity>
        <FlatList
          ref={flatListRef}
          data={data}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ alignItems: 'center' }}
          snapToInterval={ITEM_SIZE}
          decelerationRate="fast"
          renderItem={renderItem}
          onMomentumScrollEnd={onMomentumScrollEnd}
          getItemLayout={getItemLayout}
        />
        <TouchableOpacity onPress={handleRightPress} style={styles.arrowButton}>
          <Ionicons name="chevron-forward-outline" size={40} color="white" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.goButton} onPress={updateProfile}>
        <LinearGradient
          colors={['#00ff7f', '#006400']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.goButtonGradient}
        >
          <Text style={styles.goButtonText}>Go!</Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 15,
    zIndex: 1,
  },
  avatarHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  avatarHeaderText: {
    padding: 20,
    fontSize: 30,
    color: '#fff'
  },
  avatarHeaderSubText: {
    paddingHorizontal: 30,
    fontSize: 16,
    color: '#fff'
  },
  pseudonym: {
    flexDirection: 'row',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 0.5,
    borderRadius: 5,
    marginBottom: 60,
  },
  preInput: {
    top: 2,
    color: '#fff',
    fontSize: 17,
  },
  input: {
    paddingHorizontal: 10,
    color: '#FFFAA0',
    fontSize: 17,
  },
  arrowsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowButton: {},
  avatar: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    marginLeft: 25,
  },
  goButton: {
    marginTop: 100,
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
  },
  goButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AvatarSelectionScreen;
