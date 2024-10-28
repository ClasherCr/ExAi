import {StyleSheet, Text, View, FlatList, ActivityIndicator, StatusBar} from 'react-native';
import React, { useEffect, useState } from 'react';
import { db } from '../../firebbase/firebaseConfig'; // Adjust the path to your Firebase config
import { ref, onValue } from 'firebase/database';

const history = () => {
    const [chatData, setChatData] = useState([]); // State to store chat messages
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        const chatRef = ref(db, 'chatHistory'); // Reference to your chat history path in Firebase

        // Fetch chat data from Firebase
        const unsubscribe = onValue(chatRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                //@ts-ignore
                const messages = []; // Array to hold flattened messages
                // Iterate through each conversation in chatHistory
                Object.values(data).forEach((thread) => {
                    // Push bot and user messages into the messages array
                    // @ts-ignore
                    messages.push({ role: 'user', content: thread.userMessage.content });
                    // @ts-ignore
                    messages.push({ role: 'bot', content: thread.botMessage.content });

                });
                // @ts-ignore
                setChatData(messages); // Update state with flattened messages
            }
            setLoading(false); // Set loading to false after fetching data
        });

        // Clean up the subscription on unmount
        return () => unsubscribe();
    }, []);

    // @ts-ignore
    const renderMessage = ({ item }) => (
        <View style={styles.messageContainer}>
            <Text style={styles.userName}>{item.role === 'user' ? 'User' : 'Bot'}</Text>
            <Text style={styles.messageText}>{item.content}</Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4caf50" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#232323FF" />
            <FlatList
                data={chatData}
                renderItem={renderMessage}
                keyExtractor={(_item, index) => index.toString()} // Use index as key for simplicity
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

export default history;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#232323FF', // Background color
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    listContainer: {
        paddingBottom: 20,
    },
    messageContainer: {
        marginVertical: 5,
        padding: 10,
        backgroundColor: 'rgba(255,255,255,0.1)', // Light gray for message bubbles
        borderRadius: 10,
    },
    userName: {
        color: '#007aff', // Green color for usernames
        fontWeight: 'bold',
    },
    messageText: {
        color: '#ffffff', // Black color for message text
    },
});
