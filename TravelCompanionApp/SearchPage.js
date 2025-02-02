import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { db } from './firebase'; // Import db from firebase.js
import { collection, query, where, getDocs } from 'firebase/firestore'; // Import necessary Firestore functions

export default function SearchPage() {
  const [email, setEmail] = useState(''); // State to store user input
  const [matches, setMatches] = useState([]); // State to store matched users
  const [loading, setLoading] = useState(false); // State to handle loading status

  // Function to handle search based on email
  const handleSearch = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter an email to search.');
      return;
    }

    setLoading(true);

    try {
      // Firestore query to fetch users whose email matches the input
      const usersRef = collection(db, 'users'); // Assuming 'users' is the collection where user data is stored
      const q = query(usersRef, where('email', '==', email)); // Query to match email

      const querySnapshot = await getDocs(q); // Execute the query

      if (querySnapshot.empty) {
        Alert.alert('No Matches', 'No users found with that email.');
      }

      const matchedUsers = [];
      querySnapshot.forEach((doc) => {
        matchedUsers.push(doc.data()); // Push matched users into the array
      });

      setMatches(matchedUsers); // Update state with matched users
    } catch (error) {
      console.error('Error fetching data from Firebase: ', error);
      Alert.alert('Error', 'There was an issue fetching the matches.');
    } finally {
      setLoading(false); // End the loading state
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search by Email</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter email"
        value={email}
        onChangeText={setEmail} // Update email state on input change
      />

      <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>

      {loading ? (
        <Text style={styles.loadingText}>Searching...</Text> // Show loading message when searching
      ) : (
        <FlatList
          data={matches} // Display matched users
          renderItem={({ item }) => (
            <View style={styles.matchItem}>
              <Text style={styles.matchText}>{`Email: ${item.email}`}</Text>
              <Text style={styles.matchText}>{`Password: ${item.password}`}</Text> {/* Update to display more user data if necessary */}
            </View>
          )}
          keyExtractor={(item, index) => index.toString()} // Unique key for each list item
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
