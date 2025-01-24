import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  StyleSheet,
  I18nManager,
} from "react-native";
import { validateFields } from "../utils/validateFields";
import { addExpense } from "../db/dbFunctions";
import Loading from "./Loading";
import ErrorPopup from "./ErrorPopup";
import { useAnimationsReducer } from "../hooks/useAnimationReducer";

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

const AddExpense = ({ selectedDate, goBack }) => {
  const { state: animationsState, dispatch: animationsDispatch } = useAnimationsReducer();
  const { fadeAnim } = animationsState;
  const [amount, setAmount] = useState(""); 
  const [note, setNote] = useState(""); 
  const [errors, setErrors] = useState({}); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    animationsDispatch({ type: "FADE_IN" });
  }, []);

  const handleAddExpense = async () => {
    const validationErrors = validateFields(amount, note); 
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      setIsLoading(true); 
      await addExpense(parseFloat(amount), note, selectedDate);
      setAmount("");
      setNote("");
      goBack(); 
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <View style={styles.eventContainer}>
    {isLoading && <Loading />}
    {error && <ErrorPopup/>}
    <Animated.View
      style={[styles.container, {opacity: fadeAnim }]}
    >
      <View style={styles.arrowContainer}>
        <View style={styles.arrow} />
      </View>
      <Text style={styles.eventTitle}>הוסף הוצאה של {selectedDate}</Text>
      <TextInput
        style={[styles.input, errors.amount ? styles.inputError : null]}
        placeholder="כמות (לדוגמה: 50 או 50.75)"
        placeholderTextColor="#aaa"
        textAlign="right"
        onChangeText={(text) => setAmount(text)}
        value={amount}
        numberOfLines={1} 
        multiline={false} 
        scrollEnabled={true}
        importantForAutofill="no"
      />
      {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
      <TextInput
        style={[
          styles.input,
          errors.note ? styles.inputError : null,
        ]}
        placeholder="הוסף הערה (עד 50 תווים)"
        placeholderTextColor="#aaa"
        textAlign="right"
        value={note}
        onChangeText={(text) => setNote(text)}
        numberOfLines={1} 
        multiline={false} 
        scrollEnabled={true}
      />
      {errors.note && <Text style={styles.errorText}>{errors.note}</Text>}
      <TouchableOpacity style={styles.actionButton} onPress={handleAddExpense}>
        <Text style={styles.buttonText}>הוסף הוצאה</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionButton, styles.closeButton]}
        onPress={goBack}
      >
        <Text style={styles.buttonText}>חזור</Text>
      </TouchableOpacity>
    </Animated.View>
    </View>
  );
};

export default AddExpense;

const styles = StyleSheet.create({
  eventContainer: {
    position: "absolute",
    top: 0, 
    width: "100%",
    height: "100%", 
    backgroundColor: "#2A2A40",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  arrowContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  arrow: {
    width: 60,
    height: 5,
    backgroundColor: "#FF6347",
    borderRadius: 10,
  },
  eventTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#3C3C4D",
    paddingHorizontal: 15,
    paddingVertical: 16,
    borderRadius: 10,
    marginVertical: 10,
    color: "#FFFFFF",
    fontSize: 16,
    width: "80%",
    alignSelf: "center",
    writingDirection: "rtl", 
  },
  inputError: {
    borderWidth: 1,
    borderColor: "#FF6347", 
  },
  errorText: {
    color: "#FF6347",
    fontSize: 14,
    textAlign: "right",
    alignSelf: "center",
    width: "80%",
  },
  actionButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
    alignSelf: "center",
  },
  closeButton: {
    backgroundColor: "#FF6347",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});



