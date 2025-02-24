import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Skin Cancer Detection</Text>
        <Text style={styles.subtitle}>Early Detection Saves Lives</Text>
      </View>

      <View style={styles.infoCard}>
        <Ionicons name="information-circle" size={24} color="#FF8C42" />
        <Text style={styles.infoTitle}>What is Skin Cancer?</Text>
        <Text style={styles.infoText}>
          Skin cancer is the abnormal growth of skin cells, most often triggered by sun exposure. Early detection significantly increases the chances of successful treatment.
        </Text>
      </View>

      <View style={styles.featuresContainer}>
        <TouchableOpacity 
          style={styles.featureCard}
          onPress={() => router.push('/scan')}>
          <Ionicons name="scan" size={32} color="#FF8C42" />
          <Text style={styles.featureTitle}>Scan Now</Text>
          <Text style={styles.featureText}>Analyze skin lesions for potential risks</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.featureCard}
          onPress={() => router.push('/history')}>
          <Ionicons name="time" size={32} color="#FF8C42" />
          <Text style={styles.featureTitle}>View History</Text>
          <Text style={styles.featureText}>Track your previous scans and results</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>Prevention Tips</Text>
        <View style={styles.tipItem}>
          <Ionicons name="sunny" size={24} color="#FF8C42" />
          <Text style={styles.tipText}>Use sunscreen daily (SPF 30+)</Text>
        </View>
        <View style={styles.tipItem}>
          <Ionicons name="umbrella" size={24} color="#FF8C42" />
          <Text style={styles.tipText}>Seek shade during peak sun hours</Text>
        </View>
        <View style={styles.tipItem}>
          <Ionicons name="shirt" size={24} color="#FF8C42" />
          <Text style={styles.tipText}>Wear protective clothing</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    padding: 20,
    backgroundColor: '#FF8C42',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFF',
    marginTop: 5,
  },
  infoCard: {
    margin: 20,
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  featureCard: {
    flex: 1,
    margin: 5,
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  featureText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  tipsContainer: {
    padding: 20,
  },
  tipsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  tipText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#666',
  },
});