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
import { Flame, DollarSign, SquareCheck as CheckSquare, Plus, Bell, Calendar, Clock, Repeat } from 'lucide-react-native';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { 
    activeProfile, 
    todos, 
    transactions, 
    reminders, 
    dailyStreak, 
    addReminder,
    updateDailyStreak 
  } = useData();
  
  const [reminderModalVisible, setReminderModalVisible] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: '',
    content: '',
    time: new Date(),
    repeat: 'none' as 'none' | 'daily' | 'weekly' | 'monthly',
    isActive: true,
  });

  const completedTodos = todos.filter(todo => todo.completed).length;
  const totalTodos = todos.length;
  
  const totalIncome = transactions
    .filter(t => t.type === 'income' && t.profileId === activeProfile?.id)
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpense = transactions
    .filter(t => t.type === 'expense' && t.profileId === activeProfile?.id)
    .reduce((sum, t) => sum + t.amount, 0);
    
  const balance = totalIncome - totalExpense;

  const handleAddReminder = () => {
    if (!newReminder.title.trim()) {
      Alert.alert('Error', 'Please enter a reminder title');
      return;
    }
    
    addReminder({
      ...newReminder,
      profileId: activeProfile?.id || '1',
    });
    
    setNewReminder({
      title: '',
      content: '',
      time: new Date(),
      repeat: 'none',
      isActive: true,
    });
    setReminderModalVisible(false);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 20,
      paddingTop: 60,
    },
    greeting: {
      fontSize: 28,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    sectionTitle: {
      fontSize: 20,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginBottom: 16,
    },
    cardContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 24,
    },
    card: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      marginHorizontal: 4,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardIcon: {
      marginBottom: 12,
    },
    cardValue: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 4,
    },
    cardLabel: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    balanceCard: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
      marginBottom: 24,
    },
    balanceValue: {
      fontSize: 32,
      fontFamily: 'Inter-Bold',
      color: '#FFFFFF',
      marginBottom: 4,
    },
    balanceLabel: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: '#FFFFFF',
      opacity: 0.9,
    },
    reminderSection: {
      marginBottom: 24,
    },
    addReminderButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      borderWidth: 2,
      borderColor: colors.border,
      borderStyle: 'dashed',
    },
    addReminderText: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      marginLeft: 12,
    },
    reminderItem: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    reminderTitle: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginBottom: 4,
    },
    reminderContent: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      marginBottom: 8,
    },
    reminderTime: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.primary,
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
      backgroundColor: colors.textSecondary,
    },
    buttonText: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Hello, {activeProfile?.name || 'User'}! {activeProfile?.avatar}
        </Text>
        <Text style={styles.subtitle}>
          Let's make today productive
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <View style={styles.cardIcon}>
              <Flame size={24} color={colors.warning} />
            </View>
            <Text style={styles.cardValue}>{dailyStreak}</Text>
            <Text style={styles.cardLabel}>Day Streak</Text>
          </View>
          
          <View style={styles.card}>
            <View style={styles.cardIcon}>
              <CheckSquare size={24} color={colors.success} />
            </View>
            <Text style={styles.cardValue}>{completedTodos}/{totalTodos}</Text>
            <Text style={styles.cardLabel}>Tasks Done</Text>
          </View>
        </View>

        <View style={[styles.card, styles.balanceCard]}>
          <Text style={styles.balanceValue}>₹{balance.toFixed(2)}</Text>
          <Text style={styles.balanceLabel}>Available Balance</Text>
        </View>

        <View style={styles.reminderSection}>
          <Text style={styles.sectionTitle}>Reminders</Text>
          
          <TouchableOpacity 
            style={styles.addReminderButton}
            onPress={() => setReminderModalVisible(true)}
          >
            <Plus size={20} color={colors.textSecondary} />
            <Text style={styles.addReminderText}>Add new reminder</Text>
          </TouchableOpacity>

          {reminders
            .filter(r => r.profileId === activeProfile?.id && r.isActive)
            .slice(0, 3)
            .map(reminder => (
              <View key={reminder.id} style={styles.reminderItem}>
                <Text style={styles.reminderTitle}>{reminder.title}</Text>
                <Text style={styles.reminderContent}>{reminder.content}</Text>
                <Text style={styles.reminderTime}>
                  {reminder.time.toLocaleTimeString()} • {reminder.repeat}
                </Text>
              </View>
            ))}
        </View>
      </ScrollView>

      <Modal
        visible={reminderModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setReminderModalVisible(false)}
      >
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Reminder</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Reminder title"
              placeholderTextColor={colors.textSecondary}
              value={newReminder.title}
              onChangeText={(text) => setNewReminder({...newReminder, title: text})}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Content (optional)"
              placeholderTextColor={colors.textSecondary}
              value={newReminder.content}
              onChangeText={(text) => setNewReminder({...newReminder, content: text})}
              multiline
              numberOfLines={3}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.buttonSecondary]}
                onPress={() => setReminderModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.button}
                onPress={handleAddReminder}
              >
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}