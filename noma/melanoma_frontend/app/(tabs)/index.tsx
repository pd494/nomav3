import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import CameraComponent from "@/components/CameraComponent";

export default function HomeScreen() {
  const [showCamera, setShowCamera] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);

  const handlePress = () => {
    setShowCamera(true);
  };

  const handleCloseCamera = () => {
    setShowCamera(false);
  };

  const handlePrediction = (predicted: string, conf: number) => {
    setPrediction(predicted);
    setConfidence(conf);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Early Detection Saves Lives</Text>
      <Button title="Scan Now" onPress={handlePress} />
      <CameraComponent visible={showCamera} onClose={handleCloseCamera} onCapture={() => {}} onPrediction={handlePrediction} />
      {prediction && (
        <View style={styles.predictionContainer}>
          <Text style={styles.predictionText}>Prediction: {prediction}</Text>
          <Text style={styles.predictionText}>
            Confidence: {confidence !== null ? (confidence * 100).toFixed(2) : 'N/A'}%
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  predictionContainer: { marginTop: 20, alignItems: "center" },
  predictionText: { fontSize: 16 },
});
