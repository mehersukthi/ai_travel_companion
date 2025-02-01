import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ScrollView } from 'react-native';
import axios from 'axios';

export default function App() {
  const [travelDates, setTravelDates] = useState({ start: '', end: '' });
  const [interests, setInterests] = useState('');
  const [budget, setBudget] = useState('');
  const [itinerary, setItinerary] = useState('');

  const handleGenerateItinerary = async () => {
    try {
      const response = await axios.post('http://localhost:3000/generate-itinerary', {
        travelDates,
        interests,
        budget,
      });
      setItinerary(response.data.itinerary);
    } catch (error) {
      console.error('Error generating itinerary:', error);
      setItinerary('Failed to generate itinerary. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Travel Itinerary Generator</Text>
      <TextInput
        style={styles.input}
        placeholder="Start Date (YYYY-MM-DD)"
        value={travelDates.start}
        onChangeText={(text) => setTravelDates({ ...travelDates, start: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="End Date (YYYY-MM-DD)"
        value={travelDates.end}
        onChangeText={(text) => setTravelDates({ ...travelDates, end: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Interests (e.g., historical sites, local cuisine)"
        value={interests}
        onChangeText={setInterests}
      />
      <TextInput
        style={styles.input}
        placeholder="Budget (e.g., moderate)"
        value={budget}
        onChangeText={setBudget}
      />
      <Button title="Generate Itinerary" onPress={handleGenerateItinerary} />
      <Text style={styles.itinerary}>{itinerary}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '100%',
  },
  itinerary: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
});