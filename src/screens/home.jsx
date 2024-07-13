import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Animated, TextInput, StatusBar, Alert, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { ChannelList, Chat, OverlayProvider } from 'stream-chat-expo';
import { useStreamChat } from '../context/StreamChatContext.jsx';
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
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchBarWidth = useRef(new Animated.Value(0)).current;

  const [fontsLoaded] = useFonts({
    'Bradley-Hand': require('../assets/fonts/bradhitc.ttf'),
  });

  useEffect(() => {
    getProfile();
  }, [session?.user]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) {
        navigation.navigate("Login");
        // throw new Error('No user on the session!');
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
    setSearchQuery('');
  };

  const onAddUsersPressed = () => {
    navigation.navigate('Users');
  };

  const fetchUsers = async (query) => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .ilike('username', `%${query}%`)
        .neq('id', session.user.id);

      if (error) {
        throw error;
      }

      setUsers(data);
    } catch (error) {
      Alert.alert('Error fetching users', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    fetchUsers(query);
  };

  const onUserPress = async (item) => {
    try {
      const channel = client.channel('messaging', {
        members: [session.user.id, item.id],
      });
      await channel.watch();
      navigation.navigate('Channel', { channelId: channel.id });
    } catch (error) {
      console.error('Error creating or watching channel:', error);
    }
  };

  const renderUserItem = ({ item }) => (
    <TouchableOpacity style={styles.userItem} onPress={() => onUserPress(item)}>
      <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
      <Text style={styles.username}>{item.username}</Text>
    </TouchableOpacity>
  );

  if (!fontsLoaded || !isUserConnected) {
    return null;
  }

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

  const avatarIndex = avatarURLs.indexOf(avatarUrl);
  const avatarBackground = avatarIndex !== -1 ? avatarData[avatarIndex] : require('../assets/images/image.png');

  const filters = { type: 'messaging', members: { $in: [session?.user?.id] } };

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
                    onChangeText={handleSearch}
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
                    style={styles.myAvatar}
                  />
                ) : (
                  <Image
                    source={require('../assets/images/image.png')}
                    style={styles.myAvatarAlt}
                  />
                )}
              </TouchableOpacity>
            </View>
          </LinearGradient>
          <View style={styles.channelList}>
            {loading ? (
              <Text style={styles.placeholderText}>Loading...</Text>
            ) : searchQuery.trim() === '' ? (
              <ChannelList filters={filters} onSelect={onChannelPressed} />
            ) : (
              <FlatList
                data={users}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderUserItem}
                ListEmptyComponent={
                  <View style={styles.notFound}>
                    <Image source={require('../assets/avatars/notFound2.png')} style={styles.notFoundImage}></Image>
                    <TouchableOpacity style={{ paddingRight: 10, marginBottom: 10 }} onPress={() => fetchUsers(searchQuery)}>
                      <Ionicons name="sad-outline" size={30} color="#4B0082" />
                    </TouchableOpacity>
                    <Text style={styles.placeholderText}>
                      Sorry, couldn't find the one you're looking for.
                    </Text>
                  </View>
                }
              />
            )}
          </View>
          <TouchableOpacity style={styles.usersButton} onPress={onAddUsersPressed}>
            <LinearGradient
              colors={['#9300ff', '#40006f']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.usersButtonGradient}
            >
              <Ionicons name="add-outline" size={30} color="white" />
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 36,
    fontFamily: 'Bradley-Hand',
    marginLeft: 15,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    paddingLeft: 5,
  },
  myAvatar: {
    width: 35,
    height: 70,
    marginLeft: 10,
  },
  myAvatarAlt: {
    width: 35,
    height: 35,
    marginVertical: 17.5,
  },
  searchBar: {
    height: 40,
    marginRight: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  placeholderText: {
    fontSize: 16,
    color: '#505050',
    textAlign: 'center',
    marginBottom: 10,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B0082',
  },
  channelList: {
    flex: 1,
    backgroundColor: '#fff',
  },
  usersButton: {
    alignSelf: 'flex-end',
    width: 70,
    height: 70,
    right: 20,
    bottom: 30,
    borderRadius: 35,
    elevation: 15,
    overflow: 'hidden',
  },
  usersButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFound: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundImage: {
    marginTop: 100,
    marginBottom: 50,
    height: 370,
    width: 370,
  },
});

export default HomeScreen;
