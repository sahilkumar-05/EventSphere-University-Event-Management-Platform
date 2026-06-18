import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Animated,
  StatusBar,
  Dimensions,
} from 'react-native';

import { getData } from '../services/storage';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const CATEGORY_CARDS = [
  { icon: '💻', label: 'Tech Events', color: '#6C63FF', bg: '#EDE9FF' },
  { icon: '🎓', label: 'Workshops', color: '#0EA5E9', bg: '#E0F2FE' },
  { icon: '🏆', label: 'Competitions', color: '#F59E0B', bg: '#FEF3C7' },
  { icon: '🎤', label: 'Seminars', color: '#10B981', bg: '#D1FAE5' },
];

export default function DashboardScreen({ navigation }: any) {
  const [user, setUser] = useState<any>(null);
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [registrationCount, setRegistrationCount] = useState(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useFocusEffect(
    React.useCallback(() => {
      loadUser();
    }, [])
  );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const loadUser = async () => {
    const currentUser = await getData('currentUser');
    setUser(currentUser);

    const allEvents = (await getData('events')) || [];
    const sorted = [...allEvents].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    const upcoming = sorted.filter(e => new Date(e.date) >= new Date());
    setRecentEvents(upcoming.slice(0, 5).length > 0 ? upcoming.slice(0, 5) : sorted.slice(0, 5));

    const allRegistrations = (await getData('registrations')) || [];
    const userRegs = allRegistrations.filter(
      (r: any) => r.userEmail === currentUser?.email
    );
    setRegistrationCount(userRegs.length);
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <StatusBar barStyle="light-content" backgroundColor="#6C63FF" />

      {/* Hero Header */}
      <View style={styles.heroHeader}>
        <View style={styles.headerOrb1} />
        <View style={styles.headerOrb2} />
        <View style={styles.headerOrb3} />

        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>{getGreeting()} 👋</Text>
              <Text style={styles.userName}>{user?.name ?? 'Student'}</Text>
            </View>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
          </View>

          <View style={styles.portalBadge}>
           
            <Text style={styles.portalText}> Welcome to EventPortal</Text>
          </View>
        </Animated.View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{recentEvents.length}</Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{registrationCount}</Text>
            <Text style={styles.statLabel}>Registered</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNum}>
              {recentEvents.filter(e => new Date(e.date) >= new Date()).length}
            </Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
        </View>
      </View>

      {/* Recent Events Horizontal Scroll */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Events')}>
          <Text style={styles.seeAll}>See All →</Text>
        </TouchableOpacity>
      </View>

      {recentEvents.length === 0 ? (
        <View style={styles.emptyEvents}>
         
          <Text style={styles.emptyText}>No events yet</Text>
        </View>
      ) : (
        <FlatList
          data={recentEvents}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 4 }}
          renderItem={({ item, index }) => {
            const colors = ['#6C63FF', '#0EA5E9', '#F59E0B', '#10B981', '#EF4444'];
            const cardColor = colors[index % colors.length];
            return (
              <TouchableOpacity
                style={[styles.eventCard, { borderTopColor: cardColor }]}
                onPress={() => navigation.navigate('EventDetails', { event: item })}
                activeOpacity={0.85}
              >
                <View style={[styles.eventDotBadge, { backgroundColor: cardColor }]}>
                 
                 
                </View>
                <Text style={styles.eventCardDate}>{formatDate(item.date)}</Text>
                <Text style={styles.eventCardTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.eventCardVenue} numberOfLines={1}>
                  📍 {item.venue}
                </Text>
                <View style={[styles.detailsChip, { backgroundColor: cardColor + '18' }]}>
                  <Text style={[styles.detailsChipText, { color: cardColor }]}>View Details</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}

      {/* Categories */}
      <Text style={[styles.sectionTitle, { marginHorizontal: 16, marginTop: 24, marginBottom: 12 }]}>
        Browse Categories
      </Text>
      <View style={styles.categoryGrid}>
        {CATEGORY_CARDS.map((cat, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.categoryCard, { backgroundColor: cat.bg }]}
            onPress={() => navigation.navigate('Events')}
            activeOpacity={0.8}
          >
            <Text style={styles.categoryIcon}>{cat.icon}</Text>
            <Text style={[styles.categoryLabel, { color: cat.color }]}>{cat.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.navigate('Events')}
        >
          
          <Text style={styles.actionText}>Browse All Events</Text>
          
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.navigate('Profile')}
        >
         
          <Text style={styles.actionText}>My Registrations</Text>
        
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FC' },

  heroHeader: {
    backgroundColor: '#6C63FF',
    paddingTop: 54,
    paddingHorizontal: 20,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  headerOrb1: {
    position: 'absolute', width: 220, height: 220, borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.07)', top: -70, right: -50,
  },
  headerOrb2: {
    position: 'absolute', width: 150, height: 150, borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.05)', bottom: -30, left: -40,
  },
  headerOrb3: {
    position: 'absolute', width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.06)', bottom: 10, right: 60,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  greeting: { color: 'rgba(255,255,255,0.75)', fontSize: 14, fontWeight: '500' },
  userName: { color: '#fff', fontSize: 26, fontWeight: '800', marginTop: 2 },
  avatarCircle: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 20 },
  portalBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: 20, marginBottom: 20,
  },
  portalText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  statsRow: {
    flexDirection: 'row', justifyContent: 'space-around',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16, paddingVertical: 12,
  },
  statBox: { alignItems: 'center', flex: 1 },
  statNum: { color: '#fff', fontSize: 22, fontWeight: '800' },
  statLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: '600', marginTop: 2 },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },

  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginHorizontal: 16, marginTop: 24, marginBottom: 12,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937' },
  seeAll: { fontSize: 13, color: '#6C63FF', fontWeight: '700' },

  emptyEvents: { alignItems: 'center', paddingVertical: 30 },
  emptyText: { color: '#9CA3AF', marginTop: 8, fontSize: 14 },

  eventCard: {
    width: width * 0.55,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginRight: 12,
    elevation: 5,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    borderTopWidth: 4,
  },
  eventDotBadge: {
    width: 26, height: 26, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  eventCardDate: { fontSize: 11, color: '#9CA3AF', fontWeight: '700', letterSpacing: 0.5, marginBottom: 4 },
  eventCardTitle: { fontSize: 15, fontWeight: '800', color: '#1F2937', marginBottom: 6 },
  eventCardVenue: { fontSize: 12, color: '#6B7280', marginBottom: 12 },
  detailsChip: {
    alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10,
  },
  detailsChipText: { fontSize: 12, fontWeight: '700' },

  categoryGrid: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  categoryCard: {
    width: '48%', borderRadius: 16, padding: 18,
    alignItems: 'center', marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  categoryIcon: { fontSize: 30, marginBottom: 8 },
  categoryLabel: { fontSize: 13, fontWeight: '700' },

  quickActions: { marginHorizontal: 16, marginTop: 8 },
  actionBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 14, padding: 16,
    marginBottom: 10, elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 4,
  },
  actionText: { flex: 1, marginLeft: 12, fontWeight: '600', color: '#1F2937', fontSize: 14 },
});
