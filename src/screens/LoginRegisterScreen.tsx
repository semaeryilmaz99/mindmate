import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../services/AuthContext';
import { COLORS } from '../utils/constants';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const MAIN_RED = '#E44332';

export const LoginRegisterScreen: React.FC = () => {
  const { signIn, signUp, signInWithProvider, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
  const navigation = useNavigation();

  const handleAuth = async () => {
    setError(null);
    setConfirmationMessage(null);
    if (!email || !password) {
      setError('Please enter email and password.');
      return;
    }
    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) {
        if (
          error.message.toLowerCase().includes('invalid login credentials') ||
          error.message.toLowerCase().includes('invalid email or password') ||
          error.message.toLowerCase().includes('wrong password')
        ) {
          setError('Incorrect email or password. Please try again.');
        } else {
          setError(error.message);
        }
      }
    } else {
      const { error, data } = await signUp(email, password);
      if (error) {
        if (
          error.message.toLowerCase().includes('user already registered') ||
          error.message.toLowerCase().includes('user already exists') ||
          error.message.toLowerCase().includes('duplicate key value')
        ) {
          setError('This email is already registered. Please sign in or use a different email.');
        } else {
          setError(error.message);
        }
      } else {
        setConfirmationMessage('Confirm your mail, then enjoy the app');
      }
    }
  };

  // Placeholder for close button (can be used to exit modal or app)
  const handleClose = () => {
    // You can implement navigation.goBack() or exit logic here if needed
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
        <Text style={styles.closeText}>Close</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{isLogin ? 'Log In' : 'Register'}</Text>
      <Text style={styles.subtitle}>Add your email and password.</Text>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>YOUR EMAIL</Text>
        <TextInput
          style={styles.input}
          placeholder=""
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>YOUR PASSWORD</Text>
        <View style={styles.passwordRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder=""
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          {/* Optionally add show/hide password icon here */}
        </View>
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
      {confirmationMessage && <Text style={styles.confirmation}>{confirmationMessage}</Text>}
      <TouchableOpacity
        style={styles.mainButton}
        onPress={handleAuth}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.surface} />
        ) : (
          <Text style={styles.mainButtonText}>{isLogin ? 'Log In' : 'Register'}</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.forgotButton} onPress={() => navigation.navigate('ResetPassword')}>
        <Text style={styles.forgotText}>Forgot your password?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { setIsLogin(!isLogin); setError(null); setConfirmationMessage(null); }}>
        <Text style={styles.switchText}>
          {isLogin ? "Don't have an account? Register" : 'Already have an account? Log In'}
        </Text>
      </TouchableOpacity>
      <View style={styles.socialContainer}>
        <Text style={styles.socialText}>Or sign in with:</Text>
        <View style={styles.socialButtons}>
          <TouchableOpacity
            style={[styles.socialButton, { backgroundColor: '#fff' }]}
            onPress={() => signInWithProvider('google')}
            disabled={loading}
          >
            <Ionicons name="logo-google" size={24} color="#EA4335" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.socialButton, { backgroundColor: '#fff' }]}
            onPress={() => signInWithProvider('github')}
            disabled={loading}
          >
            <Ionicons name="logo-github" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.socialButton, { backgroundColor: '#fff' }]}
            onPress={() => signInWithProvider('facebook')}
            disabled={loading}
          >
            <FontAwesome name="facebook" size={24} color="#1877F3" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 24,
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 48,
    left: 24,
    zIndex: 2,
  },
  closeText: {
    color: MAIN_RED,
    fontSize: 18,
    fontWeight: '500',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 60,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 6,
    fontWeight: '600',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainButton: {
    backgroundColor: MAIN_RED,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  mainButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotButton: {
    alignSelf: 'center',
    marginBottom: 18,
  },
  forgotText: {
    color: MAIN_RED,
    fontSize: 15,
    textDecorationLine: 'underline',
  },
  switchText: {
    color: COLORS.primary,
    fontSize: 15,
    marginBottom: 24,
    alignSelf: 'center',
  },
  error: {
    color: COLORS.error,
    marginBottom: 12,
    fontSize: 15,
    textAlign: 'center',
  },
  confirmation: {
    color: COLORS.success,
    marginBottom: 12,
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  socialContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
  socialText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    marginBottom: 8,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  socialButton: {
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 