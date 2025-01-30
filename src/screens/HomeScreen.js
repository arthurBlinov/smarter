import React, { useContext, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, BackHandler } from 'react-native';
import NameProvider from '../context/NameContext';
// import { initializeDatabase } from '../db/sqlTables';
import { initializeDatabase } from '../db/dbFunctions';
import Loading from '../components/Loading'; 
import ErrorPopup from '../components/ErrorPopup';
import { useAnimationsReducer2 } from '../hooks/useAnimationReducer2'; 
// import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = ({ navigation }) => {
  const { name } = useContext(NameProvider);
  const { state: animationsState, dispatch: animationsDispatch } = useAnimationsReducer2(); 
  const { fadeAnim, scaleAnim } = animationsState; 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleNavigate = () => {
    navigation.navigate('CalendarScreen');
  };
//   useFocusEffect(
//     React.useCallback(() => {
//         const onBackPress = () => {
//             return true;
//         };
      
//         BackHandler.addEventListener('hardwareBackPress', onBackPress);

//         return () =>
//             BackHandler.removeEventListener('hardwareBackPress', onBackPress);
//     }, [])
// );
  useMemo(() => {
    setLoading(true)
    const setupDatabase = async () => {
      try {
        await initializeDatabase();
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false); 
      }
    };
    setupDatabase();
  }, []);
  

  useEffect(() => {
    // animationsDispatch({ type: "FADE_RESET" });
    animationsDispatch({ type: "FADE_IN", payload: { duration: 600 } }); 
    animationsDispatch({ type: "SCALE_UP", payload: { toValue: 1.2, duration: 800 } });
  }, [loading]);
 
  return (
    <View style={styles.container}>
      {error && <ErrorPopup />}
      {loading && <Loading/>}
      <Animated.View style={[styles.rowContainer, { opacity: fadeAnim }]}>
        <Text style={styles.welcomeText}>ברוכים הבאים לסמארטר, </Text>
        <Animated.Text style={[styles.nameText, { transform: [{ scale: scaleAnim }] }]}>
          {name}
        </Animated.Text>
      </Animated.View>
      <TouchableOpacity onPress={handleNavigate} disabled={loading} style={[styles.pillowButton, { opacity: fadeAnim}]}>
        <Animated.Text style={styles.pillowText}>סמארטר</Animated.Text>
      </TouchableOpacity>
    </View>
  );
};
export default HomeScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 10, 
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700', 
  },
  pillowButton: {
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    backgroundColor: '#003300', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillowText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});



