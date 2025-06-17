import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import {
  Plus,
  Settings,
  Bell,
  Trash2,
  Check,
  Moon,
  Sun,
  Smartphone,
} from 'lucide-react-native';
import { profileStyles } from '../../styles/profile';
import CustomAlert from '../../components/AlertModel';

export default function ProfileScreen() {
  const { colors, theme, setTheme } = useTheme();
  const styles = profileStyles(colors);
  const { profiles, addProfile, removeProfile, switchProfile } = useData();

  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [newProfile, setNewProfile] = useState({
    name: '',
    password: '',
    avatar: '👤',
    isActive: false,
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [deleteAlertVisible, setDeleteAlertVisible] = useState(false);
  const [toDelete, setToDelete] = useState<string | null>(null);

  const avatars = [
    '👤',
    '👨',
    '👩',
    '🧑',
    '👨‍💼',
    '👩‍💼',
    '👨‍🎓',
    '👩‍🎓',
    '🧑‍🎨',
    '👨‍💻',
    '👩‍💻',
    '🧑‍🔬',
  ];
  const themes = [
    { key: 'light', name: 'Light', icon: Sun },
    { key: 'dark', name: 'Dark', icon: Moon },
    { key: 'black', name: 'Black', icon: Smartphone },
  ];

  const handleAddProfile = () => {
    if (!newProfile.name.trim()) {
      Alert.alert('Error', 'Please enter a profile name');
      return;
    }
    if (!newProfile.password.trim()) {
      Alert.alert('Error', 'Please enter a valid password');
      return;
    }

    addProfile(newProfile);
    resetProfileForm();
  };

  const handleRemoveProfile = (id: string) => {
    setToDelete(id);
    setDeleteAlertVisible(true);
  };

  const confirmDelete = () => {
    if (toDelete) {
      removeProfile(toDelete);
      setToDelete(null);
    }
    setDeleteAlertVisible(false);
  };

  const cancelDelete = () => {
    setToDelete(null);
    setDeleteAlertVisible(false);
  };

  const handleSwitchProfile = (id: string) => {
    switchProfile(id);
  };

  const resetProfileForm = () => {
    setNewProfile({ name: '', password: '', avatar: '👤', isActive: false });
    setProfileModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setSettingsModalVisible(true)}
        >
          <Settings size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profiles Section */}
        <View style={styles.profilesContainer}>
          <Text style={styles.sectionTitle}>Profiles</Text>
          {profiles.map((profile) => (
            <TouchableOpacity
              key={profile.id}
              style={[
                styles.profileItem,
                profile.isActive && styles.activeProfileItem,
              ]}
              onPress={() => handleSwitchProfile(profile.id)}
            >
              <View style={styles.profileLeft}>
                <Text style={styles.profileAvatar}>{profile.avatar}</Text>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>{profile.name}</Text>
                  {profile.isActive && (
                    <Text style={styles.profileStatus}>Active</Text>
                  )}
                </View>
              </View>
              <View style={styles.profileActions}>
                {profiles.length > 1 && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleRemoveProfile(profile.id)}
                  >
                    <Trash2 size={16} color={colors.error} />
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.addProfileButton}
            onPress={() => setProfileModalVisible(true)}
          >
            <Plus size={20} color={colors.textSecondary} />
            <Text style={styles.addProfileText}>Add new profile</Text>
          </TouchableOpacity>
        </View>

        {/* Theme Section */}
        <View style={styles.themeContainer}>
          <Text style={styles.sectionTitle}>Theme</Text>
          {themes.map((themeOption) => {
            const IconComponent = themeOption.icon;
            return (
              <TouchableOpacity
                key={themeOption.key}
                style={[
                  styles.themeItem,
                  theme === themeOption.key && styles.activeThemeItem,
                ]}
                onPress={() => setTheme(themeOption.key as any)}
              >
                <View style={styles.themeLeft}>
                  <IconComponent size={20} color={colors.text} />
                  <Text style={styles.themeText}>{themeOption.name}</Text>
                </View>
                {theme === themeOption.key && (
                  <Check size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Settings Section */}
        <View style={styles.settingsContainer}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Bell size={20} color={colors.text} />
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={
                notificationsEnabled ? '#FFFFFF' : colors.textSecondary
              }
            />
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Settings size={20} color={colors.text} />
              <Text style={styles.settingText}>Sound Effects</Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={soundEnabled ? '#FFFFFF' : colors.textSecondary}
            />
          </View>
        </View>
      </ScrollView>

      {/* Modals */}
      <Modal
        visible={profileModalVisible}
        transparent
        animationType="fade"
        onRequestClose={resetProfileForm}
      >
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Profile</Text>
            <TextInput
              style={styles.input}
              placeholder="Profile name"
              placeholderTextColor={colors.textSecondary}
              value={newProfile.name}
              importantForAccessibility="yes"
              onChangeText={(text) =>
                setNewProfile({ ...newProfile, name: text })
              }
            />
            <Text style={styles.modalTitle}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="•••••••"
              placeholderTextColor={colors.textSecondary}
              value={newProfile.password}
              importantForAccessibility="yes"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={(text) =>
                setNewProfile({ ...newProfile, password: text })
              }
            />
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarLabel}>Choose Avatar</Text>
              <View style={styles.avatarGrid}>
                {avatars.map((avatar) => (
                  <TouchableOpacity
                    key={avatar}
                    style={[
                      styles.avatarButton,
                      newProfile.avatar === avatar && styles.avatarButtonActive,
                    ]}
                    onPress={() => setNewProfile({ ...newProfile, avatar })}
                  >
                    <Text style={styles.avatarEmoji}>{avatar}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={resetProfileForm}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={handleAddProfile}
              >
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={settingsModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSettingsModalVisible(false)}
      >
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Settings</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setSettingsModalVisible(false)}
            >
              <Text style={styles.buttonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <CustomAlert
        visible={deleteAlertVisible}
        title="Delete Profile"
        message="Are you sure you want to delete this profile?"
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
        cancelText="No"
        confirmText="Yes"
      />
    </SafeAreaView>
  );
}
