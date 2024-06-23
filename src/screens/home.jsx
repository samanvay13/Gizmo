import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, Platform, TouchableOpacity, Image, Animated, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { ChannelList, Chat, OverlayProvider } from 'stream-chat-expo';
import { useStreamChat } from '../context/StreamChatContext';
import AppLoading from 'expo-app-loading';

const HomeScreen = ({ navigation }) => {
  const { client, isUserConnected } = useStreamChat();
  const [channel, setChannel] = useState(null);
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchBarWidth = useRef(new Animated.Value(0)).current;

  const [fontsLoaded] = useFonts({
    'Bradley-Hand': require('../assets/fonts/bradhitc.ttf'),
  });

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

  if (!fontsLoaded || !isUserConnected) {
    return <AppLoading />;
  }

  return (
    <OverlayProvider>
      <Chat client={client}>
        <View style={styles.container}>
          <View style={styles.header}>
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
              <TouchableOpacity style={styles.profilePictureContainer} onPress={onProfilePressed}>
                <Image
                  source={{ uri: client.user.image }}
                  style={styles.profilePicture}
                />
              </TouchableOpacity>
            </View>
          </View>
          <ChannelList
            onSelect={onChannelPressed}
            sort={{ last_message_at: -1 }}
            options={{ state: true, watch: true }}
            itemProps={{
              container: {
                justifyContent: 'center',
                paddingVertical: 15,
                paddingHorizontal: 10,
                borderBottomColor: '#ccc',
                borderBottomWidth: 0,
              },
              title: {
                fontSize: 18,
              },
              subtitle: {
                fontSize: 14,
                color: '#888',
              },
              avatar: {
                size: 50,
              },
            }}
          />
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
    paddingHorizontal: 10,
    paddingTop: Platform.OS === 'android' ? 50 : 0,
    backgroundColor: '#4B0082',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingVertical: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 25,
    fontFamily: 'Bradley-Hand',
    marginLeft: 20,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    height: 40,
    marginRight: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  profilePictureContainer: {
    marginLeft: 10,
    marginRight: 10,
  },
  profilePicture: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
});

export default HomeScreen;
