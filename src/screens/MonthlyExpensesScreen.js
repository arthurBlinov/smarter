import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { fetchMonthlyExpenses } from '../db/dbFunctions';
import { useNavigation } from '@react-navigation/native';
import usePaginationLoading from '../hooks/usePaginationLoading';
import ErrorPopup from '../components/ErrorPopup';

const ITEMS_PER_PAGE = 10;

const MonthlyExpensesScreen = ({ route }) => {
  const { month, year } = route.params;
  const { data: expenses, loadMore, loading, hasMore, error } = usePaginationLoading(
    (page, limit) => fetchMonthlyExpenses(month, year, page, limit),
    1,
    ITEMS_PER_PAGE,
    [month, year]
  );
  const [activeItem, setActiveItem] = useState(null);
  const navigation = useNavigation();


const renderExpense = ({ item, index }) => {
  const itemOpacity = activeItem === index ? 1 : 0.8; 

  return (
    <TouchableOpacity
      onPress={() => setActiveItem(index)} 
      activeOpacity={1} 
    >
      <Animated.View
        style={[
          styles.expenseItem,
          { opacity: itemOpacity }, 
        ]}
      >
        <View style={styles.expenseContent}>
          <Text style={styles.expenseText}>כמות: {item.expense}</Text>
          <Text style={styles.expenseText}>הערה: {item.note}</Text>
          <Text style={styles.expenseText}>תאריך: {new Date(item.date).toLocaleDateString('he-IL')}</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

  

  return (
    <View style={styles.container}>
      {error && <ErrorPopup/>}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.navigate('CalendarScreen')}
      >
        <Text style={styles.closeButtonText}>X</Text>
      </TouchableOpacity>
      <Text style={styles.headerText}>הוצאות חודש</Text>
      <FlatList
        data={expenses}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderExpense}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[{overflow: 'hidden'}, styles.listContainer]}
        onEndReached={loadMore}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator size="small" color="#FFD700" />
          ) : !hasMore && null
        }
        style={{direction:"rtl"}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2C',
    padding: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    borderRadius: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerText: {
    color: '#FFD700',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  listContainer: {
    paddingBottom: 20,
  },
  expenseItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  expenseContent: {
    alignItems: 'flex-start',
  },
  expenseText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 5,
  },
  loadingText: {
    textAlign: 'center',
    color: '#FFFFFF',
    marginVertical: 10,
  },
});

export default MonthlyExpensesScreen;

