import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Keyboard,
    StatusBar
} from 'react-native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../firebbase/firebaseConfig'; // Import Firebase config
import { ref, get, push, onValue } from 'firebase/database'; // Import Firebase functions

// @ts-ignore
const home = ({ navigation }) => {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [apiConfig, setApiConfig] = useState(null); // To hold API credentials
    const flatListRef = useRef(null); // Ref for the FlatList
    const conversationId = 'unique_conversation_id'; // Replace with your logic for conversation ID

    // Fetch API key, URL, and model from Firebase
    useEffect(() => {
        const fetchApiConfig = async () => {
            try {
                const dbRef = ref(db);
                const snapshot = await get(dbRef);
                if (snapshot.exists()) {
                    setApiConfig(snapshot.val());
                } else {
                    console.error('No API config found!');
                }
            } catch (error) {
                console.error('Error fetching API config:', error);
            }
        };

        const fetchChatHistory = () => {
            const chatRef = ref(db, `chatHistory/${conversationId}/messages`);
            onValue(chatRef, (snapshot) => {
                if (snapshot.exists()) {
                    const fetchedMessages = Object.values(snapshot.val());
                    // @ts-ignore
                    setChatHistory(fetchedMessages);
                }
            });
        };

        fetchApiConfig();
        fetchChatHistory();

    }, [navigation]);

    // Save message to Firebase with unified structure
    // @ts-ignore
    const saveMessageToFirebase = async (message) => {
        const messagesRef = ref(db, `chatHistory/${conversationId}/messages`);
        await push(messagesRef, message); // Push the unified message to Firebase
    };

    const sendMessage = async () => {
        if (message.trim() === '' || !apiConfig) return; // Wait for API config

        const { ApiKey, Url, Model } = apiConfig;
        const timestamp = new Date().toLocaleTimeString(); // Get the current time

        // Create user message object
        const userMessage = { role: 'user', content: message, timestamp };

        // Add the user's message to chat history
        // @ts-ignore
        setChatHistory((prevChatHistory) => [...prevChatHistory, userMessage]);
        setMessage(''); // Clear the input field
        Keyboard.dismiss(); // Dismiss the keyboard after sending
        setLoading(true); // Start loading

        const payload = {
            model: Model,
            messages: [{ role: 'user', content: message }],
        };

        try {
            const response = await axios.post(Url, payload, {
                headers: {
                    'Authorization': `Bearer ${ApiKey}`,
                    'Content-Type': 'application/json',
                },
            });

            const botResponse = response.data.choices[0]?.message?.content || "No response";
            const botMessage = { role: 'assistant', content: botResponse, timestamp: new Date().toLocaleTimeString() };

            // Add the bot's response to the chat history
            // @ts-ignore
            setChatHistory((prevChatHistory) => [...prevChatHistory, botMessage]);

            // Save both user and bot messages together in Firebase
            await saveChatToFirebase(userMessage, botMessage);

            // Scroll to the bottom after new message
            // @ts-ignore
            flatListRef.current?.scrollToEnd({ animated: true });
        } catch (error) {
            console.error("Error sending message:", error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to send message. Please try again.',
            });
        } finally {
            setLoading(false); // Stop loading
        }
    };

// Save user and bot messages to Firebase under one ID
    // @ts-ignore
    const saveChatToFirebase = async (userMessage, botMessage) => {
        const chatRef = ref(db, 'chatHistory'); // Firebase path to store messages
        await push(chatRef, { userMessage, botMessage }); // Push both user and bot message together
    };


    // @ts-ignore
    const renderItem = ({ item }) => (
        <View style={item.role === 'user' ? styles.userMessageContainer : styles.botMessageContainer}>
            <Text style={item.role === 'user' ? styles.userMessage : styles.botMessage}>
                {item.content}
            </Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#232323FF" translucent={true} />
            <FlatList
                ref={flatListRef}
                data={chatHistory}
                keyExtractor={(_item, index) => index.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.chatList}
                //@ts-ignore
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Type your message..."
                    placeholderTextColor="#888"
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={loading || !apiConfig}>
                    {loading ? (
                        <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                        <Text style={styles.sendButtonText}>Send</Text>
                    )}
                </TouchableOpacity>
            </View>
            <Toast />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: 'rgb(35,35,35)',
    },
    chatList: {
        paddingBottom: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#444',
        padding: 10,
        borderRadius: 25,
        flex: 1,
        marginRight: 10,
        color: '#ffffff',
    },
    sendButton: {
        backgroundColor: '#007aff',
        padding: 10,
        borderRadius: 15,
    },
    sendButtonText: {
        color: '#ffffff',
    },
    userMessageContainer: {
        alignSelf: 'flex-end',
        marginVertical: 5,
        padding: 5,
    },
    botMessageContainer: {
        alignSelf: 'flex-start',
        marginVertical: 5,
        padding: 5,
    },
    userMessage: {
        backgroundColor: '#3d3d3d',
        padding: 10,
        borderRadius: 5,
        maxWidth: '80%',
        color: '#fff',
    },
    botMessage: {
        backgroundColor: 'rgb(0,122,255)',
        padding: 10,
        borderRadius: 5,
        maxWidth: '80%',
        color: '#fff',
    },
    timestamp: {
        fontSize: 10,
        color: '#888',
        marginTop: 3,
    },
});

export default home;
