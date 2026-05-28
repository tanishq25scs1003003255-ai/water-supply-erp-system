import React, { useEffect, useState } from "react";

import { Dimensions, ScrollView, StyleSheet, Text } from "react-native";

import { collection, onSnapshot } from "firebase/firestore";

import { db } from "../firebase";

import { BarChart, LineChart } from "react-native-chart-kit";

export default function AnalyticsScreen() {
  const [weeklyData, setWeeklyData] = useState([0, 0, 0, 0, 0, 0, 0]);

  const [monthlyData, setMonthlyData] = useState([0, 0, 0, 0, 0, 0]);

  const [factoryData, setFactoryData] = useState([0, 0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "rounds"), (snapshot) => {
      const weeklyTotals = [0, 0, 0, 0, 0, 0, 0];

      const monthlyTotals = [0, 0, 0, 0, 0, 0];

      const factoryTotals = {
        "Glorious Company": 0,
        "New Glorious Company": 0,
        Ramdoot: 0,
        "Chitra Rubber": 0,
        "Gurudwara Pani": 0,
        "Rajan 425": 0,
        "BN School": 0,
      };

      snapshot.docs.forEach((doc) => {
        const data = doc.data();

        if (data.createdAt) {
          const date = data.createdAt.toDate();

          const day = date.getDay();

          weeklyTotals[day] += Number(data.litres || 0);

          const month = date.getMonth();

          if (month < 6) {
            monthlyTotals[month] += Number(data.litres || 0);
          }

          if (factoryTotals[data.factory] !== undefined) {
            factoryTotals[data.factory] += Number(data.litres || 0);
          }
        }
      });

      setWeeklyData(weeklyTotals);

      setMonthlyData(monthlyTotals);

      setFactoryData([
        factoryTotals["Glorious Company"],
        factoryTotals["New Glorious Company"],
        factoryTotals["Ramdoot"],
        factoryTotals["Chitra Rubber"],
        factoryTotals["Gurudwara Pani"],
        factoryTotals["Rajan 425"],
        factoryTotals["BN School"],
      ]);
    });

    return () => unsubscribe();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Supply Analytics</Text>

      <Text style={styles.graphTitle}>Weekly Water Supply</Text>

      <LineChart
        data={{
          labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],

          datasets: [
            {
              data: weeklyData,
            },
          ],
        }}
        width={Dimensions.get("window").width - 40}
        height={250}
        chartConfig={{
          backgroundGradientFrom: "#2563eb",

          backgroundGradientTo: "#1e3a8a",

          decimalPlaces: 0,

          color: (opacity = 1) => `rgba(255,255,255,${opacity})`,

          labelColor: (opacity = 1) => `rgba(255,255,255,${opacity})`,

          style: {
            borderRadius: 24,
          },

          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: "#1d4ed8",
          },
        }}
        bezier
        style={styles.chart}
      />

      <Text style={styles.graphTitle}>Monthly Water Supply</Text>

      <BarChart
        data={{
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],

          datasets: [
            {
              data: monthlyData,
            },
          ],
        }}
        width={Dimensions.get("window").width - 40}
        height={260}
        yAxisLabel=""
        yAxisSuffix="L"
        chartConfig={{
          backgroundGradientFrom: "#7c3aed",

          backgroundGradientTo: "#5b21b6",

          decimalPlaces: 0,

          color: (opacity = 1) => `rgba(255,255,255,${opacity})`,

          labelColor: (opacity = 1) => `rgba(255,255,255,${opacity})`,

          style: {
            borderRadius: 24,
          },
        }}
        style={styles.chart}
      />

      <Text style={styles.graphTitle}>Factory-wise Supply</Text>

      <BarChart
        data={{
          labels: ["GC", "NGC", "Ram", "CR", "GP", "R425", "BN"],

          datasets: [
            {
              data: factoryData,
            },
          ],
        }}
        width={Dimensions.get("window").width - 40}
        height={320}
        yAxisLabel=""
        yAxisSuffix="L"
        fromZero
        showValuesOnTopOfBars
        chartConfig={{
          backgroundGradientFrom: "#059669",

          backgroundGradientTo: "#065f46",

          decimalPlaces: 0,

          color: (opacity = 1) => `rgba(255,255,255,${opacity})`,

          labelColor: (opacity = 1) => `rgba(255,255,255,${opacity})`,

          style: {
            borderRadius: 24,
          },
        }}
        style={styles.chart}
      />
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
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 50,
    marginBottom: 30,
    color: "#0f172a",
  },

  graphTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#0f172a",
  },

  chart: {
    marginBottom: 35,
    borderRadius: 24,
  },
});
