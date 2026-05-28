import { useEffect, useState } from "react";

import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

import { collection, onSnapshot } from "firebase/firestore";

import * as Print from "expo-print";

import * as Sharing from "expo-sharing";

import { LinearGradient } from "expo-linear-gradient";

import { MaterialIcons } from "@expo/vector-icons";

import Toast from "react-native-toast-message";

import { db } from "../firebase";

const factories = [
  "Glorious Company",
  "New Glorious Company",
  "Ramdoot",
  "Chitra Rubber",
  "Gurudwara Pani",
  "Rajan 425",
  "BN School",
  "Dynamite",
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function BillScreen() {
  const [rounds, setRounds] = useState([]);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "rounds"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRounds(data);
    });

    return () => unsubscribe();
  }, []);

  const generateBill = async (factoryName) => {
    try {
      const factoryRounds = rounds.filter((item) => {
        if (!item.createdAt) return false;

        const date = item.createdAt.toDate();

        return (
          item.factory === factoryName && date.getMonth() === selectedMonth
        );
      });

      let totalLitres = 0;

      factoryRounds.forEach((item) => {
        totalLitres += Number(item.litres || 0);
      });

      const rows = factoryRounds
        .map((item, index) => {
          const date = item.createdAt
            ? item.createdAt.toDate().toLocaleString()
            : "No Date";

          return `
          <tr>
            <td>${index + 1}</td>
            <td>${date}</td>
            <td>${item.litres}L</td>
            <td>${item.driver}</td>
            <td>${item.vehicle}</td>
          </tr>
        `;
        })
        .join("");

      const html = `
        <html>
        <head>
          <style>
            body {
              font-family: Arial;
              padding: 25px;
              color: #0f172a;
            }

            .company {
              text-align: center;
              margin-bottom: 10px;
            }

            .company h1 {
              color: #2563eb;
              margin-bottom: 5px;
              font-size: 34px;
            }

            .company p {
              font-size: 15px;
              color: #475569;
              margin: 2px;
            }

            .billTitle {
              text-align: center;
              margin-top: 30px;
              margin-bottom: 25px;
            }

            .billTitle h2 {
              font-size: 28px;
              color: #1e293b;
            }

            .factory {
              font-size: 22px;
              margin-bottom: 8px;
              text-align: center;
              color: #2563eb;
              font-weight: bold;
            }

            .month {
              text-align: center;
              font-size: 18px;
              margin-bottom: 25px;
              color: #475569;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }

            th {
              background-color: #2563eb;
              color: white;
              padding: 14px;
              border: 1px solid #ddd;
              font-size: 15px;
            }

            td {
              padding: 12px;
              border: 1px solid #ddd;
              text-align: center;
              font-size: 14px;
            }

            tr:nth-child(even) {
              background-color: #f8fafc;
            }

            .summary {
              margin-top: 35px;
              padding: 20px;
              background-color: #f1f5f9;
              border-radius: 12px;
            }

            .summary h3 {
              margin-bottom: 15px;
              color: #2563eb;
            }

            .summary p {
              font-size: 18px;
              margin: 8px 0;
              font-weight: bold;
            }

            .footer {
              margin-top: 50px;
              text-align: center;
              color: #64748b;
              font-size: 14px;
            }
          </style>
        </head>

        <body>

          <div class="company">
            <h1>
              SterlingZ Water Suppliers
            </h1>

            <p>
              242 Jawahar Colony,
              NIT Faridabad,
              Haryana - 121001
            </p>
          </div>

          <div class="billTitle">
            <h2>
              Water Supply Bill
            </h2>
          </div>

          <div class="factory">
            ${factoryName}
          </div>

          <div class="month">
            ${months[selectedMonth]} ${new Date().getFullYear()}
          </div>

          <table>
            <tr>
              <th>#</th>
              <th>Date & Time</th>
              <th>Litres</th>
              <th>Driver</th>
              <th>Vehicle Number</th>
            </tr>

            ${rows}
          </table>

          <div class="summary">
            <h3>Bill Summary</h3>

            <p>
              Total Rounds:
              ${factoryRounds.length}
            </p>

            <p>
              Total Litres:
              ${totalLitres}L
            </p>
          </div>

          <div class="footer">
            Generated by SterlingZ
            Water ERP System
          </div>

        </body>
        </html>
      `;

      const file = await Print.printToFileAsync({
        html,
      });

      Toast.show({
        type: "success",
        text1: "PDF Generated",
        text2: "Bill ready to share",
      });

      await Sharing.shareAsync(file.uri);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "PDF Error",
        text2: error.message,
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Generate PDF Bills</Text>

      <Text style={styles.monthTitle}>Select Month</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.monthContainer}
      >
        {months.map((month, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.monthButton,

              selectedMonth === index && {
                backgroundColor: "#2563eb",
              },
            ]}
            onPress={() => setSelectedMonth(index)}
          >
            <Text
              style={[
                styles.monthText,

                selectedMonth === index && {
                  color: "white",
                },
              ]}
            >
              {month}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {factories.map((factory, index) => (
        <TouchableOpacity
          key={index}
          style={styles.buttonContainer}
          onPress={() => generateBill(factory)}
        >
          <LinearGradient colors={["#2563eb", "#1e40af"]} style={styles.button}>
            <MaterialIcons name="picture-as-pdf" size={28} color="white" />

            <Text style={styles.buttonText}>{factory}</Text>
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
    padding: 20,
  },

  heading: {
    fontSize: 34,
    fontWeight: "bold",
    marginTop: 60,
    marginBottom: 25,
    color: "#0f172a",
  },

  monthTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#0f172a",
  },

  monthContainer: {
    marginBottom: 30,
  },

  monthButton: {
    backgroundColor: "#e2e8f0",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 16,
    marginRight: 12,
  },

  monthText: {
    color: "#0f172a",
    fontWeight: "bold",
  },

  buttonContainer: {
    marginBottom: 20,
    borderRadius: 24,
    overflow: "hidden",
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 24,
  },

  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 15,
  },
});
