
import React, {
useEffect,
useState,
} from 'react';

import {
View,
Text,
ScrollView,
StyleSheet,
TouchableOpacity,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
getData,
} from '../services/storage';

import { useFocusEffect } from '@react-navigation/native';


export default function ProfileScreen({
navigation,
}: any) {

const [user, setUser] =
useState<any>(null);

const [
registrations,
setRegistrations,
] = useState<any[]>([]);

useFocusEffect(
  React.useCallback(() => {
    loadProfile();
  }, [])
);

const loadProfile =
async () => {

  const currentUser =
    await getData(
      'currentUser'
    );

  const allRegistrations =
    (await getData(
      'registrations'
    )) || [];

  const userEvents =
    allRegistrations.filter(
      (r: any) =>
        r.userEmail ===
        currentUser?.email
    );

  setUser(
    currentUser
  );

  setRegistrations(
    userEvents
  );
};


const logout =
async () => {

  await AsyncStorage.removeItem(
    'currentUser'
  );

  navigation.replace(
    'Login'
  );
};

const getInitials = (name: string) => {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  return parts.length > 1
    ? parts[0][0] + parts[1][0]
    : parts[0][0];
};

return (
<ScrollView
style={
styles.container
}
showsVerticalScrollIndicator={false}
contentContainerStyle={{ paddingBottom: 40 }}
>

  {/* Profile Header */}
  <View style={styles.profileHeader}>
    <View style={styles.headerOrb} />
    <View style={styles.avatarCircle}>
      <Text style={styles.avatarText}>
        {user?.name ? getInitials(user.name).toUpperCase() : 'U'}
      </Text>
    </View>
    <Text style={styles.userName}>{user?.name}</Text>
    <Text style={styles.userEmail}>{user?.email}</Text>

    <View style={styles.statsPill}>
      <View style={styles.pillItem}>
        <Text style={styles.pillNum}>{registrations.length}</Text>
        <Text style={styles.pillLabel}>Registered</Text>
      </View>
    </View>
  </View>

  {/* Info Card */}
  <View style={styles.infoCard}>
    <View style={styles.infoRow}>
  
      <View>
        <Text style={styles.infoLabel}>Full Name</Text>
        <Text style={styles.infoValue}>{user?.name}</Text>
      </View>
    </View>
    <View style={styles.infoSep} />
    <View style={styles.infoRow}>
     
      <View>
        <Text style={styles.infoLabel}>Email Address</Text>
        <Text style={styles.infoValue}>{user?.email}</Text>
      </View>
    </View>
  </View>

  {/* Registered Events */}
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>My Registered Events</Text>
    <View style={styles.countBadge}>
      <Text style={styles.countBadgeText}>{registrations.length}</Text>
    </View>
  </View>

  {registrations.length === 0 ? (
    <View style={styles.emptyState}>
      
      <Text style={styles.emptyTitle}>No Registrations Yet</Text>
      <Text style={styles.emptySubtitle}>Browse events and register to see them here</Text>
      <TouchableOpacity
        style={styles.browseBtn}
        onPress={() => navigation.navigate('Events')}
      >
        <Text style={styles.browseBtnText}>Browse Events</Text>
      </TouchableOpacity>
    </View>
  ) : (
    registrations.map(
    item => (
      <View
        key={item.eventId}
        style={
          styles.card
        }>

        <View style={styles.cardLeft}>
          <View style={styles.cardDot} />
        </View>

        <View style={styles.cardContent}>
          <Text
            style={
              styles.eventTitle
            }>
            {item.eventTitle}
          </Text>

          <View style={styles.cardMeta}>
            
            <Text style={styles.cardMetaText}> {item.date}</Text>
          </View>

          <View style={styles.cardMeta}>
            
            <Text style={styles.cardMetaText}> {item.venue}</Text>
          </View>
        </View>

        <View style={styles.registeredBadge}>
          <Text style={styles.registeredBadgeText}>✓</Text>
        </View>

      </View>
    ),
  ))}

  <TouchableOpacity
    style={
      styles.logoutBtn
    }
    onPress={logout}
  >
    
    <Text
      style={
        styles.logoutText
      }>
      {' '}Logout
    </Text>

  </TouchableOpacity>

</ScrollView>


);
}

const styles =
StyleSheet.create({

container: {
  flex: 1,
  backgroundColor: '#F7F8FC',
},

profileHeader: {
  backgroundColor: '#6C63FF',
  alignItems: 'center',
  paddingTop: 54,
  paddingBottom: 32,
  borderBottomLeftRadius: 28,
  borderBottomRightRadius: 28,
  overflow: 'hidden',
  elevation: 8,
  shadowColor: '#6C63FF',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.25,
  shadowRadius: 16,
},
headerOrb: {
  position: 'absolute',
  width: 200, height: 200, borderRadius: 100,
  backgroundColor: 'rgba(255,255,255,0.06)',
  top: -60, right: -40,
},
avatarCircle: {
  width: 80, height: 80, borderRadius: 40,
  backgroundColor: 'rgba(255,255,255,0.22)',
  alignItems: 'center', justifyContent: 'center',
  borderWidth: 3, borderColor: 'rgba(255,255,255,0.45)',
  marginBottom: 12,
},
avatarText: { color: '#fff', fontSize: 28, fontWeight: '800' },
userName: { color: '#fff', fontSize: 22, fontWeight: '800', marginBottom: 4 },
userEmail: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 16 },
statsPill: {
  backgroundColor: 'rgba(255,255,255,0.18)',
  borderRadius: 20, paddingHorizontal: 24, paddingVertical: 8,
},
pillItem: { alignItems: 'center' },
pillNum: { color: '#fff', fontSize: 20, fontWeight: '800' },
pillLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: '600' },

infoCard: {
  backgroundColor: '#fff',
  marginHorizontal: 16,
  marginTop: 20,
  borderRadius: 18,
  padding: 16,
  elevation: 4,
  shadowColor: '#6C63FF',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.07,
  shadowRadius: 8,
},
infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
infoIconBox: {
  width: 38, height: 38, borderRadius: 12,
  backgroundColor: '#EDE9FF',
  alignItems: 'center', justifyContent: 'center',
  marginRight: 12,
},
infoLabel: { fontSize: 11, color: '#9CA3AF', fontWeight: '600', marginBottom: 2 },
infoValue: { fontSize: 14, fontWeight: '700', color: '#1F2937' },
infoSep: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 4 },

sectionHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  marginHorizontal: 16,
  marginTop: 24,
  marginBottom: 12,
},
sectionTitle: { fontSize: 17, fontWeight: '800', color: '#1F2937', flex: 1 },
countBadge: {
  backgroundColor: '#6C63FF', borderRadius: 10,
  paddingHorizontal: 9, paddingVertical: 3,
},
countBadgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },

emptyState: {
  alignItems: 'center', paddingVertical: 36,
  marginHorizontal: 16,
  backgroundColor: '#fff',
  borderRadius: 18,
  elevation: 2,
},
emptyTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginTop: 12 },
emptySubtitle: { fontSize: 13, color: '#9CA3AF', marginTop: 4, textAlign: 'center', paddingHorizontal: 24 },
browseBtn: {
  marginTop: 16, backgroundColor: '#6C63FF',
  paddingHorizontal: 24, paddingVertical: 10, borderRadius: 12,
},
browseBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },

card: {
  backgroundColor: '#fff',
  marginHorizontal: 16,
  padding: 14,
  borderRadius: 16,
  marginBottom: 10,
  elevation: 3,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.06,
  shadowRadius: 6,
  flexDirection: 'row',
  alignItems: 'center',
},
cardLeft: { marginRight: 10, alignItems: 'center' },
cardDot: {
  width: 10, height: 10, borderRadius: 5, backgroundColor: '#6C63FF',
},
cardContent: { flex: 1 },

eventTitle: {
  fontSize: 15,
  fontWeight: 'bold',
  marginBottom: 5,
  color: '#1F2937',
},
cardMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
cardMetaText: { fontSize: 12, color: '#9CA3AF' },
registeredBadge: {
  width: 28, height: 28, borderRadius: 14,
  backgroundColor: '#D1FAE5',
  alignItems: 'center', justifyContent: 'center',
},
registeredBadgeText: { color: '#10B981', fontWeight: '800', fontSize: 14 },

logoutBtn: {
  flexDirection: 'row',
  backgroundColor: '#EF4444',
  padding: 16,
  borderRadius: 16,
  marginTop: 24,
  marginBottom: 10,
  marginHorizontal: 16,
  alignItems: 'center',
  justifyContent: 'center',
  elevation: 4,
  shadowColor: '#EF4444',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
},

logoutText: {
  color: '#fff',
  textAlign: 'center',
  fontSize: 16,
  fontWeight:
    'bold',
},


});

