import React from "react";
import { Text, StyleSheet, View } from "react-native";
import { calculateSum } from "../utils/calculateSum";

const Summary = ({ expenses }) => {
  const result = calculateSum(expenses);

  return (
    <View style={styles.container}>
        <View style={styles.line}/>
      {result === false ? (
        <Text style={styles.error}>סכום לא בטוח</Text>
      ) : (
        <Text style={styles.value}>₪ {result}</Text>
      )}
      <View style={styles.line}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',    
    padding: 5
},
  value: {
    fontSize: 18,
    color: "#FFD700",
    textAlign: "center",
  },
  error: {
    fontSize: 18,
    color: "red",
    textAlign: "center", 
  },
  line: {
    width: 150,
    borderColor: '#FFD700',
    borderWidth: 1,
    marginTop: 2,
    marginBottom: 2,
  }
});

export default Summary;

