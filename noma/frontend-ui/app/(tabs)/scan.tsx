import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

export default function ScanScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraActive, setCameraActive] = useState(false);

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
    if (status === 'granted') {
      setCameraActive(true);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Ionicons name="camera" size={64} color="#FF8C42" />
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            We need camera access to scan and analyze skin lesions for potential risks.
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestCameraPermission}>
            <Text style={styles.permissionButtonText}>Grant Access</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {cameraActive ? (
        <Camera style={styles.camera}>
          <View style={styles.overlay}>
            <View style={styles.scanFrame} />
            <TouchableOpacity
              style={styles.captureButton}
              onPress={() => {/* Handle capture */}}>
              <Ionicons name="scan" size={32} color="#FFF" />
            </TouchableOpacity>
          </View>
        </Camera>
      ) : (
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Scanning Instructions</Text>
          <View style={styles.instructionItem}>
            <Ionicons name="sunny" size={24} color="#FF8C42" />
            <Text style={styles.instructionText}>Ensure good lighting</Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="resize" size={24} color="#FF8C42" />
            <Text style={styles.instructionText}>Keep device 15-20cm from skin</Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="hand-left" size={24} color="#FF8C42" />
            <Text style={styles.instructionText}>Hold steady while scanning</Text>
          </View>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => setCameraActive(true)}>
            <Text style={styles.startButtonText}>Start Scan</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#FF8C42',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  permissionButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#FF8C42',
    borderRadius: 20,
  },
  captureButton: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: '#FF8C42',
    padding: 20,
    borderRadius: 40,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    margin: 20,
  },
  instructionsContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  instructionsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
    textAlign: 'center',
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  instructionText: {
    fontSize: 18,
    marginLeft: 15,
    color: '#666',
  },
  startButton: {
    backgroundColor: '#FF8C42',
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 30,
  },
  startButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});