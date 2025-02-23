import { View, Text, StyleSheet } from "react-native";

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan History</Text>
      <View style={styles.card}>
        <Text style={styles.date}>2025-02-15</Text>
        <Text>Left Arm</Text>
        <Text style={styles.lowRisk}>Low Risk</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.date}>2025-02-10</Text>
        <Text>Back</Text>
        <Text style={styles.lowRisk}>Low Risk</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  card: { backgroundColor: "#f2f2f2", padding: 15, borderRadius: 10, marginBottom: 10 },
  date: { fontSize: 16, fontWeight: "bold" },
  lowRisk: { color: "green", fontWeight: "bold" },
});
