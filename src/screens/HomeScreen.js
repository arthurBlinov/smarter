import React, { useContext, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import NameProvider from '../context/NameContext';
import { initializeDatabase } from '../db/sqlTables';
import Loading from '../components/Loading'; 
import ErrorPopup from '../components/ErrorPopup';
import { useAnimationsReducer2 } from '../hooks/useAnimationReducer2'; 

const HomeScreen = ({ navigation }) => {
  const { name } = useContext(NameProvider);
  const { state: animationsState, dispatch: animationsDispatch } = useAnimationsReducer2(); 
  const { fadeAnim, scaleAnim } = animationsState; 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useMemo(() => {
    const setupDatabase = async () => {
      try {
        await initializeDatabase();
        setLoading(false);  
      } catch (error) {
        setError(error);
      }
    };
    setupDatabase();
  }, []);

  useEffect(() => {
    animationsDispatch({ type: "FADE_IN", payload: { duration: 1000 } }); 
    animationsDispatch({ type: "SCALE_UP", payload: { toValue: 1, duration: 1000 } }); 
  }, []);

  const handleNavigate = () => {
    navigation.navigate('CalendarScreen');
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      {error && <ErrorPopup />}
      <Animated.View style={[styles.rowContainer, { opacity: fadeAnim }]}>
        <Text style={styles.welcomeText}>ברוך הבא לחכמר</Text>
        <Animated.Text style={[styles.nameText, { transform: [{ scale: scaleAnim }] }]}>
          {name},
        </Animated.Text>
      </Animated.View>
      <TouchableOpacity onPress={handleNavigate} style={styles.pillowButton}>
        <Text style={styles.pillowText}>חכמר</Text>
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
    flexDirection: 'row',
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



