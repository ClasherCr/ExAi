// SignupScreen.tsx
import React, { useState } from 'react';
import {View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, StatusBar} from 'react-native';
import { auth, createUserWithEmailAndPassword, sendEmailVerification } from '@/firebbase/firebaseConfig';
import { useRouter } from 'expo-router';

export default function SignupScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();

    const handleSignup = async () => {
        if (password !== confirmPassword) {
            Alert.alert("Password Mismatch", "Passwords do not match.");
            return;
        }
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Send verification email
            await sendEmailVerification(user);
            Alert.alert("Verification Email Sent", "Check your email to verify your account.");

            // Optionally navigate to the login screen or stay on signup
            router.push('/login'); // Navigate to the login screen
        } catch (error) {
            // @ts-ignore
            Alert.alert("Signup Error", error.message);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#232323FF" translucent={true} />
            <Text style={styles.title}>Create Account</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleSignup}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={styles.linkText}>Already have an account? Login</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#232323FF', // Light background
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'white'
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: '#626262', // Light input background
        width: '100%', // Full width of the card
        color: 'white',

    },
    button: {
        backgroundColor: '#007bff', // Primary button color
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        width: '100%', // Full width of the card
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    linkText: {
        color: '#007bff',
        textAlign: 'center',
        marginTop: 10,
    },
});
