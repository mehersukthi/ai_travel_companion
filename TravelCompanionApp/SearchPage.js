import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { db } from './firebase'; // Import db from firebase.js
import { collection, query, where, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore'; // Firestore functions

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
if (!userId) {
  console.error('User ID is missing');
  return;
}

try {
  const userRef = doc(db, 'users', userId);
  const userSnapshot = await getDoc(userRef);

  if (!userSnapshot.exists()) {
    console.error('User not found!');
    return;
  }

  const userData = userSnapshot.data();
  const currentDates = userData?.dates || [];  // Fetch current dates if they exist

  // Add the new search date to the existing dates array
  const updatedDates = [...currentDates, searchDate];

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
if (!userId) {
  Alert.alert('Error', 'User is not authenticated. Please sign in.');
  return;
}

if (!location || !dates) {
  Alert.alert('Error', 'Location and Dates are mandatory.');
  return;
}

setLoading(true);

console.log('Searching with the following params:');
console.log({ location, gender, age, language, dates });

try {
  const usersRef = collection(db, 'users');
  let queryRef = query(usersRef, where('location', '==', location));

  if (gender) queryRef = query(queryRef, where('gender', '==', gender));
  if (age) queryRef = query(queryRef, where('age', '==', age));
  if (language) queryRef = query(queryRef, where('language', '==', language));

  console.log('Executing query...');

  const querySnapshot = await getDocs(queryRef);

  if (querySnapshot.empty) {
    Alert.alert('No Matches', 'No users found with the given criteria.');
  }

  const matchedUsers = [];
  querySnapshot.forEach((doc) => {
    matchedUsers.push(doc.data());
  });

  setMatches(matchedUsers); // Update state with matched users

  // Now update the dates of the querying user
  await updateUserSearchDates(userId, dates);

} catch (error) {
  console.error('Error fetching data:', error);
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
    placeholder="Location (required)"
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
    placeholder="Dates (YYYY-MM-DD) (required)"
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
          <Text style={styles.matchText}>Name: ${item.firstName}</Text>
          <Text style={styles.matchText}>Location: ${item.location}</Text>
          <Text style={styles.matchText}>Gender: ${item.gender}</Text>
          <Text style={styles.matchText}>Age: ${item.age}</Text>
          <Text style={styles.matchText}>Language: ${item.language}</Text>
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
marginBottom: 20,
},
input: {
height: 40,
borderColor: '#ccc',
borderWidth: 1,
borderRadius: 5,
paddingHorizontal: 10,
marginBottom: 15,
},
searchButton: {
backgroundColor: '#007BFF',
padding: 10,
borderRadius: 5,
alignItems: 'center',
},
searchButtonText: {
color: '#fff',
fontSize: 16,
},
loadingText: {
textAlign: 'center',
fontSize: 18,
color: '#007BFF',
},
matchItem: {
padding: 10,
borderBottomWidth: 1,
borderBottomColor: '#ccc',
},
matchText: {
fontSize: 16,
},
});