import { useReducer } from "react";
import { Animated } from "react-native";

const initialAnimationsState = {
  fadeAnim: new Animated.Value(1),
  scaleAnim: new Animated.Value(1),
  opacityAnim: new Animated.Value(1), 
};

const animationsReducer = (state, action) => {
  switch (action.type) {
    case "FADE_IN":
      Animated.timing(state.fadeAnim, {
        toValue: 1,
        duration: action.payload?.duration,
        useNativeDriver: true,
      }).start();
      return state;
    case "FADE_RESET":
      state.fadeAnim.setValue(0);
      return state;
    case "SCALE_RESET":
      state.scaleAnim.setValue(1);
      return state;
    case "OPACITY_RESET":
      state.opacityAnim.setValue(1);
      return state;
    case "SCALE_UP":
      Animated.timing(state.scaleAnim, {
        toValue: action.payload?.toValue || 1.1,
        duration: action.payload?.duration,
        useNativeDriver: true,
      }).start();
      return state;
    case "SCALE_DOWN":
      Animated.timing(state.scaleAnim, {
        toValue: action.payload?.toValue || 1,
        duration: action.payload?.duration || 300,
        useNativeDriver: true,
      }).start();
      return state;
    case "OPACITY_CHANGE":
      Animated.timing(state.opacityAnim, {
        toValue: action.payload?.toValue || 1,
        duration: action.payload?.duration || 300,
        useNativeDriver: true,
      }).start();
      return state;
    case "RESET_ANIMATIONS":
      state.fadeAnim.setValue(0);
      state.scaleAnim.setValue(1);
      state.opacityAnim.setValue(1);
      return state;
    default:
      return state;
  }
};

export const useAnimationsReducer2 = () => {
  const [state, dispatch] = useReducer(animationsReducer, initialAnimationsState);
  return { state, dispatch };
};
