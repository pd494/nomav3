import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ArchiveScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <Text style={styles.title}>Scan History</Text>
      </View>
      <ScrollView style={styles.content}>
        <TouchableOpacity style={styles.scanItem}>
          <View style={styles.scanInfo}>
            <Text style={styles.scanDate}>June 15, 2025</Text>
            <Text style={styles.scanLocation}>Upper Right Arm</Text>
          </View>
          <View style={styles.scanStatus}>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            <Text style={styles.statusText}>Low Risk</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.scanItem}>
          <View style={styles.scanInfo}>
            <Text style={styles.scanDate}>June 10, 2025</Text>
            <Text style={styles.scanLocation}>Lower Back</Text>
          </View>
          <View style={styles.scanStatus}>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            <Text style={styles.statusText}>Low Risk</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a4ba1',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  scanItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scanInfo: {
    flex: 1,
  },
  scanDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  scanLocation: {
    fontSize: 14,
    color: '#666',
  },
  scanStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
});