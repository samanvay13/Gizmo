import React, { createContext, useContext, useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { AuthProvider, useAuth } from './AuthProvider';

const StreamChatContext = createContext();

const client = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_API_KEY);

export const StreamChatProvider = ({ children }) => {
  const [isUserConnected, setIsUserConnected] = useState(false);
  const { profile } = useAuth();

  useEffect(() => {
    const connect = async () => {
      try {
        await client.connectUser(
          {
            id: profile.id,
            name: profile.username,
            image: profile.avatar_url,
          },
          client.devToken(profile.id),
        );
        setIsUserConnected(true);
        console.log('User connected:', client.userID);

        const filters = { type: 'messaging' };
        const sort = [{ last_message_at: -1 }];
        const channels = await client.queryChannels(filters, sort, { watch: true });
        // console.log('Channels:', channels);
      } catch (error) {
        // console.error('Error connecting user:', error);
      }
    };

    connect();

    return () => {
      if(isUserConnected) {
        client.disconnectUser();
      }
      setIsUserConnected(false);
    };
  }, [profile?.id]);

  return (
    <AuthProvider>
      <StreamChatContext.Provider value={{ client, isUserConnected }}>
        {children}
      </StreamChatContext.Provider>
    </AuthProvider>
  );
};

export const useStreamChat = () => useContext(StreamChatContext);
