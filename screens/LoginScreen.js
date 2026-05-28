import React, { useState } from "react";

import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { MaterialIcons } from "@expo/vector-icons";

import { signInWithEmailAndPassword } from "firebase/auth";

import Toast from "react-native-toast-message";

import { auth } from "../firebase";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);

      Toast.show({
        type: "success",
        text1: "Login Successful",
        text2: "Welcome Back 👋",
      });

      navigation.replace("Dashboard");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: error.message,
      });
    }
  };

  return (
    <LinearGradient colors={["#2563eb", "#1e3a8a"]} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.innerContainer}
      >
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <MaterialIcons name="water-drop" size={60} color="#2563eb" />
          </View>

          <Text style={styles.title}>Water Supply ERP</Text>

          <Text style={styles.subtitle}>Smart Water Management System</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.inputContainer}>
            <MaterialIcons name="email" size={24} color="#64748b" />

            <TextInput
              placeholder="Enter Email"
              placeholderTextColor="#94a3b8"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="lock" size={24} color="#64748b" />

            <TextInput
              placeholder="Enter Password"
              placeholderTextColor="#94a3b8"
              secureTextEntry
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  innerContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 25,
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },

  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    elevation: 10,
  },

  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "white",
  },

  subtitle: {
    color: "#dbeafe",
    fontSize: 16,
    marginTop: 8,
  },

  card: {
    backgroundColor: "white",
    borderRadius: 30,
    padding: 25,
    elevation: 10,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 18,
    paddingHorizontal: 15,
    marginBottom: 18,
    height: 60,
  },

  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#0f172a",
  },

  button: {
    backgroundColor: "#2563eb",
    height: 60,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});
