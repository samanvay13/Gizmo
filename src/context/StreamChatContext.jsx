import React, { createContext, useContext, useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { useAuth } from './AuthProvider';

// Create a context for Stream Chat
const StreamChatContext = createContext();

// Initialize Stream Chat client
const client = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_API_KEY);

export const StreamChatProvider = ({ children }) => {
  const [isUserConnected, setIsUserConnected] = useState(false);
  const { session } = useAuth();

  // Connect the user to Stream Chat when session changes
  useEffect(() => {
    const connectUser = async () => {
      if (!session?.user) {
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

      } catch (error) {
        console.error('Error connecting user:', error);
      }
    };

    connectUser();
  }, [session?.user]);

  // Update user profile in Stream Chat
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

  // Provide the Stream Chat context to the children components
  return (
    <StreamChatContext.Provider value={{ client, isUserConnected, updateUserInStreamChat }}>
      {children}
    </StreamChatContext.Provider>
  );
};

// Custom hook to use the Stream Chat context
export const useStreamChat = () => useContext(StreamChatContext);
