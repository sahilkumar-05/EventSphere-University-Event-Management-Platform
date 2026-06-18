import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Image,
} from 'react-native';

export default function AdminLoginScreen({ navigation }: any) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const loginAdmin = () => {
    if (username === 'admin' && password === 'admin123') {
      navigation.replace('AdminDashboard');
    } else {
      Alert.alert('Invalid Admin Credentials');
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
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.appTitle}>Admin Portal</Text>
          <Text style={styles.headerSub}>
            Administrator Access Only
          </Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.heading}>Admin Login</Text>

          <Text style={styles.subText}>
            Enter your admin credentials
          </Text>

          {/* Username */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Username</Text>

            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Enter username"
                placeholderTextColor="#C4C9D4"
                style={styles.input}
                value={username}
                onChangeText={setUsername}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>

            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Enter password"
                placeholderTextColor="#C4C9D4"
                secureTextEntry={!showPassword}
                style={styles.input}
                value={password}
                onChangeText={setPassword}
              />

              <TouchableOpacity
                onPress={() =>
                  setShowPassword(!showPassword)
                }
              >
                <Text style={{ color: '#6C63FF' }}>
                  {showPassword ? 'Hide' : 'Show'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={loginAdmin}
          >
            <Text style={styles.btnText}>
              Login as Admin
            </Text>
          </TouchableOpacity>

          {/* Back */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>
              Back to User Login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    backgroundColor: '#F7F8FC',
  },

  header: {
    backgroundColor: '#6C63FF',
    paddingTop: 60,
    paddingBottom: 50,
    alignItems: 'center',
    overflow: 'hidden',
  },

  orb1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.07)',
    top: -60,
    right: -50,
  },

  orb2: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.05)',
    bottom: -20,
    left: -40,
  },

  logoBox: {
    width: 85,
    height: 85,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  logo: {
    width: 80,
    height: 80,
    borderRadius: 22,
  },

  appTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
  },

  headerSub: {
    color: 'rgba(255,255,255,0.75)',
    marginTop: 4,
  },

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
  },

  heading: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
  },

  subText: {
    color: '#9CA3AF',
    marginTop: 4,
    marginBottom: 24,
  },

  fieldGroup: {
    marginBottom: 16,
  },

  label: {
    fontWeight: '600',
    marginBottom: 6,
    color: '#374151',
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#FAFAFA',
  },

  input: {
    flex: 1,
    height: 48,
    color: '#1F2937',
  },

  button: {
    backgroundColor: '#6C63FF',
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },

  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  backBtn: {
    marginTop: 16,
    alignItems: 'center',
  },

  backText: {
    color: '#6C63FF',
    fontWeight: '600',
  },
});