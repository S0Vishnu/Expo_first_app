import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark' | 'black';

export type Colors = {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  accent: string;
};

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colors: Colors;
}

const lightColors = {
  primary: '#3B82F6',
  secondary: '#6B7280',
  background: '#FFFFFF',
  surface: '#F9FAFB',
  text: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  accent: '#8B5CF6',
};

const darkColors = {
  primary: '#60A5FA',
  secondary: '#9CA3AF',
  background: '#1F2937',
  surface: '#374151',
  text: '#F9FAFB',
  textSecondary: '#D1D5DB',
  border: '#4B5563',
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  accent: '#A78BFA',
};

const blackColors = {
  primary: '#60A5FA',
  secondary: '#9CA3AF',
  background: '#000000',
  surface: '#1C1C1E',
  text: '#FFFFFF',
  textSecondary: '#D1D5DB',
  border: '#2C2C2E',
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  accent: '#A78BFA',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme && ['light', 'dark', 'black'].includes(savedTheme)) {
        setTheme(savedTheme as Theme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const handleSetTheme = async (newTheme: Theme) => {
    try {
      await AsyncStorage.setItem('theme', newTheme);
      setTheme(newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const getColors = () => {
    switch (theme) {
      case 'dark':
        return darkColors;
      case 'black':
        return blackColors;
      default:
        return lightColors;
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme: handleSetTheme,
        colors: getColors(),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
