
import React, {
  useEffect,
  useState,
  useRef,
} from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  StatusBar,
  Dimensions,
} from 'react-native';

import {
  getData,
} from '../services/storage';

import { useFocusEffect } from '@react-navigation/native';


const { width } = Dimensions.get('window');

// Simple bar chart component (no external lib needed)
function BarChart({ data, labels, color }: { data: number[]; labels: string[]; color: string }) {
  const maxVal = Math.max(...data, 1);
  const barW = (width - 80) / data.length - 10;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 100, marginTop: 8 }}>
      {data.map((val, i) => {
        const barH = (val / maxVal) * 90;
        return (
          <View key={i} style={{ alignItems: 'center', flex: 1 }}>
            <Text style={{ fontSize: 10, color: '#6B7280', marginBottom: 2, fontWeight: '700' }}>
              {val}
            </Text>
            <Animated.View
              style={{
                width: barW > 0 ? barW : 20,
                height: barH || 4,
                backgroundColor: color,
                borderRadius: 6,
              }}
            />
            <Text style={{ fontSize: 9, color: '#9CA3AF', marginTop: 4, textAlign: 'center' }}>
              {labels[i]}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

// Donut-style ring stat
function RingCard({ value, total, label, color }: { value: number; total: number; label: string; color: string }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <View style={[ringStyles.ring, { borderColor: color }]}>
      <Text style={[ringStyles.ringNum, { color }]}>{value}</Text>
      <Text style={ringStyles.ringPct}>{pct}%</Text>
      <Text style={ringStyles.ringLabel}>{label}</Text>
    </View>
  );
}

const ringStyles = StyleSheet.create({
  ring: {
    width: 90, height: 90, borderRadius: 45,
    borderWidth: 5, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#fff',
  },
  ringNum: { fontSize: 20, fontWeight: '800' },
  ringPct: { fontSize: 10, color: '#9CA3AF' },
  ringLabel: { fontSize: 9, color: '#6B7280', textAlign: 'center' },
});

export default function AdminDashboard({
  navigation,
}: any) {

  const [users, setUsers] =
    useState(0);

  const [events, setEvents] =
    useState(0);

  const [
    registrations,
    setRegistrations,
  ] = useState(0);

  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [topEvents, setTopEvents] = useState<{ title: string; count: number }[]>([]);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const loadData =
    async () => {

      const userData =
        (await getData(
          'users'
        )) || [];

      const eventData =
        (await getData(
          'events'
        )) || [];

      const registrationData =
        (await getData(
          'registrations'
        )) || [];

      setUsers(
        userData.length
      );

      setEvents(
        eventData.length
      );

      setRegistrations(
        registrationData.length
      );

      // Recent events sorted by date
      const sorted = [...eventData].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setRecentEvents(sorted.slice(0, 5));

      // Per-event registration count
      const counts: Record<number, number> = {};
      registrationData.forEach((r: any) => {
        counts[r.eventId] = (counts[r.eventId] || 0) + 1;
      });
      const top = eventData
        .map((e: any) => ({ title: e.title, count: counts[e.id] || 0 }))
        .sort((a: any, b: any) => b.count - a.count)
        .slice(0, 5);
      setTopEvents(top);
    };

  const STAT_CARDS = [
    { icon: 'people', label: 'Total Users', value: users, color: '#6C63FF', bg: '#EDE9FF' },
    { icon: 'calendar', label: 'Total Events', value: events, color: '#0EA5E9', bg: '#E0F2FE' },
    { icon: 'checkmark-circle', label: 'Registrations', value: registrations, color: '#10B981', bg: '#D1FAE5' },
  ];

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <StatusBar barStyle="light-content" backgroundColor="#1E1B4B" />

      {/* Admin Header */}
      <View style={styles.adminHeader}>
        <View style={styles.headerOrb} />
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.adminLabel}>ADMIN PANEL</Text>
            <Text style={styles.adminTitle}>Admin Dashboard</Text>
          </View>
        
        </View>
        <Text style={styles.adminSub}>
          EventPortal Management System
        </Text>
      </View>

      <Animated.View style={{ opacity: fadeAnim }}>

        {/* Stat Cards Row */}
        <View style={styles.statRow}>
          {STAT_CARDS.map((card, i) => (
            <View key={i} style={[styles.statCard, { backgroundColor: card.bg }]}>
              
              <Text style={[styles.statNum, { color: card.color }]}>{card.value}</Text>
              <Text style={styles.statLabel}>{card.label}</Text>
            </View>
          ))}
        </View>

        {/* Registrations Bar Chart */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            
            <Text style={styles.chartTitle}> Event Registrations</Text>
          </View>
          {topEvents.length > 0 ? (
            <BarChart
              data={topEvents.map(e => e.count)}
              labels={topEvents.map(e =>
                e.title.length > 8 ? e.title.slice(0, 7) + '…' : e.title
              )}
              color="#6C63FF"
            />
          ) : (
            <View style={styles.noData}>
              
              <Text style={styles.noDataText}>No registration data yet</Text>
            </View>
          )}
        </View>

        {/* Overview Rings */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            
            <Text style={styles.chartTitle}> Overview</Text>
          </View>
          <View style={styles.ringsRow}>
            <RingCard value={events} total={events + users} label="Events" color="#6C63FF" />
            <RingCard value={users} total={events + users} label="Users" color="#0EA5E9" />
            <RingCard value={registrations} total={Math.max(registrations, events * users, 1)} label="Signups" color="#10B981" />
          </View>
        </View>

        {/* Recent Events List */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
           
            <Text style={styles.chartTitle}> Recent Events</Text>
          </View>
          {recentEvents.length === 0 ? (
            <View style={styles.noData}>
            
              <Text style={styles.noDataText}>No events added yet</Text>
            </View>
          ) : (
            recentEvents.map((ev, i) => (
              <View key={ev.id} style={styles.eventRow}>
                <View style={[styles.eventIndex, { backgroundColor: i === 0 ? '#6C63FF' : '#F3F4F6' }]}>
                  <Text style={{ color: i === 0 ? '#fff' : '#6B7280', fontWeight: '700', fontSize: 12 }}>
                    {i + 1}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.eventRowTitle} numberOfLines={1}>{ev.title}</Text>
                  <Text style={styles.eventRowDate}>📅 {ev.date}  📍 {ev.venue}</Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={
            styles.button
          }
          onPress={() =>
            navigation.navigate(
              'ManageEvents'
            )
          }>
        
          <Text
            style={
              styles.btnText
            }>
            {' '}Manage Events
          </Text>
        
        </TouchableOpacity>
<TouchableOpacity
  style={styles.exitButton}
  onPress={() => navigation.replace('Login')}
>
  <Text style={styles.exitBtnText}>Exit</Text>
</TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: '#F7F8FC',
    },
    exitButton: {
  backgroundColor: '#EF4444',
  padding: 16,
  borderRadius: 16,
  marginHorizontal: 16,
  marginTop: 12,
  alignItems: 'center',
  elevation: 4,
},

exitBtnText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
},

    adminHeader: {
      backgroundColor: '#1E1B4B',
      paddingTop: 54,
      paddingHorizontal: 20,
      paddingBottom: 28,
      borderBottomLeftRadius: 28,
      borderBottomRightRadius: 28,
      overflow: 'hidden',
      elevation: 8,
      shadowColor: '#1E1B4B',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
    },
    headerOrb: {
      position: 'absolute', width: 200, height: 200, borderRadius: 100,
      backgroundColor: 'rgba(255,255,255,0.05)', top: -60, right: -40,
    },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
    adminLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '700', letterSpacing: 1.5 },
    adminTitle: { color: '#fff', fontSize: 26, fontWeight: '800' },
    adminSub: { color: 'rgba(255,255,255,0.55)', fontSize: 13 },
    adminBadge: {
      width: 48, height: 48, borderRadius: 16,
      backgroundColor: 'rgba(255,255,255,0.15)',
      alignItems: 'center', justifyContent: 'center',
    },

    statRow: {
      flexDirection: 'row', justifyContent: 'space-between',
      marginHorizontal: 16, marginTop: 20, marginBottom: 4,
    },
    statCard: {
      flex: 1, marginHorizontal: 4, borderRadius: 16, padding: 14,
      alignItems: 'center', elevation: 2,
      shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05, shadowRadius: 4,
    },
    statIcon: {
      width: 40, height: 40, borderRadius: 12,
      alignItems: 'center', justifyContent: 'center', marginBottom: 8,
    },
    statNum: { fontSize: 22, fontWeight: '800', marginBottom: 2 },
    statLabel: { fontSize: 10, color: '#6B7280', fontWeight: '600', textAlign: 'center' },

    chartCard: {
      backgroundColor: '#fff',
      marginHorizontal: 16,
      marginTop: 16,
      borderRadius: 18,
      padding: 18,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    chartHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
    chartTitle: { fontSize: 15, fontWeight: '800', color: '#1F2937' },

    noData: { alignItems: 'center', paddingVertical: 20 },
    noDataText: { color: '#9CA3AF', marginTop: 8, fontSize: 13 },

    ringsRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 12 },

    eventRow: {
      flexDirection: 'row', alignItems: 'center',
      paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F3F4F6',
    },
    eventIndex: {
      width: 28, height: 28, borderRadius: 8,
      alignItems: 'center', justifyContent: 'center', marginRight: 12,
    },
    eventRowTitle: { fontSize: 14, fontWeight: '700', color: '#1F2937', marginBottom: 2 },
    eventRowDate: { fontSize: 11, color: '#9CA3AF' },

    button: {
      backgroundColor: '#6C63FF',
      padding: 16,
      borderRadius: 16,
      marginHorizontal: 16,
      marginTop: 20,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      elevation: 6,
      shadowColor: '#6C63FF',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 10,
    },

    btnText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
      flex: 1,
      textAlign: 'center',
    },

  });
