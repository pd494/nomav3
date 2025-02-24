import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';

function CustomTabBar({ state, descriptors, navigation }) {
  const router = useRouter();

  return (
    <BlurView intensity={100} style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        if (route.name === 'scan') {
          return (
            <TouchableOpacity
              key={route.key}
              style={styles.scanButton}
              onPress={() => router.push('/scan')}
            >
              <View style={styles.scanButtonInner}>
                <Ionicons name="scan" size={32} color="#fff" />
              </View>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tab}
            onPress={() => navigation.navigate(route.name)}
          >
            <Ionicons
              name={options.tabBarIcon({ focused: isFocused }).props.name}
              size={24}
              color={isFocused ? '#1a4ba1' : '#8e8e93'}
            />
          </TouchableOpacity>
        );
      })}
    </BlurView>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => ({
            props: { name: focused ? 'home' : 'home-outline' }
          }),
        }}
      />
      <Tabs.Screen
        name="uv-index"
        options={{
          tabBarIcon: ({ focused }) => ({
            props: { name: focused ? 'sunny' : 'sunny-outline' }
          }),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          tabBarIcon: ({ focused }) => ({
            props: { name: focused ? 'scan' : 'scan-outline' }
          }),
        }}
      />
      <Tabs.Screen
        name="archive"
        options={{
          tabBarIcon: ({ focused }) => ({
            props: { name: focused ? 'folder' : 'folder-outline' }
          }),
        }}
      />
      <Tabs.Screen
        name="e-doctor"
        options={{
          tabBarIcon: ({ focused }) => ({
            props: { name: focused ? 'medical' : 'medical-outline' }
          }),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    height: 80,
    paddingBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -30,
  },
  scanButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1a4ba1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});