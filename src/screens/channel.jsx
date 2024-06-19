import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { Chat, Channel, MessageList, MessageInput, OverlayProvider } from 'stream-chat-expo';
import { useStreamChat } from '../context/StreamChatContext';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const LoadingChannelScreen = () => (
  <View style={styles.loadingContainer}>
    <Ionicons name="chatbubbles-outline" size={100} color="#4B0082" />
    <Text style={styles.loadingContainerText}>GIZMO</Text>
  </View>
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

  return (
    <OverlayProvider>
      <Chat client={client}>
        <Channel channel={channel}>
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity style={{ paddingLeft: 10 }} onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back-outline" size={24} color="white" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>{channel.data.name}</Text>
              {channel.data.image && (
                <Image
                  source={{ uri: channel.data.image }}
                  style={styles.headerImage}
                />
              )}
            </View>
            <MessageList />
            <SafeAreaView edges={['bottom']}>
              <MessageInput />
            </SafeAreaView>
          </View>
        </Channel>
      </Chat>
    </OverlayProvider>
  );
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
    color: '#4B0082',
    fontSize: 20,
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
    paddingVertical: 15,
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: 20,
  },
  headerImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 10,
  },
});

export default ChannelScreen;
