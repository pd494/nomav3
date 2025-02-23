import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, useColorScheme } from "react-native";
import { useRouter } from "expo-router";

const Signup = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const API_URL = 'http://10.0.0.208:8081';

  const handleSignup = async () => {
    try {
        console.log("signup!", { email, password, name });
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Account created!");
        router.push("../auth/Login"); // Navigate to login page
        console.log("signup success", data);
      } else {
        Alert.alert("Signup Failed", data.error || "Please try again");
        console.log("signup failed", data.error);
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
        backgroundColor: isDarkMode ? "#121212" : "#FFFFFF",
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 20,
          color: isDarkMode ? "#FFFFFF" : "#000000",
        }}
      >
        Signup
      </Text>

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
        placeholder="Name"
        placeholderTextColor={isDarkMode ? "#BBBBBB" : "#888888"}
        onChangeText={setName}
        value={name}
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
        onPress={handleSignup}
        style={{
          backgroundColor: "#007BFF",
          padding: 10,
          borderRadius: 5,
          width: "100%",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#FFFFFF", fontWeight: "bold" }}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("../auth/Login")} style={{ marginTop: 10 }}>
        <Text style={{ color: "#007BFF" }}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Signup;
