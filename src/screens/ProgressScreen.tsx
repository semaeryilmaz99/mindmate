import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Animated, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { supabase } from '../services/supabase';
import { useAuth } from '../services/AuthContext';

const DARK_BG = '#101828';
const CARD_BG = '#1A2233';
const CARD_BORDER = '#232B3B';
const TEXT_PRIMARY = '#fff';
const TEXT_SECONDARY = '#A3AED0';
const BLUE = '#3B82F6';
const BENEFIT_BG = '#22304A';
const PROGRESS_BG = '#22304A';
const PROGRESS_FILL = '#3B82F6';

const HABIT_DEFS = [
  {
    id: 'workout',
    title: 'Workout',
    icon: <MaterialCommunityIcons name="dumbbell" size={40} color={BLUE} />,
    motivation: 'Keep moving, your body will thank you! 💪',
  },
  {
    id: 'reading',
    title: 'Reading',
    icon: <FontAwesome5 name="book-reader" size={36} color={BLUE} />,
    motivation: 'Every page is a step forward. 📚',
  },
  {
    id: 'studying',
    title: 'Studying',
    icon: <Ionicons name="school" size={40} color={BLUE} />,
    motivation: 'Knowledge is your superpower! 🧠',
  },
  {
    id: 'selfcare',
    title: 'Self-care',
    icon: <MaterialCommunityIcons name="spa" size={40} color={BLUE} />,
    motivation: 'Taking care of yourself is productive. 🌱',
  },
  {
    id: 'meditation',
    title: 'Meditation',
    icon: <MaterialCommunityIcons name="meditation" size={40} color={BLUE} />,
    motivation: 'Breathe in calm, breathe out stress. 🧘',
  },
];

const SCREEN_WIDTH = Dimensions.get('window').width;

export const ProgressScreen: React.FC = () => {
  const { user } = useAuth();
  const [userProgress, setUserProgress] = useState({
    workout: 0,
    reading: 0,
    studying: 0,
    selfcare: 0,
    meditation: 0,
  });
  const [loading, setLoading] = useState(false);

  // Animated values for each progress bar
  const animatedValues = useRef(HABIT_DEFS.map((h) => new Animated.Value(0))).current;

  // Fetch progress from Supabase
  const fetchProgress = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('habit_progress')
      .select('habit, progress')
      .eq('user_id', user.id);
    setLoading(false);
    if (error) {
      Alert.alert('Error', 'Could not fetch progress.');
      return;
    }
    const progressObj = { ...userProgress };
    data.forEach(row => {
      progressObj[row.habit] = row.progress;
    });
    setUserProgress(progressObj);
  };

  React.useEffect(() => {
    if (user) fetchProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Animate progress bars when userProgress changes
  React.useEffect(() => {
    HABIT_DEFS.forEach((habit, idx) => {
      Animated.timing(animatedValues[idx], {
        toValue: userProgress[habit.id] || 0,
        duration: 1200 + idx * 300,
        useNativeDriver: false,
      }).start();
    });
  }, [userProgress]);

  // Update progress in Supabase
  const updateProgress = async (habit, newProgress) => {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase
      .from('habit_progress')
      .upsert([
        { user_id: user.id, habit, progress: newProgress }
      ]);
    setLoading(false);
    if (error) {
      Alert.alert('Error', 'Could not update progress.');
      return;
    }
    setUserProgress(prev => ({
      ...prev,
      [habit]: newProgress,
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Your Progress</Text>
        {HABIT_DEFS.map((habit, idx) => {
          const width = animatedValues[idx].interpolate({
            inputRange: [0, 1],
            outputRange: [0, SCREEN_WIDTH - 64],
          });
          const progress = userProgress[habit.id] || 0;
          return (
            <View key={habit.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconBox}>{habit.icon}</View>
                <Text style={styles.habitTitle}>{habit.title}</Text>
              </View>
              <Text style={styles.motivation}>{habit.motivation}</Text>
              <View style={styles.progressBarBg}>
                <Animated.View style={[styles.progressBarFill, { width }]} />
              </View>
              <Text style={styles.progressText}>{Math.round(progress * 100)}% completed</Text>
              <TouchableOpacity
                style={styles.demoBtn}
                disabled={loading}
                onPress={() => updateProgress(habit.id, Math.min(1, progress + 0.1))}
              >
                <Text style={styles.demoBtnText}>{loading ? 'Loading...' : '+ Progress'}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    color: TEXT_PRIMARY,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    marginLeft: 4,
  },
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 18,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconBox: {
    marginRight: 16,
    backgroundColor: BENEFIT_BG,
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  habitTitle: {
    color: TEXT_PRIMARY,
    fontSize: 20,
    fontWeight: 'bold',
  },
  motivation: {
    color: TEXT_SECONDARY,
    fontSize: 15,
    marginBottom: 14,
    marginLeft: 4,
  },
  progressBarBg: {
    width: '100%',
    height: 16,
    backgroundColor: PROGRESS_BG,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: 16,
    backgroundColor: PROGRESS_FILL,
    borderRadius: 8,
  },
  progressText: {
    color: TEXT_SECONDARY,
    fontSize: 14,
    marginLeft: 4,
    marginBottom: 2,
  },
  demoBtn: {
    backgroundColor: BLUE,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-end',
    marginTop: 6,
  },
  demoBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
}); 