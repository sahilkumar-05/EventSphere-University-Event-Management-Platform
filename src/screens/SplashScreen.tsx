import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';


const { height } = Dimensions.get('window');

interface SplashScreenProps {
  navigation: any;
}

export default function SplashScreen({ navigation }: SplashScreenProps) {
  const slideUp = useRef(new Animated.Value(0)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade & scale logo in
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();

    // Tagline fade in
    setTimeout(() => {
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 500);

    // Slide entire screen up and navigate
    setTimeout(() => {
      Animated.timing(slideUp, {
        toValue: -height,
        duration: 700,
        useNativeDriver: true,
      }).start(() => {
        navigation.replace('Login');
      });
    }, 2500);
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY: slideUp }] },
      ]}
    >
      <StatusBar barStyle="light-content" backgroundColor="#6C63FF" />

      {/* Background orbs */}
      <View style={styles.orb1} />
      <View style={styles.orb2} />
      <View style={styles.orb3} />

      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <View style={styles.iconWrapper}>
  <Image
    source={require('./assets/logo_app2.png')}
    style={styles.logo}
    resizeMode="contain"
  />
</View>

        <Text style={styles.appName}>EventPortal</Text>

        <Animated.View style={{ opacity: taglineOpacity }}>
          <Text style={styles.tagline}>SZABIST University Events</Text>
          <View style={styles.divider} />
          <Text style={styles.sub}>Discover · Register · Attend</Text>
        </Animated.View>
      </Animated.View>

      <Animated.View style={[styles.footer, { opacity: taglineOpacity }]}>
        <Text style={styles.footerText}>Powered by SAHIL-SANJNA-SANTOSH-MONISH</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
    height: height,
  },
  logo: {
  width: 90,
  height: 90,
  borderRadius: 20,
},
  orb1: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(255,255,255,0.07)',
    top: -60,
    right: -80,
  },
  orb2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.05)',
    bottom: 80,
    left: -60,
  },
  orb3: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.06)',
    bottom: 200,
    right: 30,
  },
  logoContainer: {
    alignItems: 'center',
  },
  iconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  appName: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 16,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 3,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  divider: {
    width: 40,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.4)',
    alignSelf: 'center',
    marginVertical: 12,
    borderRadius: 2,
  },
  sub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    letterSpacing: 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: 48,
  },
  footerText: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 12,
    letterSpacing: 1,
  },
});