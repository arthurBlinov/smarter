import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Animated,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { validateFields } from "../utils/validateFields";
import { fetchExpenses, deleteExpense, updateExpense } from "../db/dbFunctions";
import Loading from "../components/Loading";
import usePaginationLoading from "../hooks/usePaginationLoading";
import Summary from "./Summary";
import ErrorPopup from "./ErrorPopup";
import { useAnimationsReducer } from "../hooks/useAnimationReducer";

const ITEMS_PER_PAGE = 10;

const ShowExpenses = ({ selectedDate, goBack }) => {
  const [expenses, setExpenses] = useState([]);
  const { state: animationsState, dispatch: animationsDispatch } = useAnimationsReducer();
  const { fadeAnim } = animationsState;
  const [editingExpense, setEditingExpense] = useState(null);
  const [updatedExpense, setUpdatedExpense] = useState({ expense: "", note: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [deletingExpense, setDeletingExpense] = useState(null);
  const { data, loadMore, loading, hasMore } = usePaginationLoading(
    (page, limit) => fetchExpenses(selectedDate, page, limit),
    1,
    ITEMS_PER_PAGE,
    [selectedDate],
  );
  const [error, setError] = useState(null);

  useEffect(() => {
    setExpenses(data);
  }, [data]);
  
  useEffect(() => {
    animationsDispatch({ type: "FADE_IN" });
  }, []);

  const handleEditToggle = async (item) => {
    if (editingExpense?.id === item.id) {
      const validationErrors = validateFields(updatedExpense.expense, updatedExpense.note);
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length > 0) return;

      setIsLoading(true);
      try {
        await updateExpense(item.id, updatedExpense.expense, updatedExpense.note);
        const updatedExpenses = expenses.map((exp) =>
          exp.id === item.id ? { ...exp, ...updatedExpense } : exp
        );
        setExpenses(updatedExpenses);
        setEditingExpense(null);
        setUpdatedExpense({ expense: "", note: "" });
        setErrors({});
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setEditingExpense(item);
      setUpdatedExpense({ expense: String(item.expense), note: item.note });
      setErrors({});
    }
  };

  const cancelEditing = () => {
    setEditingExpense(null);
    setUpdatedExpense({ expense: "", note: "" });
    setErrors({});
  };

  const confirmDelete = async (itemId) => {
    setIsLoading(true);
    try {
      await deleteExpense(itemId);
      setExpenses((prev) => prev.filter((exp) => exp.id !== itemId));
    } catch (error) {
      setError(error);
    } finally {
      setDeletingExpense(null);
      setIsLoading(false);
    }
  };
  

  const renderExpense = ({ item }) => (
    <View style={styles.expenseItem}>
      {deletingExpense === item.id ? (
        <View style={styles.deleteContainer}>
          <Text style={styles.deleteTitle}>האם אתה בטוח שברצונך למחוק?</Text>
          <View style={styles.deleteActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => setDeletingExpense(null)}
            >
              <Text style={styles.actionButtonText}>בטל</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => confirmDelete(item.id)}
            >
              <Text style={styles.actionButtonText}>מחק</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.row}>
          {editingExpense?.id === item.id ? (
            <View style={styles.editContainer}>
              <TextInput
                style={[styles.input, errors.amount ? styles.inputError : null]}
                value={updatedExpense.expense}
                onChangeText={(text) => setUpdatedExpense((prev) => ({ ...prev, expense: text }))}
                placeholderTextColor="#AAAAAA"
                numberOfLines={1} 
                multiline={false} 
                scrollEnabled={true}
              />
              {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
              <TextInput
                style={[styles.input, errors.note ? styles.inputError : null]}
                value={updatedExpense.note}
                onChangeText={(text) => setUpdatedExpense((prev) => ({ ...prev, note: text }))}
                placeholderTextColor="#AAAAAA"
                numberOfLines={1} 
                multiline={false} 
                scrollEnabled={true}
              />
              {errors.note && <Text style={styles.errorText}>{errors.note}</Text>}
            </View>
          ) : (
            <View style={styles.expensesContent}>
              <Text style={[styles.valueAmount, { flex: 2 }]}>כמות: {item.expense}</Text>
              <Text style={[styles.valueNote, { flex: 2 }]}>הערה: {item.note}</Text>
            </View>
          )}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.updateButton]}
              onPress={() => handleEditToggle(item)}
            >
              <Text style={styles.actionButtonText}>
                {editingExpense?.id === item.id ? "שמור" : "עדכן"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionButton,
                editingExpense?.id === item.id ? styles.cancelButton : styles.deleteButton,
              ]}
              onPress={
                editingExpense?.id === item.id ? cancelEditing : () => setDeletingExpense(item.id)
              }
            >
              <Text style={styles.actionButtonText}>
                {editingExpense?.id === item.id ? "בטל" : "מחק"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <>
      {isLoading && <Loading />}
      {error && <ErrorPopup/>}
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <Text style={styles.title}>הוצאות עבור {selectedDate}</Text>
        {expenses?.length > 0 ? (
          
            <FlatList
              data={expenses}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderExpense}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
              onEndReached={loadMore}
              onEndReachedThreshold={0.2}
              ListFooterComponent={
                loading ? (
                  <ActivityIndicator size="small" color="#FFD700" />
                ) : !hasMore && null
              }
              removeClippedSubviews={false}
              style={{direction: 'rtl'}}
            />

      
        ) : (
          <Text style={styles.noExpensesText}>אין הוצאות עבור תאריך זה</Text>
        )}
        {!hasMore && expenses.length > 0 &&  <Summary expenses={expenses}/>}
        <TouchableOpacity style={styles.goBackButton} onPress={goBack}>
          <Text style={styles.goBackButtonText}>חזור</Text>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
};

export default ShowExpenses;

const styles = StyleSheet.create({
  inputError: {
    borderWidth: 1,
    borderColor: "#FF6347", 
  },
  errorText: {
    color: "#FF6347",
    fontSize: 14,
    textAlign: "right",
    marginBottom: 5,
  },
  container: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#2A2A40",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFD700",
    textAlign: "center",
    marginBottom: 20,
    writingDirection: "rtl",
  },
  listContainer: {
    paddingVertical: 10,
  },
  expenseItem: {
    backgroundColor: "#3C3C4D",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  expensesContent: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '75%',

  },
  valueAmount: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  valueNote: {
      fontSize: 16,
      color: '#FFFFFF',
      marginTop: -40,
      
  },
  editContainer: {
    flexDirection: "column",
    flex: 1,
  },
  noExpensesText: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 19
  },
  actions: {
    padding: 5,
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    // marginHorizontal: 5,
    marginBottom: 10,
  },
  updateButton: {
    backgroundColor: "#4CAF50",
  },
  deleteButton: {
    backgroundColor: "#FF6347",
  },
  cancelButton: {
    backgroundColor: "#808080",
  },
  deleteContainer: {
    alignItems: "center",
  },
  deleteTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 10,
  },
  deleteActions: {
    flexDirection: "row",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#555",
    color: "#FFF",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    marginVertical: 5,
    writingDirection: "rtl",
    textAlign: "right",
    overflow: "hidden", 
},
fullWidthInput: {
  width: "100%",
},
totalContainer: {
  marginTop: 20,
  paddingVertical: 10,
  paddingHorizontal: 15,
  borderRadius: 10,
  alignSelf: "center",
  width: "80%",
  alignItems: "center",
},
totalText: {
  color: "#FFFFFF",
  fontSize: 18,
  fontWeight: "bold",
  writingDirection: "rtl",
},
goBackButton: {
  backgroundColor: "#FF6347",
  paddingVertical: 15,
  paddingHorizontal: 30,
  borderRadius: 12,
  alignItems: "center",
  alignSelf: "center",
  marginTop: 20,
  width: "80%",
},
goBackButtonText: {
  color: "#FFFFFF",
  fontSize: 16,
  fontWeight: "bold",
  writingDirection: "rtl",
},
});







