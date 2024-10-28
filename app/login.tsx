import React, { useState, useEffect } from 'react';
import Checkbox from 'expo-checkbox';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { auth, signInWithEmailAndPassword, sendPasswordResetEmail } from '../firebbase/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import Material Icons

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        const loadRememberedCredentials = async () => {
            const rememberedEmail = await AsyncStorage.getItem('email');
            const rememberedPassword = await AsyncStorage.getItem('password');
            if (rememberedEmail && rememberedPassword) {
                setEmail(rememberedEmail);
                setPassword(rememberedPassword);
                setRememberMe(true);
            }
        };
        loadRememberedCredentials();
    }, []);

    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Check if the user's email is verified
            if (!user.emailVerified) {
                Alert.alert("Email Not Verified", "Please verify your email before logging in.");
                return;
            }

            // Save credentials if "Remember Me" is checked
            if (rememberMe) {
                await AsyncStorage.setItem('email', email);
                await AsyncStorage.setItem('password', password);
            } else {
                await AsyncStorage.removeItem('email');
                await AsyncStorage.removeItem('password');
            }

            router.replace('/(tabs)/home'); // Update if needed
        } catch (error) {
            // @ts-ignore
            Alert.alert("Login Error", error.message);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            Alert.alert("Forgot Password", "Please enter your email.");
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            Alert.alert("Reset Email Sent", "Check your email to reset your password.");
        } catch (error) {
            // @ts-ignore
            Alert.alert("Error", error.message);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#232323FF" />
            <View style={styles.card}>
                <Text style={styles.title}>Welcome Back To ExAi!</Text>
                <View style={styles.inputContainer}>
                    <Icon name="email" size={20} color="#007bff" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Icon name="lock" size={20} color="#007bff" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>
                <View style={styles.checkboxContainer}>
                    <Checkbox value={rememberMe} onValueChange={setRememberMe} />
                    <Text style={styles.checkboxLabel}>Remember Me</Text>
                </View>
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleForgotPassword}>
                    <Text style={styles.linkText}>Forgot Password?</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/signup')}>
                    <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#232323FF',
    },
    card: {
        width: '90%',
        maxWidth: 400,
        backgroundColor: 'rgb(51,51,51)',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: 'white'
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 15,
        backgroundColor: '#424242',
    },
    input: {
        flex: 1,
        height: 50,
        paddingHorizontal: 15,
        borderRadius: 8,
        color: 'white',
    },
    icon: {
        padding: 10,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    checkboxLabel: {
        marginLeft: 8,
        color: 'white'
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    linkText: {
        color: '#007bff',
        textAlign: 'center',
        marginVertical: 5,
    },
});
