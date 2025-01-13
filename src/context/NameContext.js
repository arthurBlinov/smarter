import React, { createContext, useReducer, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NameContext = createContext();

const initialState = "";

const nameReducer = (state, action) => {
  switch (action.type) {
    case "SET_NAME":
      return action.payload; 
    case "RESET_NAME":
      return ""; 
    case "GET_NAME":
      return typeof action.payload === "string" ? action.payload : state; 
    default:
      return state;
  }
};

export const NameProvider = ({ children }) => {
  const [name, dispatch] = useReducer(nameReducer, initialState);
  const fetchNameFromStorage = async () => {
    try {
      const storedName = await AsyncStorage.getItem("name");
      if (storedName) {
        dispatch({ type: "GET_NAME", payload: JSON.parse(storedName) });
      }
    } catch (error) {
      console.error("Failed to load name from storage:", error);
    }
  };
  useEffect(() => {
    fetchNameFromStorage();
  }, []);

  const saveName = async (newName) => {
    try {
      await AsyncStorage.setItem("name", JSON.stringify(newName));
      dispatch({ type: "SET_NAME", payload: newName });
    } catch (error) {
      console.error("Failed to save name to storage:", error);
    }
  };

  const resetName = async () => {
    try {
      await AsyncStorage.removeItem("name");
      dispatch({ type: "RESET_NAME" });
    } catch (error) {
      console.error("Failed to reset name in storage:", error);
    }
  };

  return (
    <NameContext.Provider value={{ name, saveName, resetName, fetchNameFromStorage, dispatch }}>
      {children}
    </NameContext.Provider>
  );
};

export default NameContext;
