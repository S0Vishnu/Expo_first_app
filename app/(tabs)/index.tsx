import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import {
  Flame,
  SquareCheck as CheckSquare,
  Plus,
  Clock,
  Trash2,
  Edit2,
  Bell,
  Calendar,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { homeStyles } from '../../styles/home';
import RefreshGestureContext from '../../context/RefreshContext';
import CustomAlert from '../../components/AlertModel';

export default function HomeScreen() {
  const { colors } = useTheme();
  const {
    activeProfile,
    todos,
    transactions,
    reminders,
    dailyStreak,
    addReminder,
    updateReminder,
    deleteReminder,
  } = useData();

  const styles = homeStyles(colors);
  const [reminderModalVisible, setReminderModalVisible] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showRepeatOptions, setShowRepeatOptions] = useState(false);
  const [editingReminder, setEditingReminder] = useState<null | any>(null);

  const [deleteAlertVisible, setDeleteAlertVisible] = useState(false);
  const [reminderToDelete, setReminderToDelete] = useState<string | null>(null);

  const [newReminder, setNewReminder] = useState({
    title: '',
    content: '',
    time: new Date(),
    repeat: 'none' as 'none' | 'daily' | 'weekly' | 'monthly',
    isActive: true,
  });

  // Days of week for repeat options
  const daysOfWeek = [
    { id: 0, name: 'Sun' },
    { id: 1, name: 'Mon' },
    { id: 2, name: 'Tue' },
    { id: 3, name: 'Wed' },
    { id: 4, name: 'Thu' },
    { id: 5, name: 'Fri' },
    { id: 6, name: 'Sat' },
  ];

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

    if (editingReminder) {
      // Update existing reminder
      updateReminder(editingReminder.id, {
        ...newReminder,
        profileId: activeProfile?.id || '1',
      });
    } else {
      // Add new reminder
      addReminder({
        ...newReminder,
        profileId: activeProfile?.id || '1',
      });
    }

    resetReminderForm();
  };

  const handleEditReminder = (reminder: any) => {
    setEditingReminder(reminder);
    setNewReminder({
      title: reminder.title,
      content: reminder.content,
      time: new Date(reminder.time),
      repeat: reminder.repeat,
      isActive: reminder.isActive,
    });
    setReminderModalVisible(true);
  };

  const handleDeleteReminder = (id: string) => {
    setReminderToDelete(id);
    setDeleteAlertVisible(true);
  };

  const confirmDelete = () => {
    if (reminderToDelete) {
      deleteReminder(reminderToDelete);
    }
    setDeleteAlertVisible(false);
    setReminderToDelete(null);
  };

  const cancelDelete = () => {
    setDeleteAlertVisible(false);
    setReminderToDelete(null);
  };

  const resetReminderForm = () => {
    setNewReminder({
      title: '',
      content: '',
      time: new Date(),
      repeat: 'none',
      isActive: true,
    });
    setEditingReminder(null);
    setReminderModalVisible(false);
    setShowTimePicker(false);
    setShowRepeatOptions(false);
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setNewReminder({ ...newReminder, time: selectedTime });
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatRepeatText = () => {
    switch (newReminder.repeat) {
      case 'none':
        return 'Does not repeat';
      case 'daily':
        return 'Daily';
      case 'weekly':
        return 'Weekly';
      case 'monthly':
        return 'Monthly';
      default:
        return '';
    }
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
                  <View style={styles.reminderHeader}>
                    <Text style={styles.reminderTitle}>{reminder.title}</Text>
                    <View style={styles.reminderActions}>
                      <TouchableOpacity
                        onPress={() => handleEditReminder(reminder)}
                        style={styles.reminderActionButton}
                      >
                        <Edit2 size={16} color={colors.textSecondary} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDeleteReminder(reminder.id)}
                        style={styles.reminderActionButton}
                      >
                        <Trash2 size={16} color={colors.error} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  {reminder.content && (
                    <Text style={styles.reminderContent}>
                      {reminder.content}
                    </Text>
                  )}
                  <View style={styles.reminderMeta}>
                    <View style={styles.reminderMetaItem}>
                      <Clock size={14} color={colors.textSecondary} />
                      <Text style={styles.reminderTime}>
                        {formatTime(new Date(reminder.time))}
                      </Text>
                    </View>
                    <View style={styles.reminderMetaItem}>
                      <Bell size={14} color={colors.textSecondary} />
                      <Text style={styles.reminderRepeat}>
                        {formatRepeatText()}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
          </View>
        </ScrollView>
      </RefreshGestureContext>

      {/* Reminder Modal */}
      <Modal
        visible={reminderModalVisible}
        transparent
        animationType="fade"
        onRequestClose={resetReminderForm}
      >
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingReminder ? 'Edit Reminder' : 'Add Reminder'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Reminder title*"
              placeholderTextColor={colors.textSecondary}
              value={newReminder.title}
              onChangeText={(text) =>
                setNewReminder({ ...newReminder, title: text })
              }
            />

            <TextInput
              style={[styles.input]}
              placeholder="Content (optional)"
              placeholderTextColor={colors.textSecondary}
              value={newReminder.content}
              onChangeText={(text) =>
                setNewReminder({ ...newReminder, content: text })
              }
              multiline
              numberOfLines={3}
            />

            {/* Time Selection */}
            <TouchableOpacity
              style={styles.timeInput}
              onPress={() => setShowTimePicker(true)}
            >
              <Clock size={20} color={colors.textSecondary} />
              <Text style={styles.timeInputText}>
                {formatTime(newReminder.time)}
              </Text>
            </TouchableOpacity>

            {showTimePicker && (
              <DateTimePicker
                value={newReminder.time}
                mode="time"
                display="spinner"
                onChange={handleTimeChange}
              />
            )}

            {/* Repeat Options */}
            <TouchableOpacity
              style={styles.repeatInput}
              onPress={() => setShowRepeatOptions(!showRepeatOptions)}
            >
              <Calendar size={20} color={colors.textSecondary} />
              <Text style={styles.repeatInputText}>{formatRepeatText()}</Text>
              {showRepeatOptions ? (
                <ChevronUp size={20} color={colors.textSecondary} />
              ) : (
                <ChevronDown size={20} color={colors.textSecondary} />
              )}
            </TouchableOpacity>

            {showRepeatOptions && (
              <View style={styles.repeatOptions}>
                <TouchableOpacity
                  style={[
                    styles.repeatOption,
                    newReminder.repeat === 'none' && styles.repeatOptionActive,
                  ]}
                  onPress={() =>
                    setNewReminder({ ...newReminder, repeat: 'none' })
                  }
                >
                  <Text
                    style={[
                      styles.repeatOptionText,
                      newReminder.repeat === 'none' &&
                        styles.repeatOptionTextActive,
                    ]}
                  >
                    Does not repeat
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.repeatOption,
                    newReminder.repeat === 'daily' && styles.repeatOptionActive,
                  ]}
                  onPress={() =>
                    setNewReminder({ ...newReminder, repeat: 'daily' })
                  }
                >
                  <Text
                    style={[
                      styles.repeatOptionText,
                      newReminder.repeat === 'daily' &&
                        styles.repeatOptionTextActive,
                    ]}
                  >
                    Daily
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.repeatOption,
                    newReminder.repeat === 'weekly' &&
                      styles.repeatOptionActive,
                  ]}
                  onPress={() =>
                    setNewReminder({ ...newReminder, repeat: 'weekly' })
                  }
                >
                  <Text
                    style={[
                      styles.repeatOptionText,
                      newReminder.repeat === 'weekly' &&
                        styles.repeatOptionTextActive,
                    ]}
                  >
                    Weekly
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.repeatOption,
                    newReminder.repeat === 'monthly' &&
                      styles.repeatOptionActive,
                  ]}
                  onPress={() =>
                    setNewReminder({ ...newReminder, repeat: 'monthly' })
                  }
                >
                  <Text
                    style={[
                      styles.repeatOptionText,
                      newReminder.repeat === 'monthly' &&
                        styles.repeatOptionTextActive,
                    ]}
                  >
                    Monthly
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={resetReminderForm}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={handleAddReminder}
                disabled={!newReminder.title.trim()}
              >
                <Text style={styles.buttonText}>
                  {editingReminder ? 'Update' : 'Add'} Reminder
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <CustomAlert
        visible={deleteAlertVisible}
        title="Delete Reminder"
        message="Are you sure you want to delete this reminder?"
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
        cancelText="No"
        confirmText="Yes"
      />
    </SafeAreaView>
  );
}

// Helper function to format repeat text for display
function formatRepeatText(repeat: string) {
  switch (repeat) {
    case 'none':
      return 'Does not repeat';
    case 'daily':
      return 'Daily';
    case 'weekly':
      return 'Weekly';
    case 'monthly':
      return 'Monthly';
    default:
      return '';
  }
}
