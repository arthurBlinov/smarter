import { useReducer } from "react";
import { Animated, Dimensions } from "react-native";

const { height: screenHeight } = Dimensions.get("window");

const initialAnimationsState = {
  fadeAnim: new Animated.Value(0),
  calendarAnim: new Animated.Value(0),
  slideAnim: new Animated.Value(-screenHeight),
  confirmationAnim: new Animated.Value(0), 
  listAnim: new Animated.Value(0), 
};

const animationsReducer = (state, action) => {
  switch (action.type) {
    case "FADE_IN":
      Animated.timing(state.fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
      return state;
    case "SLIDE_CALENDAR":
      Animated.timing(state.calendarAnim, {
        toValue: action.payload,
        duration: 300,
        useNativeDriver: true,
      }).start();
      return state;
    case "SHOW_EVENT":
      Animated.timing(state.slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start();
      return state;
    case "HIDE_EVENT":
      Animated.timing(state.slideAnim, {
        toValue: -screenHeight,
        duration: 600,
        useNativeDriver: true,
      }).start();
      return state;
    case "SHOW_CONFIRMATION":
      state.confirmationAnim.setValue(0); 
      Animated.timing(state.confirmationAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
      return state;
    case "HIDE_CONFIRMATION":
      state.confirmationAnim.setValue(1);
      Animated.timing(state.confirmationAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start();
      return state;
    case "SET_SLIDE_VALUE":
      state.slideAnim.setValue(action.payload);
      return state;
    default:
      return state;
  }
};

export const useAnimationsReducer = () => {
  const [state, dispatch] = useReducer(animationsReducer, initialAnimationsState);
  return { state, dispatch };
};

