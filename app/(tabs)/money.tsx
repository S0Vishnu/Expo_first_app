import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Filter,
  Trash2,
  IndianRupee,
} from 'lucide-react-native';

export default function MoneyScreen() {
  const { colors } = useTheme();
  const { activeProfile, transactions, addTransaction, deleteTransaction } =
    useData();

  const [modalVisible, setModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');
  const [newTransaction, setNewTransaction] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    category: 'food',
    description: '',
  });

  const incomeCategories = [
    'salary',
    'freelance',
    'investment',
    'gift',
    'other',
  ];
  const expenseCategories = [
    'food',
    'transport',
    'savings',
    'utilities',
    'entertainment',
    'health',
    'shopping',
    'bills',
    'other',
  ];
  const filters = ['all', 'income', 'expense', 'today', 'week', 'month'];

  const userTransactions = transactions.filter(
    (t) => t.profileId === activeProfile?.id
  );

  const filteredTransactions = userTransactions.filter((transaction) => {
    let matchesFilter = true;
    let matchesCategory = true;

    // Filter by type
    if (activeFilter === 'income')
      matchesFilter = transaction.type === 'income';
    if (activeFilter === 'expense')
      matchesFilter = transaction.type === 'expense';

    // Filter by date
    if (activeFilter === 'today') {
      const today = new Date();
      const transactionDate = new Date(transaction.date);
      matchesFilter =
        transactionDate.getDate() === today.getDate() &&
        transactionDate.getMonth() === today.getMonth() &&
        transactionDate.getFullYear() === today.getFullYear();
    }

    if (activeFilter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesFilter = new Date(transaction.date) >= weekAgo;
    }

    if (activeFilter === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      matchesFilter = new Date(transaction.date) >= monthAgo;
    }

    // Filter by category
    if (activeCategoryFilter !== 'all') {
      matchesCategory = transaction.category === activeCategoryFilter;
    }

    return matchesFilter && matchesCategory;
  });

  const totalIncome = userTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = userTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const handleAddTransaction = () => {
    if (!newTransaction.amount || isNaN(parseFloat(newTransaction.amount))) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (!newTransaction.description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }

    addTransaction({
      ...newTransaction,
      amount: parseFloat(newTransaction.amount),
      date: new Date(),
      profileId: activeProfile?.id || '1',
    });

    setNewTransaction({
      type: 'expense',
      amount: '',
      category: 'food',
      description: '',
    });
    setModalVisible(false);
  };

  const handleDeleteTransaction = (id: string) => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteTransaction(id),
        },
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      paddingTop: 60,
    },
    title: {
      fontSize: 28,
      fontFamily: 'Inter-Bold',
      color: colors.text,
    },
    headerButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    headerButton: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    balanceContainer: {
      backgroundColor: colors.primary,
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
    },
    balanceLabel: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: '#FFFFFF',
      opacity: 0.9,
      marginBottom: 8,
    },
    balanceAmount: {
      fontSize: 32,
      fontFamily: 'Inter-Bold',
      color: '#FFFFFF',
      marginBottom: 16,
    },
    balanceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    balanceItem: {
      flex: 1,
      alignItems: 'center',
    },
    balanceItemLabel: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: '#FFFFFF',
      opacity: 0.8,
      marginBottom: 4,
    },
    balanceItemAmount: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: '#FFFFFF',
    },
    filterContainer: {
      flexDirection: 'row',
      marginBottom: 20,
    },
    filterButton: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginRight: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    filterButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    filterButtonText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    filterButtonTextActive: {
      color: '#FFFFFF',
    },
    transactionItem: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    transactionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    transactionLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    transactionIcon: {
      marginRight: 12,
    },
    transactionTitle: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      flex: 1,
    },
    transactionAmount: {
      fontSize: 16,
      fontFamily: 'Inter-Bold',
      marginRight: 12,
    },
    incomeAmount: {
      color: colors.success,
    },
    expenseAmount: {
      color: colors.error,
    },
    deleteButton: {
      padding: 8,
    },
    transactionFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginLeft: 36,
    },
    categoryTag: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    categoryText: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: '#FFFFFF',
    },
    transactionDate: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    fab: {
      position: 'absolute',
      bottom: 120,
      right: 20,
      backgroundColor: colors.primary,
      borderRadius: 28,
      width: 56,
      height: 56,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    modal: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 24,
      width: '90%',
      maxWidth: 400,
    },
    modalTitle: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 20,
    },
    typeSelector: {
      flexDirection: 'row',
      marginBottom: 16,
    },
    typeButton: {
      flex: 1,
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 12,
      alignItems: 'center',
      marginHorizontal: 4,
      borderWidth: 1,
      borderColor: colors.border,
    },
    typeButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    typeButtonText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.text,
    },
    typeButtonTextActive: {
      color: '#FFFFFF',
    },
    input: {
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 16,
    },
    pickerContainer: {
      marginBottom: 16,
    },
    pickerLabel: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.text,
      marginBottom: 8,
    },
    pickerRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    pickerButton: {
      backgroundColor: colors.background,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    pickerButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    pickerButtonText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.text,
    },
    pickerButtonTextActive: {
      color: '#FFFFFF',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    button: {
      flex: 1,
      backgroundColor: colors.primary,
      borderRadius: 8,
      padding: 12,
      alignItems: 'center',
      marginHorizontal: 4,
    },
    buttonSecondary: {
      backgroundColor: colors.background,
    },
    buttonText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 60,
    },
    emptyStateText: {
      fontSize: 18,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 16,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Money</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setFilterModalVisible(true)}
          >
            <Filter size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>₹{balance.toFixed(2)}</Text>

          <View style={styles.balanceRow}>
            <View style={styles.balanceItem}>
              <Text style={styles.balanceItemLabel}>Income</Text>
              <Text style={styles.balanceItemAmount}>
                +₹{totalIncome.toFixed(2)}
              </Text>
            </View>
            <View style={styles.balanceItem}>
              <Text style={styles.balanceItemLabel}>Expenses</Text>
              <Text style={styles.balanceItemAmount}>
                -₹{totalExpense.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                activeFilter === filter && styles.filterButtonActive,
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  activeFilter === filter && styles.filterButtonTextActive,
                ]}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {filteredTransactions.length === 0 ? (
          <View style={styles.emptyState}>
            <IndianRupee size={48} color={colors.textSecondary} />
            <Text style={styles.emptyStateText}>
              No transactions found.{'\n'}Tap the + button to add one!
            </Text>
          </View>
        ) : (
          filteredTransactions
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .map((transaction) => (
              <View key={transaction.id} style={styles.transactionItem}>
                <View style={styles.transactionHeader}>
                  <View style={styles.transactionLeft}>
                    <View style={styles.transactionIcon}>
                      {transaction.type === 'income' ? (
                        <TrendingUp size={20} color={colors.success} />
                      ) : (
                        <TrendingDown size={20} color={colors.error} />
                      )}
                    </View>
                    <Text style={styles.transactionTitle}>
                      {transaction.description}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.transactionAmount,
                      transaction.type === 'income'
                        ? styles.incomeAmount
                        : styles.expenseAmount,
                    ]}
                  >
                    {transaction.type === 'income' ? '+' : '-'}₹
                    {transaction.amount.toFixed(2)}
                  </Text>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteTransaction(transaction.id)}
                  >
                    <Trash2 size={16} color={colors.error} />
                  </TouchableOpacity>
                </View>

                <View style={styles.transactionFooter}>
                  <View style={styles.categoryTag}>
                    <Text style={styles.categoryText}>
                      {transaction.category}
                    </Text>
                  </View>
                  <Text style={styles.transactionDate}>
                    {new Date(transaction.date).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            ))
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Transaction</Text>

            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  newTransaction.type === 'income' && styles.typeButtonActive,
                ]}
                onPress={() =>
                  setNewTransaction({
                    ...newTransaction,
                    type: 'income',
                    category: 'salary',
                  })
                }
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    newTransaction.type === 'income' &&
                      styles.typeButtonTextActive,
                  ]}
                >
                  Income
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  newTransaction.type === 'expense' && styles.typeButtonActive,
                ]}
                onPress={() =>
                  setNewTransaction({
                    ...newTransaction,
                    type: 'expense',
                    category: 'food',
                  })
                }
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    newTransaction.type === 'expense' &&
                      styles.typeButtonTextActive,
                  ]}
                >
                  Expense
                </Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Amount"
              placeholderTextColor={colors.textSecondary}
              value={newTransaction.amount}
              onChangeText={(text) =>
                setNewTransaction({ ...newTransaction, amount: text })
              }
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Description"
              placeholderTextColor={colors.textSecondary}
              value={newTransaction.description}
              onChangeText={(text) =>
                setNewTransaction({ ...newTransaction, description: text })
              }
            />

            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Category</Text>
              <View style={styles.pickerRow}>
                {(newTransaction.type === 'income'
                  ? incomeCategories
                  : expenseCategories
                ).map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.pickerButton,
                      newTransaction.category === category &&
                        styles.pickerButtonActive,
                    ]}
                    onPress={() =>
                      setNewTransaction({ ...newTransaction, category })
                    }
                  >
                    <Text
                      style={[
                        styles.pickerButtonText,
                        newTransaction.category === category &&
                          styles.pickerButtonTextActive,
                      ]}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={handleAddTransaction}
              >
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={filterModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter Options</Text>

            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Category</Text>
              <View style={styles.pickerRow}>
                <TouchableOpacity
                  style={[
                    styles.pickerButton,
                    activeCategoryFilter === 'all' && styles.pickerButtonActive,
                  ]}
                  onPress={() => setActiveCategoryFilter('all')}
                >
                  <Text
                    style={[
                      styles.pickerButtonText,
                      activeCategoryFilter === 'all' &&
                        styles.pickerButtonTextActive,
                    ]}
                  >
                    All
                  </Text>
                </TouchableOpacity>
                {[...incomeCategories, ...expenseCategories].map(
                  (category, i) => (
                    <TouchableOpacity
                      key={`${category}-${i}`}
                      style={[
                        styles.pickerButton,
                        activeCategoryFilter === category &&
                          styles.pickerButtonActive,
                      ]}
                      onPress={() => setActiveCategoryFilter(category)}
                    >
                      <Text
                        style={[
                          styles.pickerButtonText,
                          activeCategoryFilter === category &&
                            styles.pickerButtonTextActive,
                        ]}
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={() => setFilterModalVisible(false)}
            >
              <Text style={styles.buttonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
