import React, { createContext, useContext, useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { useAuth } from './AuthProvider';

const StreamChatContext = createContext();

const client = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_API_KEY);

export const StreamChatProvider = ({ children }) => {
  const [isUserConnected, setIsUserConnected] = useState(false);
  const [channels, setChannels] = useState([]);
  const { session, loading } = useAuth();

  useEffect(() => {
    const connectUser = async () => {
      if (loading || !session?.user) {
        return;
      }

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
        console.log('User connected:', client.userID);

        await fetchUserChannels();
      } catch (error) {
        console.error('Error connecting user:', error);
      }
    };

    connectUser();

    // return () => {
    //   if (isUserConnected) {
    //     client.disconnectUser();
    //   }
    //   setIsUserConnected(false);
    // };
  }, [session?.user]);

  const fetchUserChannels = async () => {
    if (session?.user?.id) {
      try {
        const filters = { members: { $in: [session.user.id] } };
        const response = await client.queryChannels(filters);
        setChannels(response);
      } catch (error) {
        console.error('Error fetching user channels:', error);
      }
    }
  };

  const updateUserInStreamChat = async (profile) => {
    if (client.userID) {
      try {
        await client.upsertUser({
          id: session.user.id,
          name: profile.username,
          image: profile.avatar_url,
        });
      } catch (error) {
        console.error('Error updating user in Stream Chat:', error);
      }
    }
  };

  return (
    <StreamChatContext.Provider value={{ client, isUserConnected, updateUserInStreamChat, channels }}>
      {children}
    </StreamChatContext.Provider>
  );
};

export const useStreamChat = () => useContext(StreamChatContext);
