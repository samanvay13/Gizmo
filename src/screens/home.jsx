import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, Platform, TouchableOpacity, Image, Animated, TextInput, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { ChannelList, Chat, OverlayProvider } from 'stream-chat-expo';
import { useStreamChat } from '../context/StreamChatContext';
import { useAuth } from '../context/AuthProvider';
import { supabase } from '../lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreen = ({ navigation }) => {
  const { client, isUserConnected } = useStreamChat();
  const { session } = useAuth();
  const [channel, setChannel] = useState(null);
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const searchBarWidth = useRef(new Animated.Value(0)).current;

  const [fontsLoaded] = useFonts({
    'Bradley-Hand': require('../assets/fonts/bradhitc.ttf'),
  });

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

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) {
        throw new Error('No user on the session!');
      }

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, avatar_url, contact_number, website`)
        .eq('id', session?.user.id)
        .single();
        
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        // setUsername(data.username);
        setAvatarUrl(data.avatar_url);
        // setContact_Number(data.contact_number);
        // setWebsite(data.website);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    Animated.timing(searchBarWidth, {
      toValue: isSearchVisible ? 320 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isSearchVisible]);

  const onProfilePressed = () => {
    navigation.navigate('Profile');
  };

  const onChannelPressed = (channel) => {
    setChannel(channel);
    navigation.navigate('Channel', { channelId: channel.id });
  };

  const toggleSearchBar = () => {
    setSearchVisible(!isSearchVisible);
  };

  const closeSearchBar = () => {
    setSearchVisible(false);
  };

  const onAddUsersPressed = () => {
    navigation.navigate('Users');
  }

  if (!fontsLoaded || !isUserConnected) {
    return null;
  }
  
  const avatarIndex = avatarURLs.indexOf(avatarUrl);
  const avatarBackground = avatarIndex !== -1 ? avatarData[avatarIndex] : require('../assets/images/image.png');

  const filters = { members: { $in: [session.user.id] } };

  return (
    <OverlayProvider>
      <Chat client={client}>
        <View style={styles.container}>
          <StatusBar barStyle="light-content" />
          <LinearGradient
            colors={['#4B0082', '#000']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <View style={styles.headerLeft}>
              {!isSearchVisible && <Text style={styles.headerTitle}>GIZMO</Text>}
            </View>
            <View style={styles.headerRight}>
              {isSearchVisible && (
                <Animated.View style={[styles.searchBar, { width: searchBarWidth }]}>
                  <TouchableOpacity style={{ paddingLeft: 10 }} onPress={closeSearchBar}>
                    <Ionicons name="close-outline" size={24} color="#4B0082" />
                  </TouchableOpacity>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                  <TouchableOpacity style={{ paddingRight: 10 }} onPress={() => {}}>
                    <Ionicons name="search-outline" size={24} color="#4B0082" />
                  </TouchableOpacity>
                </Animated.View>
              )}
              {!isSearchVisible && (
                <TouchableOpacity style={{ paddingRight: 10 }} onPress={toggleSearchBar}>
                  <Ionicons name="search-outline" size={24} color="white" />
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.avatarContainer} onPress={onProfilePressed}>
                {avatarUrl ? (
                  <Image
                    source={avatarBackground}
                    style={styles.avatar}
                  />
                ) : (
                  <Image
                    source={require('../assets/images/image.png')}
                    style={styles.avatarAlt}
                  />
                )}
              </TouchableOpacity>
            </View>
          </LinearGradient>
          <ChannelList
            onSelect={onChannelPressed}
            filters={filters}
            sort={{ last_message_at: -1 }}
            options={{ state: true, watch: true }}
          />
          <TouchableOpacity style={styles.addButton} onPress={onAddUsersPressed}>
            <LinearGradient
              colors={['#8A2BE2', '#4B0082']}
              style={styles.addButtonGradient}
            >
              <Ionicons name="add" size={36} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Chat>
    </OverlayProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 30,
    fontFamily: 'Bradley-Hand',
    marginLeft: 20,
    paddingVertical: 10,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    height: 40,
    marginLeft: 10,
    backgroundColor: 'white',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  avatarContainer: {
    marginHorizontal: 10,
  },
  avatar: {
    width: 35,
    height: 70,
  },
  avatarAlt: {
    width: 35,
    height: 70,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,  
    elevation: 10,
  },
  addButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    borderRadius: 30,
  },
});

export default HomeScreen;
