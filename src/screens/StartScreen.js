import React, { useState, useContext, useEffect } from 'react';
import {
  Animated,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Text,
} from 'react-native';
import  NameProvider from '../context/NameContext';
import { useNavigation } from '@react-navigation/native';
import Loading from '../components/Loading';
import { useAnimationsReducer2 } from '../hooks/useAnimationReducer2'; 

const StartScreen = () => {
  const [isLoading, setIsLoading] = useState(false); 
  const { state: animationsState, dispatch: animationsDispatch } = useAnimationsReducer2(); 
  const { scaleAnim, opacityAnim } = animationsState; 
  const { saveName } = useContext(NameProvider);
  const [name, setName] = useState('');
  const [error, setError] = useState(false); 
  const navigation = useNavigation();
  useEffect(() => {
    animationsDispatch({ type: "SCALE_RESET" });
    animationsDispatch({ type: "OPACITY_RESET" });
  }, [])
  const handleFocus = () => {
    animationsDispatch({ type: "SCALE_UP", payload: { toValue: 1.1, duration: 300 } }); 
    animationsDispatch({ type: "OPACITY_CHANGE", payload: { toValue: 0.5, duration: 300 } });
  };

  const handleBlur = () => {
    animationsDispatch({ type: "SCALE_DOWN", payload: { toValue: 1, duration: 300 } }); 
    animationsDispatch({ type: "OPACITY_CHANGE", payload: { toValue: 1, duration: 300 } }); 
  };

  const handleSaveName = async () => {
    if(name.length > 15){
      setError(true);
      return ;
    }else{
      setError(false);
    } 
    setIsLoading(true);
    await saveName(name);
    setTimeout(() => {
      navigation.reset({ 
        index: 0, 
        routes: [{ name: 'HomeScreen' }] 
      });
      setIsLoading(false); 
    }, 1000); 
  };
  
  return (
    <>
      {isLoading && <Loading />}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={[styles.container, {direction:"rtl"}]}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <Animated.View
              style={[
                styles.inputContainer,
                { transform: [{ scale: scaleAnim }], borderColor: error ? 'red' : '#006400' },
              ]}
            >
              <Animated.Text style={[styles.label, { opacity: opacityAnim, color: error ? 'red' : '#aaa' }]}>
                {error ? 'גדול מדי' : 'מה שמך'}
              </Animated.Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    direction: 'rtl',
                    textAlign: 'right',
                    writingDirection: 'rtl',
                  },
                ]}
                onFocus={handleFocus}
                onBlur={handleBlur}
                value={name}
                onChangeText={(text) => setName(text)}
                placeholder="שמי"
                placeholderTextColor="green"
              />
            </Animated.View>

          <TouchableOpacity
            onPress={handleSaveName}
            style={[styles.btnStyles, !name && styles.disabledBtnStyles]}
            disabled={!name}
          >
            <Text style={styles.btnText}>{name ? 'לחץ' : 'לא נלחץ'}</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E1E2C',
  },
  inputContainer: {
    width: '80%',
    borderWidth: 2,
    borderColor: '#006400',
    borderRadius: 10,
    padding: 10,
    marginBottom: 100,
    backgroundColor: '#2A2A40',
  },
  input: {
    height: 40,
    fontSize: 16,
    color: '#fff',
  },
  label: {
    position: 'absolute',
    top: -10,
    // left: 15,
    fontSize: 13,
    color: '#aaa',
    backgroundColor: '#2A2A40',
    paddingHorizontal: 5,
    zIndex: 9,
  },
  btnStyles: {
    width: 200,
    height: 50,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10, 
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  disabledBtnStyles: {
    backgroundColor: '#2A2A40',
    elevation: 0,
    shadowOpacity: 0,
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default StartScreen;




