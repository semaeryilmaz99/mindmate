import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { TaskItem } from '../components/TaskItem';
import { useTasks } from '../hooks/useTasks';
import { Task } from '../types';
import { COLORS } from '../utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../services/AuthContext';

// Define the navigation stack param list
type RootStackParamList = {
  Home: undefined;
  CreateTask: undefined;
  Calendar: undefined;
};

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { tasks, loading, toggleTaskCompletion, deleteTask } = useTasks();
  const { signOut } = useAuth();
  const [showCompleted, setShowCompleted] = useState(false);
  const [sortMode, setSortMode] = useState<'date' | 'priority'>('date');

  // Sorting logic
  const sortTasks = (tasks: Task[]) => {
    if (sortMode === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return [...tasks].sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    } else {
      return [...tasks].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
  };

  const filteredTasks = sortTasks(
    showCompleted ? tasks : tasks.filter(task => !task.completed)
  );

  const handleTaskPress = (task: Task) => {
    // TODO: Navigate to task detail/edit screen
    console.log('Task pressed:', task.title);
  };

  const renderTask = ({ item }: { item: Task }) => (
    <TaskItem
      task={item}
      onToggle={toggleTaskCompletion}
      onPress={handleTaskPress}
      onDelete={deleteTask}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={styles.title}>MindMate</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.navigate('Calendar')} style={styles.calendarButton}>
            <Ionicons name="calendar" size={28} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={signOut} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={28} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.subtitle}>
        {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setShowCompleted(!showCompleted)}
        >
          <Text style={styles.toggleText}>
            {showCompleted ? 'Hide Completed' : 'Show Completed'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setSortMode(sortMode === 'date' ? 'priority' : 'date')}
        >
          <Text style={styles.sortButtonText}>
            {sortMode === 'priority' ? 'Sort by Date' : 'Sort by Priority'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No tasks yet</Text>
      <Text style={styles.emptySubtitle}>
        {showCompleted 
          ? 'No completed tasks to show'
          : 'Add your first task to get started!'
        }
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading tasks...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <FlatList
        data={filteredTasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CreateTask')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100, // Space for FAB
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  toggleButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
  },
  toggleText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: '600',
  },
  sortButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
  },
  sortButtonText: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.surface,
  },
  calendarButton: {
    padding: 8,
  },
  logoutButton: {
    padding: 8,
  },
}); 