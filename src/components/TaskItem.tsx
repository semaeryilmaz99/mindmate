import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator, FlatList } from 'react-native';
import { Task } from '../types';
import { COLORS, PRIORITY_COLORS } from '../utils/constants';
import { formatDueDate, isOverdue } from '../utils/helpers';
import { useSubtasks } from '../hooks/useSubtasks';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onPress: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onPress, onDelete }) => {
  const priorityColor = PRIORITY_COLORS[task.priority];
  const isTaskOverdue = isOverdue(task);
  const { subtasks, loading, fetchSubtasks, addSubtask, toggleSubtask, deleteSubtask } = useSubtasks(task.id);
  const [newSubtask, setNewSubtask] = useState('');

  useEffect(() => {
    fetchSubtasks();
  }, [fetchSubtasks]);

  const handleAddSubtask = async () => {
    if (!newSubtask.trim()) return;
    await addSubtask(newSubtask.trim());
    setNewSubtask('');
  };

  return (
    <View style={[styles.container, task.completed && styles.completed]}>
      <TouchableOpacity
        style={[styles.checkbox, task.completed && styles.checkboxCompleted]}
        onPress={() => onToggle(task.id)}
      >
        {task.completed && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>
      <View style={styles.content}>
        <Text style={[styles.title, task.completed && styles.titleCompleted]}>
          {task.title}
        </Text>
        {task.description && (
          <Text style={[styles.description, task.completed && styles.descriptionCompleted]}>
            {task.description}
          </Text>
        )}
        <View style={styles.meta}>
          <View style={[styles.priority, { backgroundColor: priorityColor }]}> 
            <Text style={styles.priorityText}>{task.priority}</Text>
          </View>
          {task.dueDate && (
            <Text style={[
              styles.dueDate,
              isTaskOverdue && styles.overdue
            ]}>
              {formatDueDate(task.dueDate)}
            </Text>
          )}
        </View>
        {/* Subtasks Section */}
        <View style={styles.subtasksSection}>
          <Text style={styles.subtasksHeader}>Subtasks</Text>
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <FlatList
              data={subtasks}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.subtaskItem}>
                  <TouchableOpacity
                    style={[styles.subtaskCheckbox, item.completed && styles.subtaskCheckboxCompleted]}
                    onPress={() => toggleSubtask(item.id, !item.completed)}
                  >
                    {item.completed && <Text style={styles.subtaskCheckmark}>✓</Text>}
                  </TouchableOpacity>
                  <Text style={[styles.subtaskTitle, item.completed && styles.subtaskTitleCompleted]}>
                    {item.title}
                  </Text>
                  <TouchableOpacity style={styles.subtaskDeleteButton} onPress={() => deleteSubtask(item.id)}>
                    <Text style={styles.subtaskDeleteButtonText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              )}
              ListEmptyComponent={<Text style={styles.emptySubtask}>No subtasks yet.</Text>}
            />
          )}
          <View style={styles.addSubtaskRow}>
            <TextInput
              style={styles.addSubtaskInput}
              placeholder="Add a subtask..."
              value={newSubtask}
              onChangeText={setNewSubtask}
              onSubmitEditing={handleAddSubtask}
              returnKeyType="done"
            />
            <TouchableOpacity style={styles.addSubtaskButton} onPress={handleAddSubtask}>
              <Text style={styles.addSubtaskButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(task.id)}>
        <Text style={styles.deleteButtonText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.surface,
    padding: 16,
    marginVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completed: {
    opacity: 0.6,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCompleted: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  checkmark: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.textSecondary,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  descriptionCompleted: {
    textDecorationLine: 'line-through',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priority: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.surface,
    textTransform: 'uppercase',
  },
  dueDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  overdue: {
    color: COLORS.error,
    fontWeight: '600',
  },
  deleteButton: {
    marginLeft: 12,
    alignSelf: 'center',
    padding: 4,
  },
  deleteButtonText: {
    fontSize: 18,
    color: COLORS.error,
  },
  subtasksSection: {
    marginTop: 12,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 8,
  },
  subtasksHeader: {
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
    fontSize: 15,
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  subtaskCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtaskCheckboxCompleted: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  subtaskCheckmark: {
    color: COLORS.surface,
    fontSize: 13,
    fontWeight: 'bold',
  },
  subtaskTitle: {
    fontSize: 15,
    color: COLORS.text,
    flex: 1,
  },
  subtaskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.textSecondary,
  },
  subtaskDeleteButton: {
    marginLeft: 8,
    padding: 2,
  },
  subtaskDeleteButtonText: {
    fontSize: 15,
    color: COLORS.error,
  },
  addSubtaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  addSubtaskInput: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 8,
    fontSize: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
  },
  addSubtaskButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  addSubtaskButtonText: {
    color: COLORS.surface,
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptySubtask: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 4,
  },
}); 