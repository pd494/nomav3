import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        await AsyncStorage.removeItem('authToken'); // Clear auth token
        router.replace('/auth/Login'); // Redirect to login screen
      } catch (error) {
        console.error('Logout failed:', error);
      }
    };

    logout();
  }, []);

  return null; // No UI needed, just redirecting
}
