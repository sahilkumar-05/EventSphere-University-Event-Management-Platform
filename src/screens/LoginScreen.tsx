import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Image,
} from 'react-native';

import { getData, saveData } from '../services/storage';

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const btnScale = useRef(new Animated.Value(1)).current;

  const animateBtn = () => {
    Animated.sequence([
      Animated.timing(btnScale, { toValue: 0.96, duration: 80, useNativeDriver: true }),
      Animated.timing(btnScale, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
  };

  const validateFields = () => {
    let valid = true;
    setEmailError('');
    setPasswordError('');

    if (!email.trim()) {
      setEmailError('Email is required');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Enter a valid email address');
      valid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password.length < 5) {
      setPasswordError('Password must be at least 5 characters');
      valid = false;
    }

    return valid;
  };

  const loginUser = async (): Promise<void> => {
    animateBtn();
    if (!validateFields()) return;

    setLoading(true);
    try {
      const users = await getData('users');

      if (!users) {
        Alert.alert('No Account Found', 'Please sign up first.');
        setLoading(false);
        return;
      }

      const user = users.find(
        (u: any) =>
          u.email === email &&
          u.password === password,
      );

      if (user) {
        await saveData('currentUser', user);
        navigation.replace('Main');
      } else {
        Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor="#6C63FF" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.orb1} />
          <View style={styles.orb2} />
          <View style={styles.logoBox}>
            
            <Image
              source={require('./assets/logo_app2.png')}
              style={{
                width: 80,
                height: 80,
                borderRadius: 20,
                resizeMode: 'contain',
              }}
            />
          </View>
          <Text style={styles.appTitle}>EventPortal</Text>
          <Text style={styles.headerSub}>Sign in to your account</Text>
        </View>

        {/* Form card */}
        <View style={styles.card}>
          <Text style={styles.heading}>Welcome Back</Text>
          <Text style={styles.subText}>Enter your credentials to continue</Text>

          {/* Email */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={[styles.inputWrapper, emailError ? styles.inputError : null]}>
            
              <TextInput
                placeholder="you@szabist.pk"
                placeholderTextColor="#C4C9D4"
                style={styles.input}
                value={email}
                onChangeText={t => { setEmail(t); setEmailError(''); }}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
            {!!emailError && <Text style={styles.errorText}>{emailError}</Text>}
          </View>

          {/* Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputWrapper, passwordError ? styles.inputError : null]}>
             
              <TextInput
                placeholder="Enter password"
                placeholderTextColor="#C4C9D4"
                secureTextEntry={!showPassword}
                style={styles.input}
                value={password}
                onChangeText={t => { setPassword(t); setPasswordError(''); }}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
               
              </TouchableOpacity>
            </View>
            {!!passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
          </View>

          {/* Login button */}
          <Animated.View style={{ transform: [{ scale: btnScale }] }}>
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={loginUser}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading
                ? <Text style={styles.btnText}>Signing in...</Text>
                : <>
                
                    <Text style={styles.btnText}>  Sign In</Text>
                  </>
              }
            </TouchableOpacity>
          </Animated.View>

          {/* Footer links */}
          <TouchableOpacity
            style={styles.linkBtn}
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={styles.linkText}>
              Don't have an account?{' '}
              <Text style={styles.linkHighlight}>Create Account</Text>
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.adminBtn}
            onPress={() => navigation.navigate('AdminLogin')}
            activeOpacity={0.8}
          >
           
            <Text style={styles.adminText}>  Admin Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, backgroundColor: '#F7F8FC' },
  header: {
    backgroundColor: '#6C63FF',
    paddingTop: 60,
    paddingBottom: 50,
    alignItems: 'center',
    overflow: 'hidden',
  },
  orb1: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.07)', top: -60, right: -50,
  },
  orb2: {
    position: 'absolute', width: 140, height: 140, borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.05)', bottom: -20, left: -40,
  },
  logoBox: {
    width: 70, height: 70, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)',
  },
  appTitle: { fontSize: 26, fontWeight: '800', color: '#fff', letterSpacing: -0.3 },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: -24,
    borderRadius: 20,
    padding: 24,
    elevation: 12,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    marginBottom: 30,
  },
  heading: { fontSize: 22, fontWeight: '800', color: '#1F2937', marginBottom: 4 },
  subText: { fontSize: 13, color: '#9CA3AF', marginBottom: 24 },
  fieldGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#E5E7EB',
    borderRadius: 12, paddingHorizontal: 12,
    backgroundColor: '#FAFAFA',
  },
  inputError: { borderColor: '#EF4444' },
  inputIcon: { marginRight: 8 },
  input: {
    flex: 1, height: 48, fontSize: 14,
    color: '#1F2937',
  },
  eyeBtn: { padding: 4 },
  errorText: { fontSize: 12, color: '#EF4444', marginTop: 4 },
  button: {
    backgroundColor: '#6C63FF',
    height: 52, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    flexDirection: 'row', marginTop: 8,
    elevation: 6,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  buttonDisabled: { opacity: 0.7 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  linkBtn: { marginTop: 16, alignItems: 'center' },
  linkText: { fontSize: 13, color: '#6B7280' },
  linkHighlight: { color: '#6C63FF', fontWeight: '700' },
  divider: {
    flexDirection: 'row', alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  dividerText: { fontSize: 12, color: '#9CA3AF', marginHorizontal: 12 },
  adminBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: '#6C63FF', borderRadius: 14,
    height: 48,
  },
  adminText: { color: '#6C63FF', fontWeight: '700', fontSize: 14 },
});