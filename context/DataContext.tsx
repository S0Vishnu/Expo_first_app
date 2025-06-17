import React, { createContext, useContext, useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export interface Profile {
  id: string;
  name: string;
  avatar: string;
  isActive: boolean;
}

export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  category: string;
  dueDate?: Date;
  priority: "low" | "medium" | "high";
  createdAt: Date;
}

export interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: Date;
  profileId: string;
}

export interface Reminder {
  id: string;
  title: string;
  content: string;
  time: Date;
  repeat: "none" | "daily" | "weekly" | "monthly";
  isActive: boolean;
  profileId: string;
  selectedDays?: number[]; // Add this line
}

interface DataContextType {
  profiles: Profile[];
  activeProfile: Profile | null;
  todos: Todo[];
  transactions: Transaction[];
  reminders: Reminder[];
  dailyStreak: number;
  addProfile: (profile: Omit<Profile, "id">) => void;
  removeProfile: (id: string) => void;
  switchProfile: (id: string) => void;
  addTodo: (todo: Omit<Todo, "id" | "createdAt">) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: string) => void;
  addReminder: (reminder: Omit<Reminder, "id">) => void;
  updateReminder: (id: string, updates: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  updateDailyStreak: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [dailyStreak, setDailyStreak] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const convertDate = (date: any): Date | undefined =>
    date instanceof Timestamp ? date.toDate() : date;

  const loadData = async () => {
    try {
      // Load profiles
      const profilesSnapshot = await getDocs(collection(db, "profiles-v1"));
      const profilesData = profilesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Profile[];
      setProfiles(profilesData);
      setActiveProfile(profilesData.find((p) => p.isActive) || profilesData[0] || null);
    } catch (error) {
      console.error("Error loading profiles:", error);
    }

    try {
      // Load todos
      const todosSnapshot = await getDocs(collection(db, "todos-v1"));
      const todosData = todosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: convertDate(doc.data().createdAt),
        dueDate: convertDate(doc.data().dueDate),
      })) as Todo[];
      setTodos(todosData);
    } catch (error) {
      console.error("Error loading todos:", error);
    }

    try {
      // Load transactions
      const transactionsSnapshot = await getDocs(collection(db, "transactions-v1"));
      const transactionsData = transactionsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: convertDate(doc.data().date),
      })) as Transaction[];
      setTransactions(transactionsData);
    } catch (error) {
      console.error("Error loading transactions:", error);
    }

    try {
      // Load reminders
      const remindersSnapshot = await getDocs(collection(db, "reminders-v1"));
      const remindersData = remindersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        time: convertDate(doc.data().time),
      })) as Reminder[];
      setReminders(remindersData);
    } catch (error) {
      console.error("Error loading reminders:", error);
    }
  };

  const addData = async (key: string, data: any) => {
    try {
      const docRef = await addDoc(collection(db, key), data);
      return docRef.id;
    } catch (error) {
      console.error(`Error adding to ₹{key}:`, error);
      throw error;
    }
  };

  const updateData = async (key: string, id: string, data: any) => {
    try {
      await updateDoc(doc(db, key, id), data);
    } catch (error) {
      console.error(`Error updating ₹{key}:`, error);
      throw error;
    }
  };

  const deleteData = async (key: string, id: string) => {
    try {
      await deleteDoc(doc(db, key, id));
    } catch (error) {
      console.error(`Error deleting ₹{key}:`, error);
      throw error;
    }
  };

  const addProfile = (profile: Omit<Profile, "id">) => {
    const newProfile = { ...profile, isActive: false };
    addData("profiles-v1", newProfile).then((id) => {
      if (id) setProfiles((prev) => [...prev, { id, ...newProfile }]);
    });
  };

  const removeProfile = (id: string) => {
    deleteData("profiles-v1", id).then(() => {
      setProfiles((prev) => prev.filter((p) => p.id !== id));
      if (activeProfile?.id === id) setActiveProfile(null);
    });
  };

  const switchProfile = async (id: string) => {
    try {
      await Promise.all(
        profiles.map((profile) =>
          updateData("profiles-v1", profile.id, { isActive: profile.id === id })
        )
      );
      setActiveProfile(profiles.find((p) => p.id === id) || null);
      setProfiles((prev) =>
        prev.map((profile) => ({ ...profile, isActive: profile.id === id }))
      );
    } catch (error) {
      console.error("Error switching profile:", error);
    }
  };

  const addTodo = (todo: Omit<Todo, "id" | "createdAt">) => {
    const newTodo = { ...todo, createdAt: new Date() };
    addData("todos-v1", newTodo).then((id) => {
      if (id) setTodos((prev) => [...prev, { id, ...newTodo }]);
    });
  };

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    updateData("todos-v1", id, updates).then(() => {
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo))
      );
    });
  };

  const deleteTodo = (id: string) => {
    deleteData("todos-v1", id).then(() => {
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    });
  };

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    addData("transactions-v1", transaction).then((id) => {
      if (id) setTransactions((prev) => [...prev, { id, ...transaction }]);
    });
  };

  const deleteTransaction = (id: string) => {
    deleteData("transactions-v1", id).then(() => {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    });
  };

  const addReminder = (reminder: Omit<Reminder, "id">) => {
    addData("reminders-v1", reminder).then((id) => {
      if (id) setReminders((prev) => [...prev, { id, ...reminder }]);
    });
  };

  const updateReminder = (id: string, updates: Partial<Reminder>) => {
    updateData("reminders-v1", id, updates).then(() => {
      setReminders((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
      );
    });
  };

  const deleteReminder = (id: string) => {
    deleteData("reminders-v1", id).then(() => {
      setReminders((prev) => prev.filter((r) => r.id !== id));
    });
  };

  const updateDailyStreak = () => {
    const today = new Date().setHours(0, 0, 0, 0);
    const completedTodayCount = todos.filter((todo) => {
      const todoDate = new Date(todo.createdAt).setHours(0, 0, 0, 0);
      return todo.completed && todoDate === today;
    }).length;

    if (completedTodayCount > 0) {
      setDailyStreak((prev) => prev + 1);
    }
  };

  return (
    <DataContext.Provider
      value={{
        profiles,
        activeProfile,
        todos,
        transactions,
        reminders,
        dailyStreak,
        addProfile,
        removeProfile,
        switchProfile,
        addTodo,
        updateTodo,
        deleteTodo,
        addTransaction,
        deleteTransaction,
        addReminder,
        updateReminder,
        deleteReminder,
        updateDailyStreak,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
