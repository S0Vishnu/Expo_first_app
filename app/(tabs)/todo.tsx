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
import { todoStyles } from '../../styles/todo';

export default function TodoScreen() {
  const { colors } = useTheme();
  const styles = todoStyles(colors);
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