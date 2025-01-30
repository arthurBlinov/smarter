import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  PanResponder,
} from "react-native";
import AddExpense from "./AddExpense";
import ShowExpenses from "./ShowExpenses"; 
import { clearExpensesTable, deleteMonthExpenses } from "../db/dbFunctions";
import NameProvider from "../context/NameContext";
import { useNavigation } from "@react-navigation/native";
import { useAnimationsReducer } from "../hooks/useAnimationReducer";
import { useNameReducer } from "../hooks/useNameReducer";
// import { ChevronDoubleDownIcon } from 'react-native-heroicons/outline'
const MenuPopup = ({ selectedDate, setSummaryContainer }) => {
  const [visibleComponent, setVisibleComponent] = useState(null); 
  const [showConfirmation, setShowConfirmation] = useState(false); 
  const [showDeleteConfirmation, setDeleteConfirmation] = useState(false);
  const { state: animationsState, dispatch: animationsDispatch } = useAnimationsReducer();
  const { confirmationAnim, slideAnim } = animationsState;
  const { name, resetName, dispatch } = useContext(NameProvider);
  const [ , , skipNameWhenRemoved] = useNameReducer(name, resetName);
  const navigation = useNavigation();

  const handleTableDeleting = async() => {
      skipNameWhenRemoved(true)
      await clearExpensesTable();
      await resetName();
      dispatch({type: "RESET_NAME", payload: ""})
      navigation.navigate('StartScreen');
      skipNameWhenRemoved(false);
    }
  const handleDeleteConfirmation = () => {
      if(!showDeleteConfirmation){
        setShowConfirmation(true); 
        animationsDispatch({ type: "SHOW_CONFIRMATION" });
    }
    };
    
    const hideDeleteConfirmation = () => {
      setShowConfirmation(false); 
      animationsDispatch({ type: "HIDE_CONFIRMATION" });
    };
    
    const handleDeleteAllConfirmation = () => {
      if (!showConfirmation){
        setDeleteConfirmation(true); 
        animationsDispatch({ type: "SHOW_CONFIRMATION" });
      }
     
    };
    
    const hideDeleteAllConfirmation = () => {
      setDeleteConfirmation(false); 
      animationsDispatch({ type: "HIDE_CONFIRMATION" });
    };
    
  useEffect(() => {
    animationsDispatch({ type: "HIDE_EVENT" }); 
  }, []);
  
  const showEvent = () => {
    animationsDispatch({ type: "SHOW_EVENT" });
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0) {
        animationsDispatch({ type: "SET_SLIDE_VALUE", payload: gestureState.dy });
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 100) {
        animationsDispatch({ type: "HIDE_EVENT" });
        setTimeout(() => {
          setSummaryContainer(true);
        }, 500);
      } else {
        animationsDispatch({ type: "SHOW_EVENT" });
      }
    },
  });
  

  return (
    <>
      {visibleComponent === "AddExpense" ? (
        <AddExpense slideAnim={slideAnim} selectedDate={selectedDate} goBack={() => setVisibleComponent(null)} />
      ) : visibleComponent === "ShowExpenses" ? (
        <ShowExpenses slideAnim={slideAnim} selectedDate={selectedDate} goBack={() => setVisibleComponent(null)} />
      ) : (
        <Animated.View
          {...panResponder.panHandlers}
          style={[styles.eventContainer, { transform: [{ translateY: slideAnim }] }]}
        >
          <View style={styles.arrowContainer}>
          <TouchableOpacity onPress={() => showEvent()}>
            <View style={styles.arrow} />
          </TouchableOpacity>
        </View>


          <Text style={styles.eventTitle}>תאריך: {selectedDate}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                if(!showConfirmation && !showDeleteConfirmation)
                    setVisibleComponent("ShowExpenses");
              }}
            >
              <Text style={styles.buttonText}>הראה הוצאות</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => 
              { if(!showConfirmation && !showDeleteConfirmation)
                  setVisibleComponent("AddExpense")
              }}
            >
              <Text style={styles.buttonText}>הוסף הוצאה</Text>
            </TouchableOpacity>
      {showConfirmation ? (
          <Animated.View
            style={[
              styles.confirmationContainer,
              { opacity: confirmationAnim, transform: [{ scale: confirmationAnim }] },
            ]}
          >
            <Text style={styles.confirmationText}>האם למחוק את כל ההוצאות של החודש?</Text>
            <View style={styles.confirmationButtons}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#FF6347" }]} 
                onPress={() => {
                  deleteMonthExpenses(selectedDate.split('-')[1], selectedDate.split('-')[0]);
                  hideDeleteConfirmation();
                }}
              >
                <Text style={styles.buttonText}>כן</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#808080" }]}
                onPress={hideDeleteConfirmation}
              >
                <Text style={styles.buttonText}>לא</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
  ) : (
    <TouchableOpacity
      style={styles.actionButton}
      onPress={handleDeleteConfirmation}
    >
      <Text style={styles.buttonText}>מחק הוצאות חודש</Text>
    </TouchableOpacity>
  )}

  {showDeleteConfirmation ? (
    <Animated.View
      style={[
        styles.confirmationContainer,
        { opacity: confirmationAnim, transform: [{ scale: confirmationAnim }] },
      ]}
    >
      <Text style={styles.confirmationText}>האם למחוק את הכל?</Text>
      <View style={styles.confirmationButtons}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#FF6347" }]} 
          onPress={() => {
            handleTableDeleting();
            hideDeleteAllConfirmation();
          }}
        >
          <Text style={styles.buttonText}>כן</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#808080" }]} 
          onPress={hideDeleteAllConfirmation}
        >
          <Text style={styles.buttonText}>לא</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
    ) : (
      <TouchableOpacity
      style={styles.actionButton}
      onPress={handleDeleteAllConfirmation}
    >
      <Text style={styles.buttonText}>מחק הכל ולצאת</Text>
    </TouchableOpacity>
    )}

            </View>
            <View style={styles.arrowContainer}>
            <TouchableOpacity onPress={() => showEvent()}>
              <View>
                {/* <ChevronDoubleDownIcon size={36} style={{}} color='#FFA500'/> */}
              </View>
            </TouchableOpacity>
          </View>

      </Animated.View>
      )}
    </>
  );
};

export default MenuPopup;

const styles = StyleSheet.create({
  eventContainer: {
    position: "absolute",
    width: "100%",
    height: "75%",
    top: 0, 
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
    marginBottom: 14,
    marginTop: 25,
  },
  arrow: {
    width: 65,
    height: 8,
    backgroundColor: "#FFA500",
    borderRadius: 15,
    marginBottom: 10,
  },
  eventTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
  },
  
  actionButton: {
    backgroundColor: "#003300",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 15,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  
  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
  },
  confirmationContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  confirmationText: {
    color: "#FFFFFF",
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  confirmationButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "40%",
  },
  
});

