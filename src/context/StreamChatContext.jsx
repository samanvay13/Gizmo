import React, { createContext, useContext, useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';

const StreamChatContext = createContext();

const client = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_API_KEY);

export const StreamChatProvider = ({ children }) => {
  const [isUserConnected, setIsUserConnected] = useState(false);

  useEffect(() => {
    const connect = async () => {
      try {
        await client.connectUser(
          {
            id: 'omantix',
            name: 'omantix',
            image: 'https://i.pinimg.com/564x/36/a2/e2/36a2e242bfe3ac039e0618fbaaef7596.jpg',
          },
          client.devToken('omantix')
        );
        setIsUserConnected(true);
        console.log('User connected:', client.userID);

        // Fetch and log channels
        const filters = { type: 'messaging', members: { $in: ['omantix'] } };
        const sort = [{ last_message_at: -1 }];
        const channels = await client.queryChannels(filters, sort, { watch: true });
        console.log('Channels:', channels);
      } catch (error) {
        console.error('Error connecting user:', error);
      }
    };

    connect();

    return () => {
      client.disconnectUser();
    };
  }, []);

  return (
    <StreamChatContext.Provider value={{ client, isUserConnected }}>
      {children}
    </StreamChatContext.Provider>
  );
};

export const useStreamChat = () => useContext(StreamChatContext);
