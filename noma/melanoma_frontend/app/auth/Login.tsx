import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, useColorScheme } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";

const Login = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const API_URL = 'http://10.0.0.208:8081';


  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem("token", data.token);
        router.replace("/(tabs)"); // Redirect to main app
      } else {
        Alert.alert("Login Failed", data.error || "Invalid credentials");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: isDarkMode ? "#121212" : "#FFFFFF", // Adjust background color
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 20,
          color: isDarkMode ? "#FFFFFF" : "#000000", // Light text in dark mode
        }}
      >
        Login
      </Text>

      <TextInput
        style={{
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
          width: "100%",
          borderRadius: 5,
          borderColor: isDarkMode ? "#888" : "#ccc",
          color: isDarkMode ? "#FFFFFF" : "#000000", // Input text color
          backgroundColor: isDarkMode ? "#333" : "#FFF", // Input background
        }}
        placeholder="Email"
        placeholderTextColor={isDarkMode ? "#BBBBBB" : "#888888"}
        onChangeText={setEmail}
        value={email}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={{
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
          width: "100%",
          borderRadius: 5,
          borderColor: isDarkMode ? "#888" : "#ccc",
          color: isDarkMode ? "#FFFFFF" : "#000000",
          backgroundColor: isDarkMode ? "#333" : "#FFF",
        }}
        placeholder="Password"
        placeholderTextColor={isDarkMode ? "#BBBBBB" : "#888888"}
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      <TouchableOpacity
        onPress={handleLogin}
        style={{
          backgroundColor: "#007BFF",
          padding: 10,
          borderRadius: 5,
          width: "100%",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#FFFFFF", fontWeight: "bold" }}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("../auth/Signup")} style={{ marginTop: 10 }}>
        <Text style={{ color: "#007BFF" }}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
