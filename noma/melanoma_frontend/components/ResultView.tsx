import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ResultViewProps {
  prediction: string;
  confidence: number;
  onClose: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ prediction, confidence, onClose }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeText}>←</Text>
      </TouchableOpacity>
      <Text style={styles.predictionText}>{prediction}</Text>
      <Text style={styles.confidenceText}>Confidence: {(confidence * 100).toFixed(2)}%</Text>
      <Text style={styles.infoText}>What does this mean?</Text>
      <Text style={styles.descriptionText}>
        Lorem ipsum dolor sit amet, delas con adipiscing elit. Cras idea eget tristique.
      </Text>
      <Text style={styles.infoText}>What to do next?</Text>
      <Text style={styles.descriptionText}>
        Lorem ipsum dolor sit amet, delas con adipiscing elit. Cras idea eget tristique.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    margin: 20,
  },
  closeButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  closeText: {
    fontSize: 24,
    color: '#0047AB',
  },
  predictionText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0047AB',
  },
  confidenceText: {
    fontSize: 18,
    color: 'green',
  },
  infoText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  descriptionText: {
    fontSize: 16,
    marginTop: 10,
    color: '#333',
  },
});

export default ResultView; 