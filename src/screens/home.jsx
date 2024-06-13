import React, { useRef, useState } from 'react';
import { View, StyleSheet, Text, Platform, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import MenuContent from '../components/menuContent';
import { Channel, ChannelList, ChannelHeader, Chat, MessageInput, MessageList, OverlayProvider } from 'stream-chat-expo';
import { useStreamChat } from '../context/StreamChatContext';
import AppLoading from 'expo-app-loading';

const HomeScreen = ({ navigation }) => {
  const { client, isUserConnected } = useStreamChat();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [channel, setChannel] = useState(null);
  // console.log(channel);
  const menuAnimation = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    Animated.timing(menuAnimation, {
      toValue: isMenuOpen ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsMenuOpen(!isMenuOpen);
  };

  const menuTranslateX = menuAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 0],
  });

  const [fontsLoaded] = useFonts({
    'Bradley-Hand': require('../assets/fonts/bradhitc.ttf'),
  });

  const onChannelPressed = (channel) => {
    setChannel(channel);
    navigation.navigate('Channel', { channelId: channel.id });
    
  };

  return (
    <OverlayProvider>
      <Chat client={client}>
        <View style={styles.container}>
          <Animated.View style={[styles.menu, { transform: [{ translateX: menuTranslateX }] }]}>
            <MenuContent onCloseMenu={toggleMenu} />
          </Animated.View>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity style={{ paddingLeft: 10 }} onPress={toggleMenu}>
                <Ionicons name="menu-outline" size={24} color="white" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Gizmo</Text>
            </View>
            <TouchableOpacity style={{ paddingRight: 10 }} onPress={() => {}}>
              <Ionicons name="search-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <ChannelList
            onSelect={(onChannelPressed)}
            // filters={{ type: 'messaging' }}
            sort={{ last_message_at: -1 }}
            options={{ state: true, watch: true }}
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
    paddingTop: Platform.OS === 'android' ? 40 : 0,
    backgroundColor: '#4B0082',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingVertical: 15,
    ...Platform.select({
      android: {
        elevation: 20,
      },
    }),
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
  menu: {
    position: 'absolute',
    top: 0,
    left: -1,
    bottom: 0,
    width: 300,
    backgroundColor: '#fff',
    zIndex: 1,
    paddingVertical: 10,
    ...Platform.select({
      android: {
        elevation: 500,
      },
    }),
  },
});

export default HomeScreen;
