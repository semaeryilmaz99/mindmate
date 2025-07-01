export const COLORS = {
  primary: '#3498db',
  secondary: '#2ecc71',
  accent: '#e74c3c',
  background: '#f8f9fa',
  surface: '#ffffff',
  text: '#2c3e50',
  textSecondary: '#7f8c8d',
  border: '#e1e8ed',
  success: '#27ae60',
  warning: '#f39c12',
  error: '#e74c3c',
  info: '#3498db',
} as const;

export const PRIORITY_COLORS = {
  low: '#95a5a6',
  medium: '#f39c12',
  high: '#e74c3c',
} as const;

export const DEFAULT_CATEGORIES = [
  { id: '1', name: 'Work', color: '#3498db', icon: '💼' },
  { id: '2', name: 'Personal', color: '#2ecc71', icon: '👤' },
  { id: '3', name: 'Shopping', color: '#e67e22', icon: '🛒' },
  { id: '4', name: 'Health', color: '#e74c3c', icon: '🏥' },
  { id: '5', name: 'Study', color: '#9b59b6', icon: '📚' },
] as const;

export const APP_CONFIG = {
  name: 'MindMate',
  version: '1.0.0',
  maxTitleLength: 100,
  maxDescriptionLength: 500,
  defaultTaskPriority: 'medium' as const,
  defaultSortBy: 'createdAt' as const,
  defaultSortOrder: 'desc' as const,
} as const;

export const STORAGE_KEYS = {
  tasks: 'mindmate_tasks',
  categories: 'mindmate_categories',
  settings: 'mindmate_settings',
  stats: 'mindmate_stats',
} as const; 