import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../utils/constants';
import { supabase } from '../services/supabase';

const MAIN_RED = '#E44332';

export const ResetPasswordScreen: React.FC = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
    setLoading(false);
    if (error) setError(error.message);
    else setMessage('If this email is registered, a reset link has been sent.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Forgot your password?</Text>
      <Text style={styles.instructions}>
        To reset your password, please enter the email address of your account.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      {message && <Text style={styles.message}>{message}</Text>}
      <TouchableOpacity
        style={[styles.resetButton, !email.trim() && styles.resetButtonDisabled]}
        onPress={handleReset}
        disabled={!email.trim() || loading}
      >
        <Text style={styles.resetButtonText}>Reset my password</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginLink} onPress={() => navigation.goBack()}>
        <Text style={styles.loginLinkText}>Go to login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: MAIN_RED,
    marginBottom: 16,
    textAlign: 'left',
  },
  instructions: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 24,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  resetButton: {
    backgroundColor: MAIN_RED,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  resetButtonDisabled: {
    backgroundColor: COLORS.border,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginLink: {
    alignItems: 'center',
    marginTop: 8,
  },
  loginLinkText: {
    color: COLORS.primary,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  error: {
    color: COLORS.error,
    marginBottom: 12,
    fontSize: 15,
    textAlign: 'center',
  },
  message: {
    color: COLORS.success,
    marginBottom: 12,
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
}); 