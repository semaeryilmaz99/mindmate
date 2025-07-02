import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS } from '../utils/constants';
import { Ionicons } from '@expo/vector-icons';

export const ProgressScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="stats-chart-outline" size={96} color={COLORS.primary} />
      </View>
      <Text style={styles.title}>Progress</Text>
      <Text style={styles.subtitle}>Track your productivity and achievements here soon!</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
}); 