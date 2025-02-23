import { View, Text, StyleSheet, Image } from "react-native";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Image source={{ uri: "https://randomuser.me/api/portraits/women/44.jpg" }} style={styles.image} />
      <Text style={styles.title}>Sarah Johnson</Text>
      <Text>Email: sarah.j@example.com</Text>
      <Text>Date of Birth: 15 March 1990</Text>
      <Text>Skin Type: Type II - Fair</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 5 },
  image: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
});
