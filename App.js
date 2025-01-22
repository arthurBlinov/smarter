import React, { useState, useContext, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import StartScreen from "./src/screens/StartScreen";
import HomeScreen from "./src/screens/HomeScreen";
import CalendarScreen from "./src/screens/CalendarScreen";
import MonthlyExpensesScreen from "./src/screens/MonthlyExpensesScreen";
import Loading from "./src/components/Loading";
import NameProvider from "./src/context/NameContext";

const MainStack = createStackNavigator();

const Navbar = () => (
  <View style={styles.navbar}>
    <Text style={[ styles.navText, {textAlign: 'center'} ]}>סמארטר</Text>
  </View>
);

const App = () => {
  const { name, loading } = useContext(NameProvider);
  if (loading) {
    return (
     <Loading/>
    );
  }  
  const initialRoute = name ? "HomeScreen" : "StartScreen";
   


  return (
    <NavigationContainer>
      <MainStack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerStyle: { backgroundColor: "#003300"},
          headerTitleAlign: 'center',
          headerTitle: () => <Navbar />,
          headerLeft: () => null
        }}
      >
        <MainStack.Screen name="StartScreen" component={StartScreen}/>
        <MainStack.Screen
          name="HomeScreen"
          component={HomeScreen}
        />
        <MainStack.Screen
          name="CalendarScreen"
          component={CalendarScreen}
          options={{ title: "Calendar" }}
        />
        <MainStack.Screen
          name="MonthlyExpensesScreen"
          component={MonthlyExpensesScreen}
          options={{ title: "Monthly Expenses" }}
        />
      </MainStack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  navbar: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
    backgroundColor: '#003300'
  },
  navText: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "800",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E1E2C",
  },
});

