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
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { 
  Plus, 
  User, 
  Settings, 
  Palette,
  Bell,
  Trash2,
  Check,
  Moon,
  Sun,
  Smartphone
} from 'lucide-react-native';
import { profileStyles } from '../../styles/profile';

export default function ProfileScreen() {
  const { colors, theme, setTheme } = useTheme();
  const styles = profileStyles(colors);
  const { profiles, activeProfile, addProfile, removeProfile, switchProfile } = useData();
  
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [newProfile, setNewProfile] = useState({
    name: '',
    avatar: '👤',
    isActive: false,
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const avatars = ['👤', '👨', '👩', '🧑', '👨‍💼', '👩‍💼', '👨‍🎓', '👩‍🎓', '🧑‍🎨', '👨‍💻', '👩‍💻', '🧑‍🔬'];
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
    
    addProfile(newProfile);
    setNewProfile({
      name: '',
      avatar: '👤',
      isActive: false,
    });
    setProfileModalVisible(false);
  };

  const handleRemoveProfile = (id: string) => {
    if (profiles.length <= 1) {
      Alert.alert('Error', 'Cannot delete the last profile');
      return;
    }
    
    Alert.alert(
      'Delete Profile',
      'Are you sure you want to delete this profile?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => removeProfile(id) },
      ]
    );
  };

  const handleSwitchProfile = (id: string) => {
    switchProfile(id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => setSettingsModalVisible(true)}
        >
          <Settings size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profilesContainer}>
          <Text style={styles.sectionTitle}>Profiles</Text>
          
          {profiles.map(profile => (
            <TouchableOpacity
              key={profile.id}
              style={[
                styles.profileItem,
                profile.isActive && styles.activeProfileItem
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
                {profile.isActive && (
                  <View style={[styles.actionButton, styles.activeActionButton]}>
                    <Check size={16} color="#FFFFFF" />
                  </View>
                )}
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

        <View style={styles.themeContainer}>
          <Text style={styles.sectionTitle}>Theme</Text>
          
          {themes.map(themeOption => {
            const IconComponent = themeOption.icon;
            return (
              <TouchableOpacity
                key={themeOption.key}
                style={[
                  styles.themeItem,
                  theme === themeOption.key && styles.activeThemeItem
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

        <View style={styles.settingsContainer}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <Bell size={20} color={colors.text} />
              </View>
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={notificationsEnabled ? '#FFFFFF' : colors.textSecondary}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <Settings size={20} color={colors.text} />
              </View>
              <Text style={styles.settingText}>Notification Sound</Text>
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

      <Modal
        visible={profileModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Profile</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Profile name"
              placeholderTextColor={colors.textSecondary}
              value={newProfile.name}
              onChangeText={(text) => setNewProfile({...newProfile, name: text})}
            />
            
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarLabel}>Choose Avatar</Text>
              <View style={styles.avatarGrid}>
                {avatars.map(avatar => (
                  <TouchableOpacity
                    key={avatar}
                    style={[
                      styles.avatarButton,
                      newProfile.avatar === avatar && styles.avatarButtonActive
                    ]}
                    onPress={() => setNewProfile({...newProfile, avatar})}
                  >
                    <Text style={styles.avatarEmoji}>{avatar}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.buttonSecondary]}
                onPress={() => setProfileModalVisible(false)}
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
            
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Bell size={20} color={colors.text} />
                </View>
                <Text style={styles.settingText}>Push Notifications</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={notificationsEnabled ? '#FFFFFF' : colors.textSecondary}
              />
            </View>
            
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Settings size={20} color={colors.text} />
                </View>
                <Text style={styles.settingText}>Sound Effects</Text>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={setSoundEnabled}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={soundEnabled ? '#FFFFFF' : colors.textSecondary}
              />
            </View>

            <TouchableOpacity 
              style={styles.button}
              onPress={() => setSettingsModalVisible(false)}
            >
              <Text style={styles.buttonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}