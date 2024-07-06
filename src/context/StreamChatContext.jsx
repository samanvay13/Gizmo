import React, { createContext, useContext, useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { AuthProvider, useAuth } from './AuthProvider';

const StreamChatContext = createContext();

const client = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_API_KEY);

export const StreamChatProvider = ({ children }) => {
  const [isUserConnected, setIsUserConnected] = useState(false);
  const { session } = useAuth();

  useEffect(() => {
    if (!session?.user) {
      return;
    }

    const connectUser = async () => {
      try {
        if (client.userID) {
          await client.disconnectUser();
        }

        await client.connectUser(
          {
            id: session.user.id,
            name: session.user.username,
            image: session.user.avatar_url,
          },
          client.devToken(session.user.id),
        );

        setIsUserConnected(true);

        const filters = { type: 'messaging', members: { $in: [session.user.id] } };
        const sort = [{ last_message_at: -1 }];
        await client.queryChannels(filters, sort, { watch: true });
      } catch (error) {
        console.error('Error connecting user:', error);
      }
    };

    connectUser();

    return () => {
      if (isUserConnected) {
        client.disconnectUser();
      }
      setIsUserConnected(false);
    };
  }, [session]);

  return (
    <StreamChatContext.Provider value={{ client, isUserConnected }}>
      {children}
    </StreamChatContext.Provider>
  );
};

export const useStreamChat = () => useContext(StreamChatContext);
