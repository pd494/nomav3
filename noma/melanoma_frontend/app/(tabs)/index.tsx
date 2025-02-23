import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import CameraComponent from "@/components/CameraComponent";



export default function HomeScreen() {
  const [showCamera, setShowCamera] = useState(false);

  const handlePress = () => {
    setShowCamera(true);
  };

  const handleCloseCamera = () => {
    setShowCamera(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Early Detection Saves Lives</Text>
      <Button title="Scan Now" onPress={handlePress} />
      <CameraComponent visible={showCamera} onClose={handleCloseCamera} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
});
