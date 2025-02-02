import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { db } from './firebase'; // Import db from firebase.js
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore'; // Import necessary Firestore functions

export default function SearchPage({ userId }) {
  const [location, setLocation] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [language, setLanguage] = useState('');
  const [dates, setDates] = useState('');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to update user dates after search
  const updateUserSearchDates = async (userId, searchDate) => {
    try {
      // Assuming 'dates' is an array of search dates in the user's document
      const userRef = doc(db, 'users', userId);
      
      // Get the current data of the user document
      const userSnapshot = await getDoc(userRef);
      
      // Check if the document exists and if 'dates' field is initialized
      const userData = userSnapshot.data();
      const currentDates = userData?.dates || []; // If 'dates' field doesn't exist, use an empty array

      // Add the new search date to the 'dates' array
      const updatedDates = [...currentDates, searchDate];

      // Update the user's 'dates' field with the new array
      await updateDoc(userRef, {
        dates: updatedDates
      });

      console.log('User search dates updated successfully');
    } catch (error) {
      console.error('Error updating user dates:', error);
    }
  };

  // Function to handle search
  const handleSearch = async () => {
    if (!location || !gender || !age || !language || !dates) {
      Alert.alert('Error', 'Please provide all search parameters.');
      return;
    }

    setLoading(true);

    console.log('Searching with the following params:');
    console.log({ location, gender, age, language, dates });

    try {
      // Query Firestore to get users who match the search criteria
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        where('location', '==', location),
        where('gender', '==', gender),
        where('age', '==', age),
        where('language', '==', language)
      );

      console.log('Executing query...');

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert('No Matches', 'No users found with the given criteria.');
      }

      const matchedUsers = [];
      querySnapshot.forEach((doc) => {
        matchedUsers.push(doc.data());
      });

      setMatches(matchedUsers); // Update state with matched users

      // Now update the dates of the querying user (the one who performed the search)
      if (userId) {
        await updateUserSearchDates(userId, dates);
      }
    } catch (error) {
      console.error('Error fetching data from Firebase:', error);
      Alert.alert('Error', 'There was an issue fetching the matches.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search by Criteria</Text>

      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Gender"
        value={gender}
        onChangeText={setGender}
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Language"
        value={language}
        onChangeText={setLanguage}
      />
      <TextInput
        style={styles.input}
        placeholder="Dates (YYYY-MM-DD)"
        value={dates}
        onChangeText={setDates}
      />

      <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>

      {loading ? (
        <Text style={styles.loadingText}>Searching...</Text>
      ) : (
        <FlatList
          data={matches}
          renderItem={({ item }) => (
            <View style={styles.matchItem}>
              <Text style={styles.matchText}>{`Location: ${item.location}`}</Text>
              <Text style={styles.matchText}>{`Gender: ${item.gender}`}</Text>
              <Text style={styles.matchText}>{`Age: ${item.age}`}</Text>
              <Text style={styles.matchText}>{`Language: ${item.language}`}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingLeft: 10,
  },
  searchButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
  },
  matchItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
  },
  matchText: {
    fontSize: 14,
    color: '#333',
  },
});
