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
import { Plus, Filter, SquareCheck as CheckSquare, Square, CircleAlert as AlertCircle, Clock, Trash2 } from 'lucide-react-native';

export default function TodoScreen() {
  const { colors } = useTheme();
  const { todos, addTodo, updateTodo, deleteTodo } = useData();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    category: 'personal',
    priority: 'medium' as 'low' | 'medium' | 'high',
    completed: false,
  });

  const categories = ['personal', 'work', 'health', 'shopping', 'other'];
  const priorities = ['low', 'medium', 'high'];
  const filters = ['all', 'completed', 'pending', 'today'];

  const filteredTodos = todos.filter(todo => {
    let matchesFilter = true;
    let matchesCategory = true;

    // Filter by completion status
    if (activeFilter === 'completed') matchesFilter = todo.completed;
    if (activeFilter === 'pending') matchesFilter = !todo.completed;
    if (activeFilter === 'today') {
      const today = new Date();
      const todoDate = new Date(todo.createdAt);
      matchesFilter = todoDate.getDate() === today.getDate() &&
                     todoDate.getMonth() === today.getMonth() &&
                     todoDate.getFullYear() === today.getFullYear();
    }

    // Filter by category
    if (activeCategoryFilter !== 'all') {
      matchesCategory = todo.category === activeCategoryFilter;
    }

    return matchesFilter && matchesCategory;
  });

  const handleAddTodo = () => {
    if (!newTodo.title.trim()) {
      Alert.alert('Error', 'Please enter a todo title');
      return;
    }
    
    addTodo(newTodo);
    setNewTodo({
      title: '',
      description: '',
      category: 'personal',
      priority: 'medium',
      completed: false,
    });
    setModalVisible(false);
  };

  const handleToggleTodo = (id: string, completed: boolean) => {
    updateTodo(id, { completed: !completed });
  };

  const handleDeleteTodo = (id: string) => {
    Alert.alert(
      'Delete Todo',
      'Are you sure you want to delete this todo?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteTodo(id) },
      ]
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return colors.error;
      case 'medium': return colors.warning;
      case 'low': return colors.success;
      default: return colors.textSecondary;
    }
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
    todoItem: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    todoItemCompleted: {
      opacity: 0.6,
    },
    todoHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    todoLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    todoTitle: {
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginLeft: 12,
      flex: 1,
    },
    todoTitleCompleted: {
      textDecorationLine: 'line-through',
      color: colors.textSecondary,
    },
    todoDescription: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      marginLeft: 36,
      marginBottom: 8,
    },
    todoFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginLeft: 36,
    },
    todoMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
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
    priorityIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    deleteButton: {
      padding: 8,
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
    textArea: {
      height: 80,
      textAlignVertical: 'top',
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
      gap: 8,
    },
    pickerButton: {
      flex: 1,
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 12,
      alignItems: 'center',
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
        <Text style={styles.title}>Todo</Text>
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
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
        >
          {filters.map(filter => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                activeFilter === filter && styles.filterButtonActive
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[
                styles.filterButtonText,
                activeFilter === filter && styles.filterButtonTextActive
              ]}>
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {filteredTodos.length === 0 ? (
          <View style={styles.emptyState}>
            <CheckSquare size={48} color={colors.textSecondary} />
            <Text style={styles.emptyStateText}>
              No todos found.{'\n'}Tap the + button to add one!
            </Text>
          </View>
        ) : (
          filteredTodos.map(todo => (
            <View 
              key={todo.id} 
              style={[
                styles.todoItem,
                todo.completed && styles.todoItemCompleted
              ]}
            >
              <View style={styles.todoHeader}>
                <View style={styles.todoLeft}>
                  <TouchableOpacity 
                    onPress={() => handleToggleTodo(todo.id, todo.completed)}
                  >
                    {todo.completed ? (
                      <CheckSquare size={20} color={colors.success} />
                    ) : (
                      <Square size={20} color={colors.textSecondary} />
                    )}
                  </TouchableOpacity>
                  <Text style={[
                    styles.todoTitle,
                    todo.completed && styles.todoTitleCompleted
                  ]}>
                    {todo.title}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => handleDeleteTodo(todo.id)}
                >
                  <Trash2 size={16} color={colors.error} />
                </TouchableOpacity>
              </View>
              
              {todo.description ? (
                <Text style={styles.todoDescription}>{todo.description}</Text>
              ) : null}
              
              <View style={styles.todoFooter}>
                <View style={styles.todoMeta}>
                  <View style={styles.categoryTag}>
                    <Text style={styles.categoryText}>{todo.category}</Text>
                  </View>
                  <View 
                    style={[
                      styles.priorityIndicator,
                      { backgroundColor: getPriorityColor(todo.priority) }
                    ]} 
                  />
                </View>
                <Text style={styles.todoDescription}>
                  {new Date(todo.createdAt).toLocaleDateString()}
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
            <Text style={styles.modalTitle}>Add Todo</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Todo title"
              placeholderTextColor={colors.textSecondary}
              value={newTodo.title}
              onChangeText={(text) => setNewTodo({...newTodo, title: text})}
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description (optional)"
              placeholderTextColor={colors.textSecondary}
              value={newTodo.description}
              onChangeText={(text) => setNewTodo({...newTodo, description: text})}
              multiline
              numberOfLines={3}
            />

            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.pickerRow}>
                  {categories.map(category => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.pickerButton,
                        newTodo.category === category && styles.pickerButtonActive
                      ]}
                      onPress={() => setNewTodo({...newTodo, category})}
                    >
                      <Text style={[
                        styles.pickerButtonText,
                        newTodo.category === category && styles.pickerButtonTextActive
                      ]}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Priority</Text>
              <View style={styles.pickerRow}>
                {priorities.map(priority => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.pickerButton,
                      newTodo.priority === priority && styles.pickerButtonActive
                    ]}
                    onPress={() => setNewTodo({...newTodo, priority: priority as any})}
                  >
                    <Text style={[
                      styles.pickerButtonText,
                      newTodo.priority === priority && styles.pickerButtonTextActive
                    ]}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
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
                onPress={handleAddTodo}
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
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.pickerRow}>
                  <TouchableOpacity
                    style={[
                      styles.pickerButton,
                      activeCategoryFilter === 'all' && styles.pickerButtonActive
                    ]}
                    onPress={() => setActiveCategoryFilter('all')}
                  >
                    <Text style={[
                      styles.pickerButtonText,
                      activeCategoryFilter === 'all' && styles.pickerButtonTextActive
                    ]}>
                      All
                    </Text>
                  </TouchableOpacity>
                  {categories.map(category => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.pickerButton,
                        activeCategoryFilter === category && styles.pickerButtonActive
                      ]}
                      onPress={() => setActiveCategoryFilter(category)}
                    >
                      <Text style={[
                        styles.pickerButtonText,
                        activeCategoryFilter === category && styles.pickerButtonTextActive
                      ]}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
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