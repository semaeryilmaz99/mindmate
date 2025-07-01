import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, Category, AppSettings } from '../types';
import { STORAGE_KEYS } from '../utils/constants';

export class StorageService {
  // Tasks
  static async getTasks(): Promise<Task[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.tasks);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading tasks:', error);
      return [];
    }
  }

  static async saveTasks(tasks: Task[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  }

  // Categories
  static async getCategories(): Promise<Category[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.categories);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading categories:', error);
      return [];
    }
  }

  static async saveCategories(categories: Category[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(categories));
    } catch (error) {
      console.error('Error saving categories:', error);
    }
  }

  // Settings
  static async getSettings(): Promise<AppSettings> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.settings);
      return data ? JSON.parse(data) : {
        theme: 'light',
        notifications: true,
        defaultPriority: 'medium',
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };
    } catch (error) {
      console.error('Error loading settings:', error);
      return {
        theme: 'light',
        notifications: true,
        defaultPriority: 'medium',
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };
    }
  }

  static async saveSettings(settings: AppSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  // Clear all data
  static async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.tasks,
        STORAGE_KEYS.categories,
        STORAGE_KEYS.settings,
        STORAGE_KEYS.stats,
      ]);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }
} 