import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, ImageBackground } from 'react-native';
import { Chat, Channel, MessageList, MessageInput, OverlayProvider } from 'stream-chat-expo';
import { useStreamChat } from '../context/StreamChatContext';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export const theme = {
  messageList: {
    container: {
      backgroundColor: 'transparent',
    },
  },
};

const IMAGE_URI = 'https://images.unsplash.com/photo-1549125764-91425ca48850?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8NjF8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=800&q=60';

const LoadingChannelScreen = () => (
  <LinearGradient 
    colors={['#4B0082', '#000']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.loadingContainer}
  >
    <Ionicons name="chatbubbles-outline" size={100} color="white" />
    <Text style={styles.loadingContainerText}>Express yourself, with GIZMO</Text>
  </LinearGradient>
);

const ChannelScreen = ({ route, navigation }) => {
  const { client } = useStreamChat();
  const { channelId } = route.params;
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    const setupChannel = async () => {
      try {
        const channel = client.channel('messaging', channelId);
        await channel.watch();
        setChannel(channel);
      } catch (error) {
        console.error('Error setting up channel:', error);
      }
    };

    setupChannel();

    return () => {
      if (channel) {
        channel.stopWatching();
      }
    };
  }, [channelId]);

  if (!channel) {
    return <LoadingChannelScreen />;
  }
  
  if (channel) {
    return (
      <OverlayProvider>
        <Chat client={client} theme={theme}>
          <Channel channel={channel}>
            <ImageBackground
              style={{ flex: 1 }}
              source={{ uri: IMAGE_URI }}
            >
              <LinearGradient 
                colors={['#4B0082', '#000']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
              >
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Ionicons name="chevron-back-outline" size={25} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{channel.data.name}</Text>
                {channel.data.image && (
                  <Image
                    source={{ uri: channel.data.image }}
                    style={styles.headerImage}
                  />
                )}
              </LinearGradient>
              <MessageList />
              <MessageInput />
            </ImageBackground>
          </Channel>
        </Chat>
      </OverlayProvider>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainerText: {
    color: '#fff',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 20,
    backgroundColor: '#4B0082',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingBottom: 15,
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 22,
    marginLeft: 20,
  },
  headerImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
});

export default ChannelScreen;
