import React, { useEffect, useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Animated,
  I18nManager,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Keyboard,
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import MenuPopup from "../components/MenuPopup";
import Summary from "../components/Summary";
import { useNameReducer } from "../hooks/useNameReducer";
import { useDateReducer } from "../hooks/useDateReducer";
import { useAnimationsReducer } from "../hooks/useAnimationReducer";
import { fetchMonthWithoutPag } from "../db/dbFunctions";
import NameProvider from "../context/NameContext";
import ErrorPopup from "../components/ErrorPopup";
import { useNavigation } from "@react-navigation/native";

I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

const CalendarScreen = () => {
  const { name, saveName } = useContext(NameProvider);
  const [{ name: currentName, editingName, newName, isInputFocused }, nameDispatch] =
    useNameReducer(name, saveName);
  const [{ selectedDate, currentMonth, currentYear }, dateDispatch] = useDateReducer();
  const { state: animationsState, dispatch: animationsDispatch } = useAnimationsReducer();
  const [expenses, setExpenses] = useState([]);
  const { fadeAnim, calendarAnim } = animationsState;
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const [summaryContainer, setSummaryContainer] = useState(true);
  
  LocaleConfig.locales["he"] = {
    monthNames: [
      "ינואר",
      "פברואר",
      "מרץ",
      "אפריל",
      "מאי",
      "יוני",
      "יולי",
      "אוגוסט",
      "ספטמבר",
      "אוקטובר",
      "נובמבר",
      "דצמבר",
    ],
    dayNames: ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"],
    dayNamesShort: [ "א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳",  "ש׳"],
    today: "היום",
  };
  LocaleConfig.defaultLocale = "he";

  useEffect(() => {
    animationsDispatch({ type: "FADE_IN" });
    
  }, []);
  const getMarkedDates = () => {
    const marked = {
      [selectedDate]: {
        selected: true,
        marked: true,
        selectedColor: "#003300", 
      },
    };
  
    expenses.forEach((expense) => {
      const { date } = expense; 
      marked[date] = {
        ...marked[date],
        marked: true,
        dotColor: "#FFFFFF", 
        activeOpacity: 0,
      };
    });
  
    return marked;
  };
  
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const exps = await fetchMonthWithoutPag(
          String(currentMonth).padStart(2, "0"),
          String(currentYear)
        );
        setExpenses(exps);
      } catch (error) {
        setError(error);
      }
    };
    fetchExpenses();
  }, [currentMonth, currentYear, selectedDate, summaryContainer]);

  useEffect(() => {
    animationsDispatch({
      type: "SLIDE_CALENDAR",
      payload: editingName && isInputFocused ? -200 : 0,
    });
  }, [editingName, isInputFocused]);

  const handleMonthChange = (month) => {
    dateDispatch({
      type: "SET_MONTH_YEAR",
      payload: { month: month.month, year: month.year },
    });
  };

  const toggleEditName = () => {
    if (editingName) {
      if (newName.trim() && newName.length <= 15) {
        nameDispatch({ type: "SAVE_NAME" });
      } else {
        nameDispatch({ type: "CANCEL_EDIT" });
      }
    } else {
      nameDispatch({ type: "EDIT_NAME" });
    }
  };

  const handleDayPress = (day) => {
    setSummaryContainer(false);
    dateDispatch({ type: "SET_SELECTED_DATE", payload: day.dateString });
    animationsDispatch({ type: "SHOW_EVENT" });
  };

  const cancelEditing = () => {
    nameDispatch({ type: "CANCEL_EDIT" });
    Keyboard.dismiss();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      {error && <ErrorPopup/>}
      <Animated.View
        style={[
          styles.calendarContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: calendarAnim }],
          },
        ]}
      >
        <Calendar
          current={`${currentYear}-${String(currentMonth).padStart(2, "0")}`}
          onDayPress={handleDayPress}
          markedDates={getMarkedDates()}
          onMonthChange={handleMonthChange}
          onPressArrowRight={subtractMonth => subtractMonth()}  
          onPressArrowLeft={addMonth => addMonth()}
          enableSwipeMonths={false} 
          style={{
            direction: 'rtl'
          }}
          renderArrow={(direction) => (
            <Text style={{ color: "#FFFFFF", fontSize: 20 }}>
              {direction === "left" ? "→" : "←"}
            </Text>
          )}
          theme={{
            flexDirection: 'row-reverse',
            backgroundColor: "#1E1E2C",
            calendarBackground: "#1E1E2C",
            textSectionTitleColor: "#B6C1CD",
            selectedDayBackgroundColor: "#4CAF50",
            selectedDayTextColor: "#FFFFFF",
            todayTextColor: "#FF6347",
            dayTextColor: "#DCE3F0",
            textDisabledColor: "#2D4150",
            dotColor: "#4CAF50",
            selectedDotColor: "#FFFFFF",
            arrowColor: "#FFFFFF",
            monthTextColor: "#FFFFFF",
            'stylesheet.day.basic': {
            base: {
              width: 32,
              height: 32,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row-reverse", 
            },
          }
          }}
        />
      </Animated.View>
      {summaryContainer && (
      <View style={[styles.summaryContainer]}>
        <TouchableOpacity
        onPress={() =>
          navigation.navigate("MonthlyExpensesScreen", {
            month: currentMonth,
            year: currentYear,
          })
        }>
       <Summary expenses={expenses} />
        </TouchableOpacity>
        <Text style={styles.userNameText}>שלום, {currentName}!</Text>
        <TouchableOpacity
              style={[
                styles.editButton,
                editingName && newName.length > 15 && styles.disabledButton, 
              ]}
              onPress={editingName && newName.length > 15 ? null : toggleEditName} 
              disabled={editingName && newName.length > 15} 
            >
              <Text style={styles.editButtonText}>
                {editingName
                  ? newName.length > 15
                    ? "גדול מדי" 
                    : "שמור" 
                  : "לשנות שם"} 
              </Text>
        </TouchableOpacity>
        {editingName && (
          <View style={styles.editNameContainer}>
            <TextInput
              style={styles.nameInput}
              placeholder="הכנס שם חדש"
              value={newName}
              onChangeText={(text) =>
                nameDispatch({ type: "SET_NEW_NAME", payload: text })
              }
              onFocus={() => nameDispatch({ type: "SET_INPUT_FOCUS", payload: true })}
              onBlur={() => nameDispatch({ type: "SET_INPUT_FOCUS", payload: false })}
            />
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={cancelEditing}
            >
              <Text style={styles.cancelButtonText}>בטל</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
  )}
      <MenuPopup
        selectedDate={selectedDate}
        setSummaryContainer={setSummaryContainer}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E2C",
  },
  calendarContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },
  fixedHeightCalendar: {
    height: 300,
  },
  summaryContainer: {
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  summaryText: {
    color: "#FFD700",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  userNameText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 15,
  },
  editButton: {
    backgroundColor: "#006400",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  editNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  nameInput: {
    flex: 1,
    backgroundColor: "#555",
    color: "#FFF",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginRight: 10,
    textAlign: "right",
  },
  cancelButton: {
    backgroundColor: "#FF6347",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  arrowContainer: {
    alignItems: "center",
    marginBottom: 10, 
  },
  arrow: {
    width: 190,
    height: 2,
    backgroundColor: "#DAA520",
    borderRadius: 2.5,
  },
  disabledButton: {
    backgroundColor: "#808080", 
    opacity: 0.5,
  },
  
});

export default CalendarScreen;





