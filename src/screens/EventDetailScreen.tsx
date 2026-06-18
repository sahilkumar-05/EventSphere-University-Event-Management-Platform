import React from 'react';
import {
  View,
  Text,
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
import EventsScreen
from '../screens/EventsScreen';

export default function EventDetailScreen({
  route,
  navigation,
}: any) {

  const { event } = route.params;

  const registerEvent =
    async () => {

      const currentUser =
        await getData(
          'currentUser'
        );

      if (!currentUser) {
        Alert.alert(
          'Please Login First'
        );
        return;
      }

      let registrations =
        (await getData(
          'registrations'
        )) || [];

      const alreadyRegistered =
        registrations.find(
          (r: any) =>
            r.userEmail ===
              currentUser.email &&
            r.eventId ===
              event.id
        );

      if (
        alreadyRegistered
      ) {
        Alert.alert(
          'You are already registered in this event'
        );
        return;
      }

      registrations.push({
        userEmail:
          currentUser.email,
        eventId:
          event.id,
        eventTitle:
          event.title,
        date:
          event.date,
        venue:
          event.venue,
      });

      await saveData(
        'registrations',
        registrations
      );

      Alert.alert(
        'Success',
        'Registration Successful'
      );
    };

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#6C63FF"
      />

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
        }}
      >

        {/* Header */}

        <View style={styles.header}>

          <View style={styles.headerCircle1} />
          <View style={styles.headerCircle2} />
          <View style={styles.headerCircle3} />

          <Text style={styles.smallText}>
            Event Portal
          </Text>

          <Text style={styles.title}>
            {event.title}
          </Text>

          <Text style={styles.subTitle}>
            Explore the details and register for this event.
          </Text>

        </View>

        {/* Main Card */}

        <View style={styles.card}>

          <Text style={styles.sectionTitle}>
            About Event
          </Text>

          <Text style={styles.description}>
            {event.description}
          </Text>

          <View style={styles.infoCard}>

            <View style={styles.infoRow}>
              <Text style={styles.icon}>
                📅
              </Text>

              <View>
                <Text style={styles.infoLabel}>
                  Event Date
                </Text>

                <Text style={styles.infoValue}>
                  {event.date}
                </Text>
              </View>
            </View>

          </View>

          <View style={styles.infoCard}>

            <View style={styles.infoRow}>
              <Text style={styles.icon}>
                📍
              </Text>

              <View>
                <Text style={styles.infoLabel}>
                  Venue
                </Text>

                <Text style={styles.infoValue}>
                  {event.venue}
                </Text>
              </View>
            </View>

          </View>

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.85}
            onPress={registerEvent}
          >

            <Text style={styles.btnText}>
              Register Now
            </Text>

          </TouchableOpacity>

        <TouchableOpacity
            style={styles.backbutton}
            activeOpacity={0.85}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backbtnText}>
              Back
            </Text>

          </TouchableOpacity>
        </View>

      </ScrollView>
    </>
  );
}

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: '#F7F8FC',
    },

    header: {
      backgroundColor: '#6C63FF',
      paddingTop: 60,
      paddingHorizontal: 22,
      paddingBottom: 70,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      overflow: 'hidden',

      elevation: 8,

      shadowColor: '#6C63FF',
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 0.25,
      shadowRadius: 10,
    },

    headerCircle1: {
      position: 'absolute',
      width: 220,
      height: 220,
      borderRadius: 110,
      backgroundColor: 'rgba(255,255,255,0.08)',
      top: -80,
      right: -50,
    },

    headerCircle2: {
      position: 'absolute',
      width: 150,
      height: 150,
      borderRadius: 75,
      backgroundColor: 'rgba(255,255,255,0.06)',
      bottom: -30,
      left: -40,
    },

    headerCircle3: {
      position: 'absolute',
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: 'rgba(255,255,255,0.07)',
      bottom: 20,
      right: 70,
    },

    smallText: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: 13,
      fontWeight: '600',
      marginBottom: 6,
    },

    title: {
      color: '#fff',
      fontSize: 30,
      fontWeight: '800',
    },

    subTitle: {
      color: 'rgba(255,255,255,0.8)',
      marginTop: 8,
      fontSize: 14,
      lineHeight: 22,
    },

    card: {
      backgroundColor: '#fff',
      marginHorizontal: 18,
      marginTop: -35,
      borderRadius: 22,
      padding: 20,

      elevation: 4,

      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.08,
      shadowRadius: 8,
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: '#1F2937',
      marginBottom: 12,
    },

    description: {
      fontSize: 15,
      color: '#6B7280',
      lineHeight: 24,
      marginBottom: 22,
    },

    infoCard: {
      backgroundColor: '#F9FAFB',
      borderRadius: 16,
      padding: 15,
      marginBottom: 14,
      borderWidth: 1,
      borderColor: '#EEF2F7',
    },

    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    icon: {
      fontSize: 24,
      marginRight: 14,
    },

    infoLabel: {
      fontSize: 13,
      color: '#9CA3AF',
      fontWeight: '600',
      marginBottom: 4,
    },

    infoValue: {
      fontSize: 16,
      color: '#111827',
      fontWeight: '700',
    },

    button: {
      backgroundColor: '#6C63FF',
      paddingVertical: 17,
      borderRadius: 16,
      alignItems: 'center',
      marginTop: 18,

      elevation: 4,

      shadowColor: '#6C63FF',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.25,
      shadowRadius: 8,
    },

    btnText: {
      color: '#fff',
      fontSize: 17,
      fontWeight: '800',
      letterSpacing: 0.4,
    },
    backbutton: {
      backgroundColor: '#ff0000',
      paddingVertical: 17,
      borderRadius: 16,
      alignItems: 'center',
      marginTop: 18,

      elevation: 4,

      shadowColor: '#6C63FF',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.25,
      shadowRadius: 8,
    },

    backbtnText: {
      color: '#fff',
      fontSize: 17,
      fontWeight: '800',
      letterSpacing: 0.4,
    },

  });
