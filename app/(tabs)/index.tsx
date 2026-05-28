import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Toast from "react-native-toast-message";
import AnalyticsScreen from "../../screens/AnalyticsScreen";
import BillScreen from "../../screens/BillScreen";
import DashboardScreen from "../../screens/DashboardScreen";
import HistoryScreen from "../../screens/HistoryScreen";
import LoginScreen from "../../screens/LoginScreen";
import RoundScreen from "../../screens/RoundScreen";

const Stack = createNativeStackNavigator();

export default function HomeScreen() {
  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />

        <Stack.Screen name="Dashboard" component={DashboardScreen} />

        <Stack.Screen name="Round" component={RoundScreen} />

        <Stack.Screen name="History" component={HistoryScreen} />

        <Stack.Screen name="Analytics" component={AnalyticsScreen} />

        <Stack.Screen name="Bills" component={BillScreen} />
      </Stack.Navigator>

      <Toast />
    </>
  );
}
