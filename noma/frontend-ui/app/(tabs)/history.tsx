import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type ScanResult = {
  id: string;
  date: string;
  location: string;
  diagnosis: 'benign' | 'malignant';
  confidence: number;
};

const mockData: ScanResult[] = [
  {
    id: '1',
    date: '2024-02-15',
    location: 'Left Arm',
    diagnosis: 'benign',
    confidence: 95,
  },
  {
    id: '2',
    date: '2024-02-10',
    location: 'Back',
    diagnosis: 'benign',
    confidence: 88,
  },
  {
    id: '3',
    date: '2024-02-05',
    location: 'Right Leg',
    diagnosis: 'malignant',
    confidence: 92,
  },
];

export default function HistoryScreen() {
  const renderItem = ({ item }: { item: ScanResult }) => (
    <TouchableOpacity style={styles.resultCard}>
      <View style={styles.resultHeader}>
        <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
        <View style={[
          styles.diagnosisBadge,
          { backgroundColor: item.diagnosis === 'benign' ? '#4CAF50' : '#F44336' }
        ]}>
          <Text style={styles.diagnosisText}>
            {item.diagnosis.charAt(0).toUpperCase() + item.diagnosis.slice(1)}
          </Text>
        </View>
      </View>
      
      <View style={styles.resultInfo}>
        <View style={styles.infoRow}>
          <Ionicons name="location" size={20} color="#FF8C42" />
          <Text style={styles.infoText}>{item.location}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="analytics" size={20} color="#FF8C42" />
          <Text style={styles.infoText}>Confidence: {item.confidence}%</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Scan History</Text>
      </View>
      
      <FlatList
        data={mockData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="document" size={64} color="#FF8C42" />
            <Text style={styles.emptyStateText}>No scan history yet</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  listContainer: {
    padding: 16,
  },
  resultCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  date: {
    fontSize: 16,
    color: '#666',
  },
  diagnosisBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  diagnosisText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  resultInfo: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
  },
});