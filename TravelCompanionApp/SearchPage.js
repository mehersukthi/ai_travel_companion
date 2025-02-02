import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default function SearchPage() {
  // State variables for storing the email input and fetched data
  const [email, setEmail] = useState('');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to handle search based on email
  const handleSearch = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter an email to search.");
      return;
    }

    setLoading(true);

    try {
      // Query Firestore to get users whose email matches
      const querySnapshot = await firestore()
        .collection('users') // Assuming 'users' collection
        .where('email', '==', email) // Query for exact email match
        .get();

      if (querySnapshot.empty) {
        Alert.alert("No Matches", "No users found with that email.");
      }

      const matchedUsers = [];
      querySnapshot.forEach((doc) => {
        matchedUsers.push(doc.data());
      });

      setMatches(matchedUsers); // Set the matched users
    } catch (error) {
      console.error("Error fetching data from Firebase: ", error);
      Alert.alert("Error", "There was an issue fetching the matches.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search by Email</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter email"
        value={email}
        onChangeText={setEmail}
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
              <Text style={styles.matchText}>{`Email: ${item.email}`}</Text>
              <Text style={styles.matchText}>{`Password: ${item.password}`}</Text>
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
