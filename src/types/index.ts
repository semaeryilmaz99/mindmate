export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface TaskFilter {
  showCompleted: boolean;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  searchQuery?: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  defaultPriority: 'low' | 'medium' | 'high';
  sortBy: 'dueDate' | 'priority' | 'createdAt' | 'title';
  sortOrder: 'asc' | 'desc';
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  byPriority: {
    low: number;
    medium: number;
    high: number;
  };
  byCategory: Record<string, number>;
}

export interface Subtask {
  id: string;
  task_id: string;
  title: string;
  completed: boolean;
  created_at: Date;
} 