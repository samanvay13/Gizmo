import { useNavigation } from "@react-navigation/native";
import React from "react";
import { ImageBackground, StyleSheet, Text, TextInput, View, TouchableOpacity } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

const LoginScreen = () => {

    const navigation = useNavigation();

    return (
        <ImageBackground source={require('../assets/backgrounds/loginBackground6.png')} style={styles.container}>
            <View style={styles.loginHeader}>
                <Text style={styles.loginHeaderText}>Gizmo</Text>
            </View>
            <View style={styles.loginCard}>
                <Text style={styles.cardHeaderText}>Sign-In</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor="#aaa"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#aaa"
                    secureTextEntry
                />
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Forgot Password?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                        <Text style={styles.footerText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
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
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // Transparent white for glass effect
        borderRadius: 10,
        padding: 30,
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
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white
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
        justifyContent: 'space-between',
        width: '95%',
    },
    footerText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default LoginScreen;
