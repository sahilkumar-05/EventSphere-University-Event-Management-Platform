import React, {
  useEffect,
  useState,
} from 'react';

import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  ScrollView,
} from 'react-native';

import {
  getData,
  saveData,
} from '../services/storage';

export default function ManageEvents({ navigation }: any) {

  const [events, setEvents] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const data = (await getData('events')) || [];
    setEvents(data);
  };

  // ✅ DATE VALIDATION FUNCTION
  const isValidDate = (value: string) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD
    if (!regex.test(value)) return false;

    const d = new Date(value);
    return !isNaN(d.getTime());
  };

  const addEvent = async () => {

    if (!title || !date || !venue) {
      Alert.alert('Fill all fields');
      return;
    }

    // ✅ DATE CHECK
    if (!isValidDate(date)) {
      Alert.alert('Invalid Date Format', 'Use YYYY-MM-DD (e.g. 2026-06-15)');
      return;
    }

    const newEvent = {
      id: Date.now(),
      title,
      date,
      venue,
      description,
    };

    const updated = [...events, newEvent];

    await saveData('events', updated);

    setEvents(updated);

    setTitle('');
    setDate('');
    setVenue('');
    setDescription('');

    Alert.alert('Event Added Successfully');
  };

  const deleteEvent = async (id: number) => {
    const updated = events.filter(e => e.id !== id);
    await saveData('events', updated);
    setEvents(updated);
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#6C63FF" />

      <FlatList
        data={events}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}

        ListHeaderComponent={
          <>
            {/* HEADER */}
            <View style={styles.header}>

              

              <View style={styles.circle1} />
              <View style={styles.circle2} />
              <View style={styles.circle3} />

              <Text style={styles.smallText}>Admin Panel</Text>
              <Text style={styles.heading}>Manage Events</Text>
              <Text style={styles.subHeading}>
                Create and organize upcoming events.
              </Text>
            </View>

            {/* FORM */}
            <View style={styles.formCard}>

              <TextInput
                placeholder="Event Title"
                placeholderTextColor="#9CA3AF"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
              />

              <TextInput
                placeholder="Event Date (YYYY-MM-DD)"
                placeholderTextColor="#9CA3AF"
                value={date}
                onChangeText={setDate}
                style={styles.input}
              />

              <TextInput
                placeholder="Venue"
                placeholderTextColor="#9CA3AF"
                value={venue}
                onChangeText={setVenue}
                style={styles.input}
              />

              <TextInput
                placeholder="Description"
                placeholderTextColor="#9CA3AF"
                value={description}
                onChangeText={setDescription}
                multiline
                style={[styles.input, { height: 90, textAlignVertical: 'top' }]}
              />

              <TouchableOpacity
                style={styles.button}
                onPress={addEvent}
              
              >
                <Text style={styles.btnText}>Add Event</Text>
              </TouchableOpacity>

              {/* BACK BUTTON */}
              <TouchableOpacity
  style={styles.backButton}
  onPress={() => navigation.replace('AdminDashboard')}
>
  <Text style={styles.backButtonText}>Back</Text>
</TouchableOpacity>
            </View>

            <Text style={styles.listTitle}>All Events</Text>
          </>
        }

        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardInfo}>📅 {item.date}</Text>
              <Text style={styles.cardInfo}>📍 {item.venue}</Text>

              {item.description ? (
                <Text style={styles.cardDesc} numberOfLines={2}>
                  {item.description}
                </Text>
              ) : null}
            </View>

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => deleteEvent(item.id)}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({

  header: {
    backgroundColor: '#6C63FF',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 70,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },

backButton: {
 backgroundColor: '#ff0000',
    padding: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
},

backButtonText: {
    color: '#fff',
    fontWeight: '800',
},

  circle1: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -70,
    right: -50,
  },

  circle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.05)',
    left: -30,
    bottom: -20,
  },

  circle3: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.06)',
    right: 70,
    bottom: 10,
  },

  smallText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 5,
  },

  heading: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '800',
  },

  subHeading: {
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
    fontSize: 14,
  },

  formCard: {
    backgroundColor: '#fff',
    marginHorizontal: 18,
    marginTop: -35,
    borderRadius: 22,
    padding: 18,
    elevation: 4,
  },

  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  button: {
    backgroundColor: '#6C63FF',
    padding: 15,
    borderRadius: 14,
    alignItems: 'center',
  },

  btnText: {
    color: '#fff',
    fontWeight: '800',
  },

  listTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginHorizontal: 20,
    marginTop: 24,
  },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 18,
    marginBottom: 14,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
  },

  cardInfo: {
    fontSize: 13,
    color: '#6B7280',
  },

  cardDesc: {
    marginTop: 6,
    color: '#9CA3AF',
    fontSize: 13,
  },
   deleteBtn: {
      backgroundColor: '#FEE2E2',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 12,
      marginLeft: 12,
    },

    deleteText: {
      color: '#DC2626',
      fontWeight: '900',
      fontSize: 13,
      marginTop: 20,
    },

});