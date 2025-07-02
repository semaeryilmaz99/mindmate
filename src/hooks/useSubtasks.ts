import { useState, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { Subtask } from '../types';

export const useSubtasks = (taskId: string) => {
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubtasks = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('subtasks')
      .select('*')
      .eq('task_id', taskId)
      .order('created_at', { ascending: true });
    if (error) {
      console.error('Error fetching subtasks:', error.message);
      setSubtasks([]);
    } else {
      setSubtasks(
        (data || []).map((s: any) => ({ ...s, created_at: new Date(s.created_at) }))
      );
    }
    setLoading(false);
  }, [taskId]);

  const addSubtask = useCallback(async (title: string) => {
    const { data, error } = await supabase
      .from('subtasks')
      .insert([{ task_id: taskId, title, completed: false }])
      .select();
    if (error) {
      console.error('Error adding subtask:', error.message);
      return;
    }
    if (data && data.length > 0) {
      setSubtasks((prev) => [...prev, { ...data[0], created_at: new Date(data[0].created_at) }]);
    }
  }, [taskId]);

  const toggleSubtask = useCallback(async (id: string, completed: boolean) => {
    const { data, error } = await supabase
      .from('subtasks')
      .update({ completed })
      .eq('id', id)
      .select();
    if (error) {
      console.error('Error updating subtask:', error.message);
      return;
    }
    setSubtasks((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed } : s))
    );
  }, []);

  const deleteSubtask = useCallback(async (id: string) => {
    const { error } = await supabase.from('subtasks').delete().eq('id', id);
    if (error) {
      console.error('Error deleting subtask:', error.message);
      return;
    }
    setSubtasks((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return {
    subtasks,
    loading,
    fetchSubtasks,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
  };
}; 