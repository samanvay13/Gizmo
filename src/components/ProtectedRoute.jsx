import React from 'react';
import { useAuth } from '../context/AuthProvider';
import { View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const navigation = useNavigation();

  React.useEffect(() => {
    if (!user) {
      navigation.navigate('Login');
    }
  }, [user, navigation]);

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return children;
};

export default ProtectedRoute;
