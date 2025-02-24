import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type UserProfile = {
  name: string;
  dateOfBirth: string;
  age: number;
  skinType: string;
  previousTreatments: string[];
  riskFactors: string[];
};

const mockProfile: UserProfile = {
  name: 'John Doe',
  dateOfBirth: '1985-06-15',
  age: 38,
  skinType: 'Type II - Fair',
  previousTreatments: [
    'Cryotherapy (2022)',
    'Excisional Surgery (2021)',
  ],
  riskFactors: [
    'Family history of melanoma',
    'Fair skin',
    'Frequent sun exposure',
  ],
};

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={80} color="#FF8C42" />
        </View>
        <Text style={styles.name}>{mockProfile.name}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="calendar" size={24} color="#FF8C42" />
            <View>
              <Text style={styles.infoLabel}>Date of Birth</Text>
              <Text style={styles.infoValue}>{mockProfile.dateOfBirth}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="hourglass" size={24} color="#FF8C42" />
            <View>
              <Text style={styles.infoLabel}>Age</Text>
              <Text style={styles.infoValue}>{mockProfile.age} years</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="color-palette" size={24} color="#FF8C42" />
            <View>
              <Text style={styles.infoLabel}>Skin Type</Text>
              <Text style={styles.infoValue}>{mockProfile.skinType}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Previous Treatments</Text>
        <View style={styles.infoCard}>
          {mockProfile.previousTreatments.map((treatment, index) => (
            <View key={index} style={styles.listItem}>
              <Ionicons name="medical" size={24} color="#FF8C42" />
              <Text style={styles.listItemText}>{treatment}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Risk Factors</Text>
        <View style={styles.infoCard}>
          {mockProfile.riskFactors.map((factor, index) => (
            <View key={index} style={styles.listItem}>
              <Ionicons name="warning" size={24} color="#FF8C42" />
              <Text style={styles.listItemText}>{factor}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFF',
    padding: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    marginTop: 20,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 16,
  },
  listItemText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
});