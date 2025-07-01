import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, SafeAreaView, Modal } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTasks } from '../hooks/useTasks';
import { COLORS, PRIORITY_COLORS } from '../utils/constants';
import { Task } from '../types';

// Define the navigation stack param list
type RootStackParamList = {
  Home: undefined;
  CreateTask: undefined;
  Calendar: undefined;
};

// Optional: Set calendar locale
LocaleConfig.locales['en'] = {
  monthNames: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ],
  monthNamesShort: [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ],
  dayNames: [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  today: 'Today'
};
LocaleConfig.defaultLocale = 'en';

export const CalendarScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { tasks, addTask } = useTasks();
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  // Filter tasks for the selected date
  const tasksForDate = useMemo(() =>
    tasks.filter(
      (task) =>
        task.dueDate &&
        new Date(task.dueDate).toISOString().split('T')[0] === selectedDate
    ),
    [tasks, selectedDate]
  );

  // Mark dates with tasks
  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};
    tasks.forEach((task) => {
      if (task.dueDate) {
        const dateStr = new Date(task.dueDate).toISOString().split('T')[0];
        marks[dateStr] = marks[dateStr] || { marked: true, dots: [], customStyles: {} };
        marks[dateStr].marked = true;
        marks[dateStr].dotColor = PRIORITY_COLORS[task.priority];
        marks[dateStr].customStyles = {
          container: {
            backgroundColor: PRIORITY_COLORS[task.priority],
            borderRadius: 8,
          },
          text: {
            color: '#fff',
            fontWeight: 'bold',
          },
        };
      }
    });
    marks[selectedDate] = marks[selectedDate] || {};
    marks[selectedDate].selected = true;
    marks[selectedDate].selectedColor = COLORS.primary;
    return marks;
  }, [tasks, selectedDate]);

  const handleAddTask = async () => {
    if (!title.trim()) return;
    await addTask({
      title: title.trim(),
      description: description.trim(),
      completed: false,
      priority,
      dueDate: new Date(selectedDate),
    });
    setTitle('');
    setDescription('');
    setPriority('medium');
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.header}>Calendar</Text>
        <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="list" size={28} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      <Calendar
        style={styles.calendar}
        markedDates={markedDates}
        markingType={'custom'}
        theme={{
          backgroundColor: COLORS.background,
          calendarBackground: COLORS.background,
          textSectionTitleColor: COLORS.primary,
          selectedDayBackgroundColor: COLORS.primary,
          selectedDayTextColor: '#fff',
          todayTextColor: COLORS.accent,
          dayTextColor: COLORS.text,
          textDisabledColor: COLORS.textSecondary,
          dotColor: COLORS.accent,
          arrowColor: COLORS.primary,
          monthTextColor: COLORS.primary,
          indicatorColor: COLORS.primary,
          textDayFontWeight: '600',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '600',
          textDayFontSize: 16,
          textMonthFontSize: 20,
          textDayHeaderFontSize: 14,
        }}
        onDayPress={(day) => setSelectedDate(day.dateString)}
      />
      <View style={styles.taskListHeader}>
        <Text style={styles.taskListTitle}>Tasks for {selectedDate}</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>+ Add Task</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={tasksForDate}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text style={[styles.taskTitle, { color: PRIORITY_COLORS[item.priority] }]}>{item.title}</Text>
            {item.description ? (
              <Text style={styles.taskDescription}>{item.description}</Text>
            ) : null}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No tasks for this day.</Text>}
        contentContainerStyle={{ flexGrow: 1 }}
      />
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Task for {selectedDate}</Text>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Description (optional)"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />
            <View style={styles.priorityContainer}>
              <Text style={styles.priorityLabel}>Priority:</Text>
              {(['low', 'medium', 'high'] as const).map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[styles.priorityButton, priority === level && styles.priorityButtonSelected, { backgroundColor: PRIORITY_COLORS[level] }]}
                  onPress={() => setPriority(level)}
                >
                  <Text style={priority === level ? styles.priorityTextSelected : styles.priorityText}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={[styles.saveButton, !title.trim() && styles.saveButtonDisabled]}
              onPress={handleAddTask}
              disabled={!title.trim()}
            >
              <Text style={styles.saveButtonText}>Save Task</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 0,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 16,
    marginBottom: 8,
    alignSelf: 'center',
  },
  calendar: {
    borderRadius: 16,
    margin: 16,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  taskListHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 4,
  },
  taskListTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    elevation: 2,
  },
  addButtonText: {
    color: COLORS.surface,
    fontWeight: 'bold',
    fontSize: 14,
  },
  taskItem: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  taskDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    marginTop: 32,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 24,
    width: '90%',
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  textarea: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  priorityLabel: {
    fontSize: 16,
    color: COLORS.text,
    marginRight: 12,
  },
  priorityButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
    backgroundColor: COLORS.surface,
  },
  priorityButtonSelected: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  priorityText: {
    color: COLORS.text,
    fontWeight: '600',
  },
  priorityTextSelected: {
    color: COLORS.surface,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  saveButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  cancelButtonText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    marginHorizontal: 16,
  },
  homeButton: {
    padding: 8,
  },
}); 