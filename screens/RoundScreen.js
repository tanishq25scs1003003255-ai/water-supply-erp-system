import React, { useState } from "react";

import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";

import { addDoc, collection } from "firebase/firestore";

import Toast from "react-native-toast-message";

import { db } from "../firebase";

export default function RoundScreen({ route, navigation }) {
  const { factory } = route.params;

  const [litres, setLitres] = useState("");

  const [driver, setDriver] = useState("");

  const [vehicle, setVehicle] = useState("");

  const saveRound = async () => {
    try {
      await addDoc(collection(db, "rounds"), {
        factory,
        litres,
        driver,
        vehicle,
        createdAt: new Date(),
      });

      Toast.show({
        type: "success",
        text1: "Round Saved",
        text2: "Water supply entry added",
      });

      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message,
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={["#2563eb", "#1e3a8a"]} style={styles.topSection}>
        <View style={styles.iconCircle}>
          <FontAwesome5 name="industry" size={45} color="#2563eb" />
        </View>

        <Text style={styles.factoryName}>{factory}</Text>

        <Text style={styles.subtitle}>Add Water Supply Round</Text>
      </LinearGradient>

      <View style={styles.formCard}>
        <Text style={styles.label}>Water Quantity</Text>

        <View style={styles.inputContainer}>
          <MaterialIcons name="water-drop" size={24} color="#64748b" />

          <TextInput
            placeholder="Enter Litres"
            placeholderTextColor="#94a3b8"
            keyboardType="numeric"
            style={styles.input}
            value={litres}
            onChangeText={setLitres}
          />
        </View>

        <View style={styles.quickButtons}>
          <TouchableOpacity
            style={styles.quickButton}
            onPress={() => setLitres("500")}
          >
            <Text style={styles.quickButtonText}>500L</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickButton}
            onPress={() => setLitres("1000")}
          >
            <Text style={styles.quickButtonText}>1000L</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickButton}
            onPress={() => setLitres("2000")}
          >
            <Text style={styles.quickButtonText}>2000L</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Driver Name</Text>

        <View style={styles.inputContainer}>
          <MaterialIcons name="person" size={24} color="#64748b" />

          <TextInput
            placeholder="Enter Driver Name"
            placeholderTextColor="#94a3b8"
            style={styles.input}
            value={driver}
            onChangeText={setDriver}
          />
        </View>

        <Text style={styles.label}>Vehicle Number</Text>

        <View style={styles.inputContainer}>
          <MaterialIcons name="local-shipping" size={24} color="#64748b" />

          <TextInput
            placeholder="Enter Vehicle Number"
            placeholderTextColor="#94a3b8"
            style={styles.input}
            value={vehicle}
            onChangeText={setVehicle}
          />
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={saveRound}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#2563eb", "#1d4ed8"]}
            style={styles.gradientButton}
          >
            <MaterialIcons name="save" size={24} color="white" />

            <Text style={styles.saveText}>Save Round</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  topSection: {
    paddingTop: 70,
    paddingBottom: 50,
    alignItems: "center",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },

  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    elevation: 10,
  },

  factoryName: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 16,
    color: "#dbeafe",
    marginTop: 8,
  },

  formCard: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 30,
    padding: 25,
    elevation: 8,
    marginTop: -25,
  },

  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 12,
    marginTop: 10,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 18,
    paddingHorizontal: 15,
    height: 60,
    marginBottom: 15,
  },

  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#0f172a",
  },

  quickButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  quickButton: {
    backgroundColor: "#dbeafe",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
  },

  quickButtonText: {
    color: "#2563eb",
    fontWeight: "bold",
    fontSize: 15,
  },

  saveButton: {
    marginTop: 20,
    borderRadius: 18,
    overflow: "hidden",
  },

  gradientButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 18,
  },

  saveText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
