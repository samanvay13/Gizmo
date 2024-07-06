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
  const [contactedUser, setContactedUser] = useState(null);

  useEffect(() => {
    const setupChannel = async () => {
      try {
        const channel = client.channel('messaging', channelId);
        await channel.watch();
        setChannel(channel);

        const memberIds = Object.keys(channel.state.members);
        const contactedUserId = memberIds.find(id => id !== client.userID);
        const contactedUser = channel.state.members[contactedUserId]?.user;
        setContactedUser(contactedUser);
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
                {contactedUser && (
                  <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                      <Ionicons name="chevron-back-outline" size={25} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{contactedUser.name || contactedUser.id}</Text>
                    <View style={styles.contactInfo}>
                      {contactedUser.image && (
                        <Image
                          source={{ uri: contactedUser.image }}
                          style={styles.headerImage}
                        />
                      )}
                    </View>
                  </View>
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
    paddingTop: 10,
    backgroundColor: '#4B0082',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
    marginLeft: 20,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactName: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
  },
  headerImage: {
    width: 35,
    height: 70,
  },
});

export default ChannelScreen;
