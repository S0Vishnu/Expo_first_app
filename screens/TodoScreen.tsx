import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Animated,
  RefreshControl,
  Alert,
  Dimensions,
} from "react-native";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import styles from "../styles/styles";
import CustomCircularProgress from "../components/CircularProgress";
import { Picker } from "@react-native-picker/picker";

interface Todo {
  id: string;
  task: string;
  completed: boolean;
  priority: string;
  tags: string[];
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const TodoScreen: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("Low");
  const [tags, setTags] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [deletedTodo, setDeletedTodo] = useState<Todo | null>(null);
  const translateYAnim = useRef(new Animated.Value(0)).current;
  const [timer, setTimer] = useState<number>(5); // Timer for undo popup
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchTodos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "todos"));
      const fetchedTodos: Todo[] = [];
      querySnapshot.forEach((doc) => {
        fetchedTodos.push({ id: doc.id, ...doc.data() } as Todo);
      });
      setTodos(fetchedTodos);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    fetchTodos();

    const showListener = Keyboard.addListener("keyboardDidShow", () => {
      Animated.timing(translateYAnim, {
        toValue: -120,
        duration: 160,
        useNativeDriver: true,
      }).start();
    });

    const hideListener = Keyboard.addListener("keyboardDidHide", () => {
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, [translateYAnim]);

  const addTodo = async () => {
    if (task.trim()) {
      try {
        const newTodo = { task, completed: false, priority, tags };
        const docRef = await addDoc(collection(db, "todos"), newTodo);
        setTodos([...todos, { id: docRef.id, ...newTodo }]);
        setTask("");
        setPriority("Low");
        setTags([]);
      } catch (error) {
        console.error("Error adding todo:", error);
      }
    }
  };

  const toggleTodo = async (id: string) => {
    try {
      const todoRef = doc(db, "todos", id);
      const updatedTodos = todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );
      const updatedTodo = updatedTodos.find((todo) => todo.id === id);

      if (updatedTodo) {
        await updateDoc(todoRef, { completed: updatedTodo.completed });
      }
      setTodos(updatedTodos);
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  const removeTodo = async (id: string) => {
    const todoRef = doc(db, "todos", id);
    const todoToDelete = todos.find((todo) => todo.id === id);

    if (todoToDelete) {
      setDeletedTodo(todoToDelete);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));

      timerRef.current = setTimeout(async () => {
        try {
          await deleteDoc(todoRef); // Deletes the document on the server
          setDeletedTodo(null); // Ensure the UI is updated
        } catch (error) {
          console.error("Error deleting todo:", error);
        }
      }, 5000); // Wait 5 seconds before permanent deletion
    }
  };

  const undoDelete = () => {
    if (deletedTodo) {
      setTodos((prev) => [...prev, deletedTodo]);
      setDeletedTodo(null);
      clearTimeout(timerRef.current!); // Clear the timeout to prevent deletion
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTodos();
    setRefreshing(false);
    clearInterval(timerRef.current!);
  };

  useEffect(() => {
    if (deletedTodo) {
      setTimer(5);
      timerRef.current = setTimeout(() => {
        setDeletedTodo(null);
      }, 5000);
    }

    return () => {
      setTimer(0);
      clearTimeout(timerRef.current!); // Clear timeout on cleanup
    };
  }, [deletedTodo]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "#ff4444"; // Red for high priority
      case "Medium":
        return "#ffbb33"; // Orange/Yellow for medium
      case "Low":
        return "#00C851"; // Green for low
      default:
        return "#6200ee"; // Default purple
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <SafeAreaView style={styles.container}>
          <Text style={styles.title}>Todo App</Text>
          <FlatList
            data={todos}
            keyExtractor={(item) => item.id}
            // In your renderItem function:
            renderItem={({ item }) => (
              <View style={[styles.todoItem]}>
                <TouchableOpacity
                  onPress={() => toggleTodo(item.id)}
                  style={{ flex: 1 }}
                >
                  <View>
                    <Text
                      style={[
                        styles.todoText,
                        item.completed && styles.completed,
                      ]}
                    >
                      {item.task}
                      <Text
                        style={[
                          styles.priorityText,
                          { color: getPriorityColor(item.priority) },
                        ]}
                      >
                        {item.priority} Priority
                      </Text>
                    </Text>
                  </View>
                  <Text style={styles.tags}>
                    Tags: {item.tags.join(", ") || "None"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeTodo(item.id)}>
                  <Text style={styles.deleteText}>❌</Text>
                </TouchableOpacity>
              </View>
            )}
            style={{ minHeight: SCREEN_HEIGHT, flex: 1 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                colors={["#6200ee"]}
                onRefresh={onRefresh}
                tintColor="#6200ee" // Add this for iOS
                progressBackgroundColor="#ffffff" // Add this for iOS
              />
            }
            contentContainerStyle={todos.length === 0 ? { flex: 1 } : {}} // Important for empty list
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text>No todos yet. Pull to refresh.</Text>
              </View>
            }
          />

          {deletedTodo && (
            <View style={styles.undoContainer}>
              {/* Circular Progress Timer */}
              {/* <View style={styles.timerContainer}>
                <CustomCircularProgress
                  size={40}
                  strokeWidth={6}
                  progress={(timer / 5) * 100} // Timer is out of 5 seconds
                  color="#6200ee"
                  backgroundColor="#d3d3d3"
                />
              </View> */}

              {/* Undo Text and Button */}
              <Text style={styles.undoText}>Task deleted!</Text>
              <TouchableOpacity onPress={undoDelete}>
                <Text style={styles.undoButton}>Undo</Text>
              </TouchableOpacity>
            </View>
          )}

          <Animated.View
            style={[
              styles.inputContainer,
              {
                transform: [{ translateY: translateYAnim }],
              },
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="Add a task"
              value={task}
              onChangeText={setTask}
            />

            {/* Updated Picker Container */}
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={priority}
                onValueChange={(itemValue) => setPriority(itemValue)}
                style={styles.picker}
                dropdownIconColor="#6200ee"
              >
                <Picker.Item label="Low" value="Low" color="#00C851" />
                <Picker.Item label="Medium" value="Medium" color="#ffbb33" />
                <Picker.Item label="High" value="High" color="#ff4444" />
              </Picker>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Tags (comma-separated)"
              value={tags.join(", ")}
              onChangeText={(text) =>
                setTags(text.split(",").map((tag) => tag.trim()))
              }
            />
            <Button title="Add" onPress={addTodo} />
          </Animated.View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default TodoScreen;
