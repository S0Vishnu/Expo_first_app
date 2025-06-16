import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "center",
  },
  inputContainer: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
    zIndex: 1,
    bottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  todoText: { fontSize: 16 },
  completed: { textDecorationLine: "line-through", color: "#aaa" },
  deleteText: { marginLeft: 10, color: "red", fontSize: 18 },
  undoContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FBDDDB", // Light red for warning
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Shadow for Android
    zIndex: 10, // Ensure it's above other components
  },
  undoText: {
    fontSize: 16,
    color: "#FF3426", // Dark red for text
    flex: 1,
    marginRight: 10,
  },
  undoButton: {
    fontSize: 16,
    color: "#4067F7",
    fontWeight: "regular",
  },
  tags: {
    fontSize: 14,
    color: "#6c757d", // Neutral gray for additional information
    marginTop: 5,
    fontStyle: "italic", // To differentiate from other text
  },
  timerContainer: {
    position: "absolute",
    bottom: 10, // Adjust based on placement preference
    right: 10, // Align it to the bottom-right corner
    width: 50, // Set the size for the circular indicator
    height: 50,
    borderRadius: 25, // Make it circular
    backgroundColor: "rgba(98, 0, 238, 0.1)", // Light overlay background
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#6200ee", // Accent color for the circle
  },
  timerText: {
    fontSize: 12,
    color: "#6200ee", // Match the circle border color
    fontWeight: "bold",
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginVertical: 10,
    width: "30%",
    marginRight: 10,
    height: 40,
    backgroundColor: "white",
    overflow: "hidden",
  },
  picker: {
    width: "100%",
    height: 50,
    color: "#6200ee",
    top: -8,
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
    borderLeftWidth: 0, // Will be set dynamically
  },
  priorityTag: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginTop: 5,
    marginBottom: 8,
    backgroundColor: "#f5f5f5",
  },
  priorityText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 5,
  },
});

export default styles;
