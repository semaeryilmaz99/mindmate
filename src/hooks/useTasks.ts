import { useState, useEffect, useCallback } from 'react';
import { Task } from '../types';
import { supabase } from '../services/supabase';

function generateTempId() {
  return 'temp-' + Math.random().toString(36).substr(2, 9);
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Load tasks on mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('tasks').select('*').order('createdAt', { ascending: false });
      if (error) throw error;
      // Convert string dates to Date objects
      const parsedTasks = (data || []).map((task: any) => ({
        ...task,
        createdAt: task.createdAt ? new Date(task.createdAt) : new Date(),
        updatedAt: task.updatedAt ? new Date(task.updatedAt) : new Date(),
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      }));
      setTasks(parsedTasks);
    } catch (error) {
      console.error('Error loading tasks from Supabase:', error.message || error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    // Optimistically add the task to local state
    const tempId = generateTempId();
    const optimisticTask: Task = {
      ...taskData,
      id: tempId,
      createdAt: now,
      updatedAt: now,
    };
    setTasks((prev) => [optimisticTask, ...prev]);

    // Add to Supabase
    const { data, error } = await supabase.from('tasks').insert([
      {
        ...taskData,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
    ]).select();
    if (error) {
      console.error('Error adding task to Supabase:', error.message);
      // Optionally remove the optimistic task if error
      setTasks((prev) => prev.filter((task) => task.id !== tempId));
      return;
    }
    if (data && data.length > 0) {
      const newTask = {
        ...data[0],
        createdAt: new Date(data[0].createdAt),
        updatedAt: new Date(data[0].updatedAt),
        dueDate: data[0].dueDate ? new Date(data[0].dueDate) : undefined,
      };
      // Replace the optimistic task with the real one
      setTasks((prev) => [newTask, ...prev.filter((task) => task.id !== tempId)]);
    } else {
      // If no data returned, re-fetch tasks to ensure consistency
      loadTasks();
    }
  }, []);

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    const now = new Date();
    const { data, error } = await supabase.from('tasks').update({
      ...updates,
      updatedAt: now.toISOString(),
    }).eq('id', id).select();
    if (error) {
      console.error('Error updating task in Supabase:', error.message);
      return;
    }
    if (data && data.length > 0) {
      const updatedTask = {
        ...data[0],
        createdAt: new Date(data[0].createdAt),
        updatedAt: new Date(data[0].updatedAt),
        dueDate: data[0].dueDate ? new Date(data[0].dueDate) : undefined,
      };
      setTasks((prev) => prev.map((task) => (task.id === id ? updatedTask : task)));
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) {
      console.error('Error deleting task from Supabase:', error.message);
      return;
    }
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const toggleTaskCompletion = useCallback(async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      await updateTask(id, { completed: !task.completed });
    }
  }, [tasks, updateTask]);

  const clearCompletedTasks = useCallback(async () => {
    const completedIds = tasks.filter(task => task.completed).map(task => task.id);
    if (completedIds.length === 0) return;
    const { error } = await supabase.from('tasks').delete().in('id', completedIds);
    if (error) {
      console.error('Error clearing completed tasks from Supabase:', error.message);
      return;
    }
    setTasks((prev) => prev.filter((task) => !task.completed));
  }, [tasks]);

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    clearCompletedTasks,
    refreshTasks: loadTasks,
  };
}; 