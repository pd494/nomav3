import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState, useRef } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImageManipulator from "expo-image-manipulator";
import axios from "axios";

// ✅ Update SERVER_URL to your actual Flask server IP
const SERVER_URL = "http://10.0.0.208:5001";  

interface CameraComponentProps {
  visible: boolean;
  onClose: () => void;
  onPrediction: (prediction: string, confidence: number) => void;
}

export default function CameraComponent({
  visible,
  onClose,
  onPrediction,
}: CameraComponentProps) {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<any>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to use the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  async function takePicture() {
    if (!cameraRef.current || isCapturing) return;

    setIsCapturing(true);
    try {
      console.log("📸 Taking picture...");
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        base64: false,
        skipProcessing: true,
      });

      if (!photo?.uri) {
        throw new Error("Failed to capture photo");
      }
      console.log("✅ Photo captured:", photo.uri);

      // Process the image
      console.log("🛠️ Processing image...");
      const processedImage = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 224, height: 224 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );

      console.log("📂 Processed image URI:", processedImage.uri);

      // Get stored auth token
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("User is not logged in. No token found.");
      }

      // Send image to ML model
      console.log("🚀 Sending image to server...");
      const formData = new FormData();
      formData.append("image", {
        uri: processedImage.uri,
        type: "image/jpeg",
        name: "photo.jpg",
      } as any);

      const response = await fetch(`${SERVER_URL}/predict`, {
        method: "POST",
        body: formData,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      console.log("📊 Server response:", result);

      // Display result
      const predictionMessage = `Prediction: ${result.prediction}\nConfidence: ${(result.confidence * 100).toFixed(2)}%`;

      Alert.alert(
        result.isCancerous
          ? "⚠️ Warning: Potential Skin Cancer Detected"
          : "✅ Result: Benign",
        predictionMessage,
        [{ text: "OK", onPress: onClose }]
      );

      // ✅ Call the onPrediction callback
      onPrediction(result.prediction, result.confidence);

      // ✅ Save scan result to the database
      await saveScanToDatabase(processedImage.uri, result.prediction, token);

    } catch (error) {
      console.error("❌ Error processing image:", error);
      Alert.alert("Error", "Failed to process the image.");
    } finally {
      setIsCapturing(false);
    }
  }

  async function saveScanToDatabase(imageUri: string, diagnosis: string, token: string) {
    try {
      console.log("💾 Saving scan to database...");
  
      if (!token) {
        throw new Error("User is not logged in. No token found.");
      }

      await axios.post(
        "http://127.0.0.1:5000/auth/save_scan",
        {
          image_url: imageUri,
          diagnosis,
          location: "Left Arm",
        },
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Scan saved successfully.");
    } catch (error) {
      console.error("❌ Error saving scan:", error);
      Alert.alert("Error", "Failed to save scan.");
    }
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={styles.container}>
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.text}>Close</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.captureContainer}>
            <TouchableOpacity style={styles.captureButton} onPress={takePicture} disabled={isCapturing}>
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
    backgroundColor: "black",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
    color: "white",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  captureContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 40,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
  },
});
