import React, { useState } from 'react';
import {
  View,
  Text,
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
import { moneyStyles } from '../../styles/money';
import CustomAlert from '../../components/AlertModel';

export default function MoneyScreen() {
  const { colors } = useTheme();
  const styles = moneyStyles(colors);
  const { activeProfile, transactions, addTransaction, deleteTransaction } =
    useData();

  const [modalVisible, setModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');

  const [deleteAlertVisible, setDeleteAlertVisible] = useState(false);
  const [toDelete, setToDelete] = useState<string | null>(null);

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
    setToDelete(id);
    setDeleteAlertVisible(true);
  };

  const confirmDelete = () => {
    if (toDelete) {
      deleteTransaction(toDelete);
      setToDelete(null);
    }
    setDeleteAlertVisible(false);
  };

  const cancelDelete = () => {
    setToDelete(null);
    setDeleteAlertVisible(false);
  };

  // const handleDeleteTransaction = (id: string) => {
  //   Alert.alert(
  //     'Delete Transaction',
  //     'Are you sure you want to delete this transaction?',
  //     [
  //       { text: 'Cancel', style: 'cancel' },
  //       {
  //         text: 'Delete',
  //         style: 'destructive',
  //         onPress: () => deleteTransaction(id),
  //       },
  //     ]
  //   );
  // };

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
      <CustomAlert
        visible={deleteAlertVisible}
        title="Delete Entry"
        message="Are you sure you want to delete this entry?"
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
        cancelText="No"
        confirmText="Yes"
      />
    </SafeAreaView>
  );
}
