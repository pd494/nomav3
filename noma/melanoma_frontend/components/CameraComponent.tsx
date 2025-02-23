import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Modal, Alert, ActivityIndicator } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

// Update this to your actual server IP address and port
// If running on physical device, use your computer's local IP address
// If using Android emulator, use 10.0.2.2 instead of localhost
const SERVER_URL = 'http://10.0.0.232:5001'; // Use the IP address from your Flask output

interface CameraComponentProps {
  visible: boolean;
  onClose: () => void;
  onCapture?: () => void;  // Optional since it's not used internally
  onPrediction: (prediction: string, confidence: number) => void;
}

export default function CameraComponent({ visible, onClose, onPrediction }: CameraComponentProps) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<any>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  async function takePicture() {
    if (!cameraRef.current || isCapturing) return;

    setIsCapturing(true);
    try {
      console.log('Taking picture...');
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        base64: false,
        skipProcessing: true
      });
      
      if (!photo?.uri) {
        throw new Error('Failed to capture photo');
      }
      console.log('Photo captured:', photo.uri);

      // Debug: Check if file exists and get its size
      const fileInfo = await FileSystem.getInfoAsync(photo.uri);
      console.log('Original file info:', fileInfo);

      // Preprocess the image
      console.log('Processing image...');
      const processedImage = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 224, height: 224 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );
      console.log('Processed image URI:', processedImage.uri);

      // Debug: Check processed file
      const processedFileInfo = await FileSystem.getInfoAsync(processedImage.uri);
      console.log('Processed file info:', processedFileInfo);

      // Create form data
      console.log('Creating form data...');
      const formData = new FormData();
      formData.append('image', {
        uri: processedImage.uri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      } as any);

      // Debug: Log request details
      console.log('Sending request to:', `${SERVER_URL}/predict`);
      
      // Make the request
      console.log('Sending image to server...');
      const response = await fetch(`${SERVER_URL}/predict`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      console.log('Server response status:', response.status);
      
      const responseText = await response.text();
      console.log('Raw server response:', responseText);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} - ${responseText}`);
      }

      const result = JSON.parse(responseText);
      console.log('Parsed server response:', result);
      
      // Show result to user
      const message = `Prediction: ${result.prediction}\nConfidence: ${(result.confidence * 100).toFixed(2)}%`;
      Alert.alert(
        result.isCancerous ? 'Warning: Potential Skin Cancer Detected' : 'Result: Benign',
        message,
        [{ text: 'OK', onPress: onClose }]
      );

      // Call the onPrediction callback with the results
      onPrediction(result.prediction, result.confidence);
    } catch (error) {
      console.error('Detailed error:', error);
      // Check if it's a network error
      if (error instanceof TypeError && error.message === 'Network request failed') {
        Alert.alert(
          'Network Error',
          'Could not connect to the server. Please check:\n\n' +
          '1. Server is running\n' +
          '2. Server URL is correct\n' +
          '3. Device and server are on the same network\n\n' +
          `Current server URL: ${SERVER_URL}`
        );
      } else {
        Alert.alert('Error', `Failed to process the image: ${error}`);
      }
    } finally {
      setIsCapturing(false);
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <View style={styles.container}>
        <CameraView 
          style={styles.camera} 
          facing={facing}
          ref={cameraRef}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.text}>Close</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.captureContainer}>
            <TouchableOpacity 
              style={styles.captureButton} 
              onPress={takePicture}
              disabled={isCapturing}
            >
              {isCapturing ? (
                <ActivityIndicator size="large" color="white" />
              ) : (
                <View style={styles.captureInner} />
              )}
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: 'white',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  captureContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 40,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
});
