import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS } from '../utils/constants';
import { Ionicons } from '@expo/vector-icons';

export const LongTermPlansScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Long Term Plans</Text>
      <View style={styles.illustrationContainer}>
        <Ionicons name="flag-outline" size={96} color={COLORS.primary} />
      </View>
      <Text style={styles.emptyTitle}>You're all done for your long term plans!</Text>
      <Text style={styles.emptySubtitle}>Enjoy planning your future goals.</Text>
      <Text style={styles.shareText}>Share #MindmateZero</Text>
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
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 32,
    marginBottom: 24,
    alignSelf: 'flex-start',
  },
  illustrationContainer: {
    marginVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  shareText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
}); 