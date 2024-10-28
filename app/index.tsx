import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { auth } from '@/firebbase/firebaseConfig';

export default function Index() {
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (isMounted) {
                if (user) {
                    router.replace('/(tabs)/home'); // Redirect to home if authenticated
                } else {
                    router.replace('/login'); // Redirect to login if not authenticated
                }
                setLoading(false); // Stop loading indicator
            }
        });

        return () => unsubscribe();
    }, [isMounted]);

    // Set isMounted to true after the first render
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return null;
}
