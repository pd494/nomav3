import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CameraComponent from '@/components/CameraComponent';

function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        if (route.name === 'scan') {
          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={styles.scanButtonContainer}
            >
              <View style={styles.scanButton}>
                <Text style={styles.scanButtonText}>Scan</Text>
              </View>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={styles.tabButton}
          >
            <Ionicons
              name={options.tabBarIcon({ color: isFocused ? '#0047AB' : '#8E8E93' }).props.name}
              size={24}
              color={isFocused ? '#0047AB' : '#8E8E93'}
            />
            <Text style={[styles.tabLabel, { color: isFocused ? '#0047AB' : '#8E8E93' }]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      setIsAuthenticated(!!token);
      if (!token) {
        router.replace("/auth/Login");
      }
    } catch (error) {
      router.replace("/auth/Login");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return null;

  return isAuthenticated ? (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
        tabBar={props => <CustomTabBar {...props} />}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="scan"
          options={{
            title: 'Scan',
            tabBarIcon: ({ color }) => <Ionicons name="scan-outline" size={24} color={color} />,
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setShowCamera(true);
            },
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: 'History',
            tabBarIcon: ({ color }) => <Ionicons name="folder-outline" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={24} color={color} />,
          }}
        />
      </Tabs>
      {showCamera && (
        <CameraComponent
          isVisible={showCamera}
          onClose={() => setShowCamera(false)}
        />
      )}
    </>
  ) : null;
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    height: 80,
    borderTopWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
    paddingBottom: 15,
    paddingTop: 5,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0047AB',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 15,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  tabLabel: {
    fontSize: 12,
  },
});
