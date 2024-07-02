import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { ImageBackground, StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from "../context/AuthProvider";

const LoginScreen = () => {

    const navigation = useNavigation();
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
  
    const handleLogin = async () => {
      setLoading(true);
      try {
        await signIn(email, password);
        navigation.navigate('AvatarSelection');
      } catch (error) {
        Alert.alert(error.message);
      }
      setLoading(false);
    };

    const IMAGE_URI = 'https://i.pinimg.com/564x/08/6c/d0/086cd0eaa64a5b2b19b9e771f61b2cb9.jpg';

    return (
        <ImageBackground source={{ uri: IMAGE_URI }} style={styles.container}>
            <View style={styles.loginHeader}>
                <Text style={styles.loginHeaderText}>Gizmo</Text>
            </View>
            <View style={styles.loginCard}>
                <Text style={styles.cardHeaderText}>Sign-In</Text>
                <TextInput
                    style={styles.input}
                    label="Email"
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    placeholder="Email"
                    placeholderTextColor="#aaa"
                    autoCapitalize={'none'}
                />
                <TextInput
                    style={styles.input}
                    label="Password"
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    secureTextEntry={true}
                    placeholder="Password"
                    placeholderTextColor="#aaa"
                    autoCapitalize={'none'}
                />
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Not registered yet? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                        <Text style={styles.footerTextLink}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={handleLogin}>
                    <LinearGradient
                        colors={['#8A2BE2', '#4B0082']}
                        style={styles.loginButton}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Text style={styles.loginButtonText}>Login</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loginHeader: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 100,
        paddingVertical: 30,
    },
    loginHeaderText: {
        color: '#fff',
        fontSize: 40,
        fontWeight: 'bold',
    },
    loginCard: {
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 10,
        padding: 30,
        zIndex: 1,
    },
    cardHeaderText: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#fff',
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 5,
        paddingHorizontal: 15,
        marginBottom: 20,
        fontSize: 18,
        color: '#000',
    },
    loginButton: {
        width: 100,
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: '95%',
    },
    footerText: {
        color: '#fff',
        fontSize: 16,
    },
    footerTextLink: {
        color: '#FFFAA0',
        fontSize: 16,
    },
});

export default LoginScreen;
