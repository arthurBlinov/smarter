import { useReducer, useEffect, useRef } from "react";

const initialState = {
  name: "",
  editingName: false,
  isInputFocused: false,
  newName: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "EDIT_NAME":
      return { ...state, editingName: true, newName: state.name };
    case "SAVE_NAME":
      return { ...state, name: state.newName, editingName: false, newName: "" };
    case "CANCEL_EDIT":
      return { ...state, editingName: false, newName: "" };
    case "SET_NEW_NAME":
      return { ...state, newName: action.payload };
    case "SET_INPUT_FOCUS":
      return { ...state, isInputFocused: action.payload };
    default:
      return state;
  }
};

export const useNameReducer = (initialName, saveName) => {
  const [state, nameDispatch] = useReducer(reducer, { ...initialState, name: initialName });
  const skipName = useRef(false);
  const skipNameWhenRemoved = (value) => {
      skipName.current = value;
  }

  useEffect(() => {
    const saveNameToStorage = async() => {
      if (!state.editingName && !skipName.current) {
        await saveName(state.name);
      }
    }
    saveNameToStorage();
  }, [state.editingName, skipName.current]);

  return [state, nameDispatch, skipNameWhenRemoved];
};
