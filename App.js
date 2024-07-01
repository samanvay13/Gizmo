import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/home';
import ChannelScreen from './src/screens/channel';
import LoginScreen from './src/screens/login';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StreamChatProvider } from './src/context/StreamChatContext';
import SignupScreen from './src/screens/signup';
import ProfileScreen from './src/screens/profile';
import { AuthProvider } from './src/context/AuthProvider';
import AvatarSelectionScreen from './src/screens/avatarSelection';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <StreamChatProvider>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Channel" component={ChannelScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
              <Stack.Screen name="AvatarSelection" component={AvatarSelectionScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
          </NavigationContainer>
        </StreamChatProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

export default App;
