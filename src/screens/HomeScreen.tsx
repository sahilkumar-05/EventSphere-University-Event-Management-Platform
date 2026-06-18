import React, {
  useEffect,
  useState,
} from 'react';

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import {
  getData,
  saveData,
} from '../services/storage';

export default function HomeScreen({
  navigation,
}: any) {

  const [events, setEvents] =
    useState<any[]>([]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents =
    async () => {

      let storedEvents =
        await getData('events');

      if (
        !storedEvents ||
        storedEvents.length === 0
      ) {

        storedEvents = [
          {
            id: 1,
            title: 'AI Workshop',
            description:
              'Introduction to AI',
            date:
              '15 June 2026',
            venue:
              'SZABIST Auditorium',
          },
          {
            id: 2,
            title:
              'Hackathon 2026',
            description:
              '24 Hours Coding Competition',
            date:
              '20 June 2026',
            venue:
              'Computer Lab',
          },
          {
            id: 3,
            title:
              'Web Development Bootcamp',
            description:
              'React Development',
            date:
              '25 June 2026',
            venue:
              'Room 301',
          },
        ];

        await saveData(
          'events',
          storedEvents,
        );
      }

      setEvents(
        storedEvents,
      );
    };

  const renderItem =
    ({item}: any) => (
      <View
        style={
          styles.card
        }>

        <Text
          style={
            styles.title
          }>
          {item.title}
        </Text>

        <Text>
          📅 {item.date}
        </Text>

        <Text>
          📍 {item.venue}
        </Text>

        <TouchableOpacity
          style={
            styles.button
          }
          onPress={() =>
            navigation.navigate(
              'EventDetails',
              {
                event:
                  item,
              },
            )
          }>

          <Text
            style={
              styles.btnText
            }>
            View Details
          </Text>

        </TouchableOpacity>

      </View>
    );

  return (
    <View
      style={
        styles.container
      }>

      <View
        style={
          styles.header
        }>

        <Text
          style={
            styles.heading
          }>
          Events
        </Text>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate(
              'Profile',
            )
          }>

          <Text
            style={
              styles.profile
            }>
            Profile
          </Text>

        </TouchableOpacity>

      </View>

      <FlatList
        data={events}
        keyExtractor={item =>
          item.id.toString()
        }
        renderItem={
          renderItem
        }
      />

    </View>
  );
}

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      padding: 15,
    },

    header: {
      flexDirection:
        'row',
      justifyContent:
        'space-between',
      alignItems:
        'center',
      marginBottom: 15,
    },

    heading: {
      fontSize: 26,
      fontWeight:
        'bold',
    },

    profile: {
      color: 'blue',
      fontSize: 16,
    },

    card: {
      backgroundColor:
        '#fff',
      padding: 15,
      borderRadius: 10,
      marginBottom: 15,
      elevation: 4,
    },

    title: {
      fontSize: 18,
      fontWeight:
        'bold',
      marginBottom: 5,
    },

    button: {
      backgroundColor:
        '#4CAF50',
      marginTop: 10,
      padding: 10,
      borderRadius: 8,
      alignItems:
        'center',
    },

    btnText: {
      color: '#fff',
      fontWeight:
        'bold',
    },

  });