import React, { useEffect, useState } from "react";

import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";

import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";

import { LinearGradient } from "expo-linear-gradient";

import Modal from "react-native-modal";

import Toast from "react-native-toast-message";

import { db } from "../firebase";

export default function HistoryScreen() {
  const [rounds, setRounds] = useState([]);

  const [search, setSearch] = useState("");

  const [filterType, setFilterType] = useState("all");

  const [modalVisible, setModalVisible] = useState(false);

  const [selectedRound, setSelectedRound] = useState(null);

  const [editLitres, setEditLitres] = useState("");

  const [editDriver, setEditDriver] = useState("");

  const [editVehicle, setEditVehicle] = useState("");

  useEffect(() => {
    const q = query(collection(db, "rounds"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }));

      setRounds(data);
    });

    return () => unsubscribe();
  }, []);

  const deleteRound = async (id) => {
    Alert.alert(
      "Delete Record",
      "Are you sure you want to delete this round?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },

        {
          text: "Delete",
          style: "destructive",

          onPress: async () => {
            try {
              await deleteDoc(doc(db, "rounds", id));

              Toast.show({
                type: "success",
                text1: "Round Deleted",
                text2: "Record removed successfully",
              });
            } catch (error) {
              Toast.show({
                type: "error",
                text1: "Delete Failed",
                text2: error.message,
              });
            }
          },
        },
      ],
    );
  };

  const openEditModal = (item) => {
    setSelectedRound(item);

    setEditLitres(item.litres);

    setEditDriver(item.driver);

    setEditVehicle(item.vehicle);

    setModalVisible(true);
  };

  const saveChanges = async () => {
    try {
      await updateDoc(doc(db, "rounds", selectedRound.id), {
        litres: editLitres,
        driver: editDriver,
        vehicle: editVehicle,
      });

      Toast.show({
        type: "success",
        text1: "Round Updated",
        text2: "Changes saved successfully",
      });

      setModalVisible(false);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: error.message,
      });
    }
  };

  const filterRounds = () => {
    const now = new Date();

    return rounds.filter((item) => {
      if (!item.createdAt) return false;

      const roundDate = item.createdAt.toDate();

      const matchesSearch = item.factory
        ?.toLowerCase()
        .includes(search.toLowerCase());

      if (!matchesSearch) return false;

      if (filterType === "today") {
        return (
          roundDate.getDate() === now.getDate() &&
          roundDate.getMonth() === now.getMonth() &&
          roundDate.getFullYear() === now.getFullYear()
        );
      }

      if (filterType === "week") {
        const diff = (now - roundDate) / (1000 * 60 * 60 * 24);

        return diff <= 7;
      }

      if (filterType === "month") {
        return (
          roundDate.getMonth() === now.getMonth() &&
          roundDate.getFullYear() === now.getFullYear()
        );
      }

      return true;
    });
  };

  const filteredRounds = filterRounds();

  const renderItem = ({ item }) => {
    const date = item.createdAt
      ? item.createdAt.toDate().toLocaleString()
      : "No Date";

    return (
      <LinearGradient colors={["#ffffff", "#f8fafc"]} style={styles.card}>
        <View style={styles.topRow}>
          <View style={styles.factoryContainer}>
            <FontAwesome5 name="industry" size={20} color="#2563eb" />

            <Text style={styles.factory}>{item.factory}</Text>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => openEditModal(item)}
            >
              <MaterialIcons name="edit" size={22} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteRound(item.id)}
            >
              <MaterialIcons name="delete" size={22} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoRow}>
          <MaterialIcons name="water-drop" size={22} color="#2563eb" />

          <Text style={styles.detail}>{item.litres} Litres</Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialIcons name="person" size={22} color="#7c3aed" />

          <Text style={styles.detail}>{item.driver}</Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialIcons name="local-shipping" size={22} color="#059669" />

          <Text style={styles.detail}>{item.vehicle}</Text>
        </View>

        <View style={styles.dateContainer}>
          <MaterialIcons name="access-time" size={18} color="#64748b" />

          <Text style={styles.date}>{date}</Text>
        </View>
      </LinearGradient>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Supply History</Text>

      <View style={styles.searchBox}>
        <MaterialIcons name="search" size={24} color="#64748b" />

        <TextInput
          placeholder="Search Factory..."
          placeholderTextColor="#94a3b8"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.filterRow}>
        {["all", "today", "week", "month"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.filterButton,

              filterType === item && {
                backgroundColor: "#2563eb",
              },
            ]}
            onPress={() => setFilterType(item)}
          >
            <Text
              style={[
                styles.filterText,

                filterType === item && {
                  color: "white",
                },
              ]}
            >
              {item.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredRounds}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
      >
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Edit Round</Text>

          <TextInput
            placeholder="Litres"
            value={editLitres}
            onChangeText={setEditLitres}
            style={styles.modalInput}
            keyboardType="numeric"
          />

          <TextInput
            placeholder="Driver Name"
            value={editDriver}
            onChangeText={setEditDriver}
            style={styles.modalInput}
          />

          <TextInput
            placeholder="Vehicle Number"
            value={editVehicle}
            onChangeText={setEditVehicle}
            style={styles.modalInput}
          />

          <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
            <Text style={styles.saveText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 20,
  },

  heading: {
    fontSize: 34,
    fontWeight: "bold",
    marginTop: 60,
    marginBottom: 25,
    color: "#0f172a",
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 18,
    paddingHorizontal: 15,
    height: 60,
    marginBottom: 20,
  },

  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#0f172a",
  },

  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  filterButton: {
    backgroundColor: "#e2e8f0",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
  },

  filterText: {
    fontWeight: "bold",
    color: "#0f172a",
  },

  card: {
    borderRadius: 28,
    padding: 22,
    marginBottom: 20,
    elevation: 5,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  factoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  factory: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0f172a",
    marginLeft: 12,
    flex: 1,
  },

  actionRow: {
    flexDirection: "row",
  },

  editButton: {
    backgroundColor: "#2563eb",
    width: 45,
    height: 45,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  deleteButton: {
    backgroundColor: "#dc2626",
    width: 45,
    height: 45,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  detail: {
    fontSize: 17,
    color: "#334155",
    marginLeft: 12,
    fontWeight: "600",
  },

  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 15,
  },

  date: {
    marginLeft: 8,
    color: "#64748b",
    fontSize: 14,
  },

  modalCard: {
    backgroundColor: "white",
    borderRadius: 28,
    padding: 25,
  },

  modalTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
    color: "#0f172a",
    textAlign: "center",
  },

  modalInput: {
    backgroundColor: "#f1f5f9",
    borderRadius: 18,
    paddingHorizontal: 15,
    height: 60,
    marginBottom: 18,
    fontSize: 16,
    color: "#0f172a",
  },

  saveButton: {
    backgroundColor: "#2563eb",
    height: 60,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  saveText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
