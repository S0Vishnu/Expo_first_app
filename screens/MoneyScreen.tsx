import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import {
  collection,
  addDoc,
  getDocs,
  setDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  getDoc,
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";

interface Entry {
  id: string;
  type: "income" | "expense";
  amount: number;
  date: string;
}

const MoneyScreen: React.FC = () => {
  const [amount, setAmount] = useState<string>("");
  const [type, setType] = useState<"income" | "expense">("income");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const [refreshing, setRefreshing] = useState(false);

  const entriesCollection = collection(db, "entries");
  const balanceDocRef = doc(db, "account", "balance");
  const cashFlowHistoryCollection = collection(db, "cashFlowHistory");

  useEffect(() => {
    fetchEntries();
    fetchCurrentBalance();
  }, []);

  const fetchEntries = async () => {
    try {
      const querySnapshot = await getDocs(
        query(entriesCollection, orderBy("date", "desc"))
      );
      const fetchedEntries: Entry[] = [];
      querySnapshot.forEach((doc) => {
        fetchedEntries.push({ id: doc.id, ...doc.data() } as Entry);
      });
      setEntries(fetchedEntries);
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  const fetchCurrentBalance = async () => {
    try {
      const balanceSnapshot = await getDoc(balanceDocRef);
      if (balanceSnapshot.exists()) {
        setCurrentBalance(balanceSnapshot.data().balance);
      } else {
        await setDoc(balanceDocRef, { balance: 0 });
        setCurrentBalance(0);
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const addEntry = async () => {
    if (!amount) return Alert.alert("Error", "Amount is required");
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0)
      return Alert.alert("Error", "Enter a valid amount");

    try {
      const newEntry = {
        type,
        amount: numericAmount,
        date: new Date().toISOString(),
      };

      // Add to main entries collection
      await addDoc(entriesCollection, newEntry);

      // Add to cashFlowHistory collection
      await addDoc(cashFlowHistoryCollection, {
        ...newEntry,
        action: "add",
      });

      const updatedBalance =
        type === "income"
          ? currentBalance + numericAmount
          : currentBalance - numericAmount;

      await setDoc(balanceDocRef, { balance: updatedBalance });
      setCurrentBalance(updatedBalance);
      fetchEntries();
      setAmount("");
    } catch (error) {
      console.error("Error adding entry:", error);
    }
  };

  const deleteEntry = async (
    id: string,
    entryAmount: number,
    entryType: string
  ) => {
    try {
      // Delete from main entries collection
      await deleteDoc(doc(entriesCollection, id));

      // Add deletion record to cashFlowHistory collection
      await addDoc(cashFlowHistoryCollection, {
        id,
        type: entryType,
        amount: entryAmount,
        date: new Date().toISOString(),
        action: "delete",
      });

      const updatedBalance =
        entryType === "income"
          ? currentBalance - entryAmount
          : currentBalance + entryAmount;

      await setDoc(balanceDocRef, { balance: updatedBalance });
      setCurrentBalance(updatedBalance);
      fetchEntries();
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  const renderItem = ({ item }: { item: Entry }) => (
    <TouchableOpacity
      style={[
        styles.entryItem,
        item.type === "income" ? styles.incomeItem : styles.expenseItem,
      ]}
      onLongPress={() => {
        Alert.alert(
          "Actions",
          "Choose an action",
          [
            {
              text: "Delete",
              onPress: () => deleteEntry(item.id, item.amount, item.type),
              style: "destructive",
            },
            { text: "Cancel", style: "cancel" },
          ],
          { cancelable: true }
        );
      }}
    >
      <Text>
        {item.type === "income" ? "⬆️" : "⬇️"} ${item.amount}
      </Text>
      <Text>{new Date(item.date).toLocaleString()}</Text>
    </TouchableOpacity>
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEntries();
    await fetchCurrentBalance();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Current Balance: ${currentBalance}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Amount"
          style={styles.input}
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
        <Button
          title={type === "income" ? "Add Income" : "Add Expense"}
          onPress={() => addEntry()}
        />
        <Button
          title={type === "income" ? "Switch to Expense" : "Switch to Income"}
          onPress={() =>
            setType((prev) => (prev === "income" ? "expense" : "income"))
          }
        />
      </View>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f5f5f5" },
  header: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 8,
    marginRight: 8,
    flex: 1,
  },
  entryItem: {
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  incomeItem: { backgroundColor: "#d4edda", borderColor: "#c3e6cb" },
  expenseItem: { backgroundColor: "#f8d7da", borderColor: "#f5c6cb" },
});

export default MoneyScreen;
