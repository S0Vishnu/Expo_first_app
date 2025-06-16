import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // Gradient backgrounds

const ProfileScreen: React.FC = () => {
  const handleSignOut = () => {
    Alert.alert("Signed Out", "You have successfully signed out!");
    // Implement any navigation logic if needed, e.g., redirect to the Home screen
  };

  const handleSwitchAccount = () => {
    Alert.alert("Switch Account", "Switch account functionality not implemented yet.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.subtitle}>Manage your account</Text>

      <View style={styles.iconContainer}>
        {/* Pink Gradient Icon */}
        <TouchableOpacity onPress={handleSwitchAccount}>
          <LinearGradient
            colors={["#ff9a9e", "#fad0c4"]}
            style={styles.profileIcon}
          >
            <Text style={styles.iconText}>P</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Blue Gradient Icon */}
        <TouchableOpacity onPress={handleSwitchAccount}>
          <LinearGradient
            colors={["#89f7fe", "#66a6ff"]}
            style={styles.profileIcon}
          >
            <Text style={styles.iconText}>V</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#6200ee",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    marginBottom: 30,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 30,
  },
  profileIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  iconText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  button: {
    backgroundColor: "#6200ee",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
