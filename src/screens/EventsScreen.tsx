
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';

import { getData } from '../services/storage';

export default function EventsScreen({ navigation }: any) {
  const [events, setEvents] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const data = await getData('events');
    setEvents(data || []);
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(search.toLowerCase()),
  );

  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return date;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6C63FF" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.orb1} />
        <View style={styles.orb2} />

        <Text style={styles.headerTitle}>Explore Events</Text>
        <Text style={styles.headerSubtitle}>
          Discover university events and activities
        </Text>

        <View style={styles.searchContainer}>
         
          <TextInput
            placeholder="Search events..."
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>
      </View>

      <FlatList
        data={filteredEvents}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            
            <Text style={styles.emptyTitle}>
              No Events Found
            </Text>
            <Text style={styles.emptyText}>
              Try another search or wait for new events.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
  <TouchableOpacity
    activeOpacity={0.9}
    style={styles.card}
    onPress={() =>
      navigation.navigate('EventDetails', {
        event: item,
      })
    }
  >
    <View style={styles.cardHeader}>
      <View style={styles.dateBadge}>
        <Text style={styles.dateDay}>
          {new Date(item.date).getDate()}
        </Text>
        <Text style={styles.dateMonth}>
          {new Date(item.date).toLocaleString('en-US', {
            month: 'short',
          })}
        </Text>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.title}>
          {item.title}
        </Text>

        <Text style={styles.fullDate}>
          {formatDate(item.date)}
        </Text>

        <View style={styles.venueChip}>
          <Text style={styles.venueText}>
            📍 {item.venue}
          </Text>
        </View>
      </View>
    </View>

    <TouchableOpacity
      style={styles.button}
      onPress={() =>
        navigation.navigate('EventDetails', {
          event: item,
        })
      }
    >
      <Text style={styles.buttonText}>
        View Details →
      </Text>
    </TouchableOpacity>
  </TouchableOpacity>
)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FC',
  },

  header: {
    backgroundColor: '#6C63FF',
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
    
  },

  orb1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.34)',
    top: -60,
    right: -40,
  },

  orb2: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
    bottom: -30,
    left: -30,
  },

  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    marginLeft: 90,
  },

  headerSubtitle: {
    color: 'rgba(255,255,255,0.75)',
    marginTop: 4,
    marginBottom: 18,
    fontSize: 13,
    marginLeft: 70,
  },

  searchContainer: {
    backgroundColor: '#fff',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 52,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
  },
  card: {
  backgroundColor: '#FFFFFF',
  borderRadius: 22,
  padding: 18,
  marginBottom: 18,
  elevation: 8,
  shadowColor: '#6C63FF',
  shadowOffset: {
    width: 0,
    height: 5,
  },
  shadowOpacity: 0.12,
  shadowRadius: 12,
  borderWidth: 1,
  borderColor: '#F3F4F6',
},

cardHeader: {
  flexDirection: 'row',
  alignItems: 'center',
},

dateBadge: {
  width: 68,
  height: 72,
  borderRadius: 18,
  backgroundColor: '#6C63FF',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 16,
},

dateDay: {
  color: '#fff',
  fontSize: 24,
  fontWeight: '800',
},

dateMonth: {
  color: '#fff',
  fontSize: 12,
  fontWeight: '600',
  textTransform: 'uppercase',
},

cardContent: {
  flex: 1,
},

title: {
  fontSize: 19,
  fontWeight: '800',
  color: '#111827',
  marginBottom: 6,
},

fullDate: {
  color: '#6B7280',
  fontSize: 13,
  marginBottom: 10,
},

venueChip: {
  alignSelf: 'flex-start',
  backgroundColor: '#EEF2FF',
  paddingHorizontal: 10,
  paddingVertical: 6,
  borderRadius: 20,
},

venueText: {
  color: '#4F46E5',
  fontSize: 12,
  fontWeight: '600',
},

button: {
  marginTop: 18,
  backgroundColor: '#6C63FF',
  borderRadius: 14,
  height: 48,
  justifyContent: 'center',
  alignItems: 'center',
},

buttonText: {
  color: '#fff',
  fontWeight: '700',
  fontSize: 15,
},

 

  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },



  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },

  infoText: {
    marginLeft: 6,
    color: '#6B7280',
    fontSize: 13,
    
  },





  emptyContainer: {
    alignItems: 'center',
    marginTop: 80,
  },

  emptyTitle: {
    marginTop: 14,
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
  },

  emptyText: {
    marginTop: 6,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
