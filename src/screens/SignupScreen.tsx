import React, {
  useState,
  useEffect,
  useRef,
} from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';



import {
  getData,
  saveData,
} from '../services/storage';

export default function SignupScreen({
  navigation,
}: any) {

  const [name, setName] =
    useState('');

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [confirmPassword,
    setConfirmPassword] =
    useState('');

  const [signupSuccess,
    setSignupSuccess] =
    useState(false);

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);

  // field errors
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passError, setPassError] = useState('');
  const [confirmPassError, setConfirmPassError] = useState('');

  const btnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {

    if (signupSuccess) {

      Alert.alert(
        'Success',
        'Account created! Please sign in.'
      );

      navigation.replace(
        'Login'
      );
    }

  }, [signupSuccess]);

  const validateFields = () => {
    let valid = true;
    setNameError(''); setEmailError(''); setPassError(''); setConfirmPassError('');

    if (!name.trim()) { setNameError('Full name is required'); valid = false; }
    else if (name.trim().length < 3) { setNameError('Name must be at least 3 characters'); valid = false; }

    if (!email.trim()) { setEmailError('Email is required'); valid = false; }
    else if (!email.toLowerCase().endsWith('@szabist.pk')) {
      setEmailError('Email must end with @szabist.pk'); valid = false;
    }

    if (!password) { setPassError('Password is required'); valid = false; }
    else if (password.length < 5) { setPassError('Password must be at least 5 characters'); valid = false; }
    else if (!/[A-Z]/.test(password)) { setPassError('Include at least one uppercase letter'); valid = false; }

    if (!confirmPassword) { setConfirmPassError('Please confirm your password'); valid = false; }
    else if (password !== confirmPassword) { setConfirmPassError('Passwords do not match'); valid = false; }

    return valid;
  };

  const registerUser =
    async () => {
      Animated.sequence([
        Animated.timing(btnScale, { toValue: 0.96, duration: 80, useNativeDriver: true }),
        Animated.timing(btnScale, { toValue: 1, duration: 80, useNativeDriver: true }),
      ]).start();

      if (!validateFields()) return;

      setLoading(true);
      try {
        const users =
          (await getData('users')) || [];

        const emailExists =
          users.find(
            (u: any) =>
              u.email === email
          );

        if (emailExists) {
          setEmailError('An account with this email already exists');
          return;
        }

        const newUser = {
          id: Date.now(),
          name: name.trim(),
          email,
          password,
        };

        users.push(newUser);

        await saveData('users', users);

        setSignupSuccess(true);
      } finally {
        setLoading(false);
      }
    };

  const getPasswordStrength = () => {
    if (!password) return null;
    if (password.length < 5) return { label: 'Weak', color: '#EF4444', width: '30%' };
    if (password.length < 8 || !/[A-Z]/.test(password)) return { label: 'Fair', color: '#F59E0B', width: '60%' };
    return { label: 'Strong', color: '#10B981', width: '100%' };
  };

  const strength = getPasswordStrength();

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
        <View style={styles.header}>
          <View style={styles.orb1} />
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
           
          </TouchableOpacity>
          <View style={styles.logoBox}>
           
          </View>
          <Text style={styles.appTitle}>Create Account</Text>
          <Text style={styles.headerSub}>Join EventPortal today</Text>
        </View>

        <View style={styles.card}>

          {/* Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={[styles.inputWrapper, nameError ? styles.inputError : null]}>
             
              <TextInput
                placeholder="Your full name"
                placeholderTextColor="#C4C9D4"
                value={name}
                onChangeText={t => { setName(t); setNameError(''); }}
                style={styles.input}
              />
            </View>
            {!!nameError && <Text style={styles.errorText}>{nameError}</Text>}
          </View>

          {/* Email */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>SZABIST Email</Text>
            <View style={[styles.inputWrapper, emailError ? styles.inputError : null]}>
              
              <TextInput
                placeholder="you@szabist.pk"
                placeholderTextColor="#C4C9D4"
                value={email}
                onChangeText={t => { setEmail(t); setEmailError(''); }}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>
            {!!emailError && <Text style={styles.errorText}>{emailError}</Text>}
          </View>

          {/* Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputWrapper, passError ? styles.inputError : null]}>
             
              <TextInput
                placeholder="Min 5 chars, 1 uppercase"
                placeholderTextColor="#C4C9D4"
                value={password}
                onChangeText={t => { setPassword(t); setPassError(''); }}
                secureTextEntry={!showPass}
                style={styles.input}
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
               
              </TouchableOpacity>
            </View>
            {strength && (
              <View style={styles.strengthContainer}>
                <View style={styles.strengthBar}>
                  <View style={[styles.strengthFill, { width: strength.width as any, backgroundColor: strength.color }]} />
                </View>
                <Text style={[styles.strengthLabel, { color: strength.color }]}>{strength.label}</Text>
              </View>
            )}
            {!!passError && <Text style={styles.errorText}>{passError}</Text>}
          </View>

          {/* Confirm Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={[styles.inputWrapper, confirmPassError ? styles.inputError : null]}>
             
              <TextInput
                placeholder="Re-enter your password"
                placeholderTextColor="#C4C9D4"
                value={confirmPassword}
                onChangeText={t => { setConfirmPassword(t); setConfirmPassError(''); }}
                secureTextEntry={!showConfirmPass}
                style={styles.input}
              />
              <TouchableOpacity onPress={() => setShowConfirmPass(!showConfirmPass)} style={styles.eyeBtn}>
                
              </TouchableOpacity>
            </View>
            {!!confirmPassError && <Text style={styles.errorText}>{confirmPassError}</Text>}
          </View>

          <Animated.View style={{ transform: [{ scale: btnScale }] }}>
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={registerUser}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading
                ? <Text style={styles.btnText}>Creating Account...</Text>
                : <>
                    
                    <Text style={styles.btnText}>  Create Account</Text>
                  </>
              }
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity
            style={styles.linkBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.linkText}>
              Already have an account?{' '}
              <Text style={styles.linkHighlight}>Sign In</Text>
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, backgroundColor: '#F7F8FC' },
  header: {
    backgroundColor: '#6C63FF',
    paddingTop: 50,
    paddingBottom: 50,
    alignItems: 'center',
    overflow: 'hidden',
  },
  orb1: {
    position: 'absolute', width: 220, height: 220, borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.07)', top: -60, right: -60,
  },
  backBtn: {
    position: 'absolute', top: 50, left: 20,
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  logoBox: {
    width: 70, height: 70, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)',
  },
  appTitle: { fontSize: 24, fontWeight: '800', color: '#fff', letterSpacing: -0.3 },
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
  fieldGroup: { marginBottom: 14 },
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
  strengthContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  strengthBar: {
    flex: 1, height: 4, backgroundColor: '#E5E7EB',
    borderRadius: 2, marginRight: 8, overflow: 'hidden',
  },
  strengthFill: { height: '100%', borderRadius: 2 },
  strengthLabel: { fontSize: 11, fontWeight: '700', width: 44, textAlign: 'right' },
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
  linkBtn: { marginTop: 18, alignItems: 'center' },
  linkText: { fontSize: 13, color: '#6B7280' },
  linkHighlight: { color: '#6C63FF', fontWeight: '700' },
});