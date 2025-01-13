import { useReducer } from "react";

const initialState = {
  selectedDate: new Date().toISOString().split("T")[0],
  currentMonth: new Date().getMonth() + 1,
  currentYear: new Date().getFullYear(),
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_SELECTED_DATE":
      return { ...state, selectedDate: action.payload };
    case "SET_MONTH_YEAR":
      return {
        ...state,
        currentMonth: action.payload.month,
        currentYear: action.payload.year,
      };
    default:
      return state;
  }
};

export const useDateReducer = () => useReducer(reducer, initialState);
