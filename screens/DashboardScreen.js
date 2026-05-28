import React, { useEffect, useState } from "react";

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";

import { collection, onSnapshot } from "firebase/firestore";

import { db } from "../firebase";

const factories = [
  {
    name: "Glorious Company",
    icon: "industry",
    colors: ["#2563eb", "#1e40af"],
  },

  {
    name: "New Glorious Company",
    icon: "warehouse",
    colors: ["#7c3aed", "#5b21b6"],
  },

  {
    name: "Ramdoot",
    icon: "building",
    colors: ["#059669", "#047857"],
  },

  {
    name: "Chitra Rubber",
    icon: "industry",
    colors: ["#ea580c", "#c2410c"],
  },

  {
    name: "Gurudwara Pani",
    icon: "warehouse",
    colors: ["#db2777", "#be185d"],
  },

  {
    name: "Rajan 425",
    icon: "building",
    colors: ["#0891b2", "#0e7490"],
  },

  {
    name: "BN School",
    icon: "school",
    colors: ["#16a34a", "#166534"],
  },

  {
    name: "Dynamite",
    icon: "industry",
    colors: ["#dc2626", "#991b1b"],
  },
];

export default function DashboardScreen({ navigation }) {
  const [totalRounds, setTotalRounds] = useState(0);

  const [totalLitres, setTotalLitres] = useState(0);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "rounds"), (snapshot) => {
      let rounds = 0;

      let litres = 0;

      const today = new Date();

      snapshot.docs.forEach((doc) => {
        const data = doc.data();

        if (data.createdAt) {
          const roundDate = data.createdAt.toDate();

          const isToday =
            roundDate.getDate() === today.getDate() &&
            roundDate.getMonth() === today.getMonth() &&
            roundDate.getFullYear() === today.getFullYear();

          if (isToday) {
            rounds += 1;

            litres += Number(data.litres || 0);
          }
        }
      });

      setTotalRounds(rounds);

      setTotalLitres(litres);
    });

    return () => unsubscribe();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Water Supply Dashboard</Text>

      <View style={styles.statsContainer}>
        <LinearGradient
          colors={["#2563eb", "#1d4ed8"]}
          style={styles.statsCard}
        >
          <MaterialIcons name="water-drop" size={40} color="white" />

          <Text style={styles.statsNumber}>{totalLitres}</Text>

          <Text style={styles.statsText}>Total Litres Today</Text>
        </LinearGradient>

        <LinearGradient
          colors={["#7c3aed", "#6d28d9"]}
          style={styles.statsCard}
        >
          <MaterialIcons name="local-shipping" size={40} color="white" />

          <Text style={styles.statsNumber}>{totalRounds}</Text>

          <Text style={styles.statsText}>Total Rounds Today</Text>
        </LinearGradient>
      </View>

      <TouchableOpacity
        style={styles.historyButton}
        onPress={() => navigation.navigate("History")}
      >
        <Text style={styles.historyText}>View Supply History</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.analyticsButton}
        onPress={() => navigation.navigate("Analytics")}
      >
        <Text style={styles.analyticsText}>View Analytics Report</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.billButton}
        onPress={() => navigation.navigate("Bills")}
      >
        <Text style={styles.billText}>Generate PDF Bills</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Factories</Text>

      {factories.map((factory, index) => (
        <TouchableOpacity
          key={index}
          activeOpacity={0.9}
          onPress={() =>
            navigation.navigate("Round", {
              factory: factory.name,
            })
          }
        >
          <LinearGradient colors={factory.colors} style={styles.factoryCard}>
            <FontAwesome5 name={factory.icon} size={28} color="white" />

            <Text style={styles.factoryText}>{factory.name}</Text>

            <MaterialIcons name="arrow-forward-ios" size={24} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 20,
  },

  heading: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 60,
    marginBottom: 25,
    color: "#0f172a",
  },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  statsCard: {
    width: "48%",
    padding: 20,
    borderRadius: 24,
  },

  statsNumber: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 15,
  },

  statsText: {
    color: "white",
    fontSize: 16,
    marginTop: 5,
  },

  historyButton: {
    backgroundColor: "#0f172a",
    padding: 16,
    borderRadius: 18,
    marginBottom: 15,
    alignItems: "center",
  },

  historyText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  analyticsButton: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 18,
    marginBottom: 15,
    alignItems: "center",
  },

  analyticsText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  billButton: {
    backgroundColor: "#059669",
    padding: 16,
    borderRadius: 18,
    marginBottom: 30,
    alignItems: "center",
  },

  billText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#0f172a",
  },

  factoryCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 24,
    borderRadius: 24,
    marginBottom: 18,
    elevation: 5,
  },

  factoryText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    flex: 1,
    marginLeft: 20,
  },
});
