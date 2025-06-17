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
import { Flame, SquareCheck as CheckSquare, Plus } from 'lucide-react-native';
import { homeStyles } from '../../styles/home';
import RefreshGestureContext from '../../context/RefreshContext';

export default function HomeScreen() {
  const { colors } = useTheme();
  const {
    activeProfile,
    todos,
    transactions,
    reminders,
    dailyStreak,
    addReminder,
  } = useData();

  const styles = homeStyles(colors);
  const [reminderModalVisible, setReminderModalVisible] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: '',
    content: '',
    time: new Date(),
    repeat: 'none' as 'none' | 'daily' | 'weekly' | 'monthly',
    isActive: true,
  });

  const completedTodos = todos.filter((todo) => todo.completed).length;
  const totalTodos = todos.length;

  const totalIncome = transactions
    .filter((t) => t.type === 'income' && t.profileId === activeProfile?.id)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense' && t.profileId === activeProfile?.id)
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

  return (
    <SafeAreaView style={styles.container}>
      <RefreshGestureContext>
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Hello, {activeProfile?.name || 'User'}! {activeProfile?.avatar}
          </Text>
          <Text style={styles.subtitle}>Let's make today productive</Text>
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
              <Text style={styles.cardValue}>
                {completedTodos}/{totalTodos}
              </Text>
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
              .filter((r) => r.profileId === activeProfile?.id && r.isActive)
              .slice(0, 3)
              .map((reminder) => (
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
      </RefreshGestureContext>
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
              onChangeText={(text) =>
                setNewReminder({ ...newReminder, title: text })
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Content (optional)"
              placeholderTextColor={colors.textSecondary}
              value={newReminder.content}
              onChangeText={(text) =>
                setNewReminder({ ...newReminder, content: text })
              }
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
