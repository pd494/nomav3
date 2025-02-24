import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();

  const handleScanPress = () => {
    router.push("/camera");
  };

  const handleArchivePress = () => {
    router.push("/history");
  };
  

  const handleProfilePress = () => {
    router.push("/profile");
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Hi Marina</Text>
              <Text style={styles.subtitle}>Let's keep your skin healthy.</Text>
            </View>
            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.iconButton} onPress={handleArchivePress}>
                <Ionicons name="notifications-outline" size={24} color="#0047AB" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} onPress={handleProfilePress}>
                <Ionicons name="person-outline" size={24} color="#0047AB" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.statusCard}>
            <View style={styles.checkmarkContainer}>
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            </View>
            <View>
              <Text style={styles.statusText}>You are on track.</Text>
              <Text style={styles.reminderText}>Next scan reminder in 10 days.</Text>
            </View>
          </View>

          <View style={styles.newsSection}>
            <Text style={styles.newsTitle}>Infos & News</Text>
            <TouchableOpacity style={styles.newsCard}>
              <Image
                source={{ uri: 'https://example.com/image.jpg' }}
                style={styles.newsImage}
              />
              <View style={styles.newsContent}>
                <Text style={styles.newsHeading}>Diagnosis of skin cancer - what happens next?</Text>
                <Text style={styles.newsDescription}>
                  It is a diagnosis that is frightening and often leaves those affected and their family ...
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.tabBar}>
          <TouchableOpacity style={styles.tabButton} onPress={handleScanPress}>
            <Text style={styles.tabText}>Scan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabButton} onPress={handleArchivePress}>
            <Text style={styles.tabText}>Archive</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabButton} onPress={handleProfilePress}>
            <Text style={styles.tabText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20, // Ensures it's away from the notch
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 20,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  checkmarkContainer: {
    marginRight: 10,
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  reminderText: {
    fontSize: 14,
    color: '#888',
  },
  newsSection: {
    marginTop: 20,
  },
  newsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  newsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  newsImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  newsContent: {
    padding: 10,
  },
  newsHeading: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  newsDescription: {
    fontSize: 14,
    color: '#555',
  },
  viewAllButton: {
    alignItems: 'flex-end',
    marginTop: 10,
  },
  viewAllText: {
    color: '#0047AB',
    fontWeight: 'bold',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    color: '#0047AB',
  },
});
