import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Signup from './Signup'; // Ensure the path is correct
import Chatbot from './Chatbot'; // Ensure the path is correct
import SearchPage from './SearchPage'; // Import SearchPage directly

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'signup':
        return <Signup onSignupSuccess={() => handleNavigation('home')} />;
      case 'chatbot':
        return <Chatbot />;
      default:
        return (
          <View style={styles.container}>
            <Text style={styles.title}>Welcome to Travel Companion App</Text>

            {/* Render SearchPage directly */}
            <SearchPage /> {/* This is where SearchPage is rendered directly */}

            {/* Existing buttons for Sign Up and Chatbot */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleNavigation('signup')}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleNavigation('chatbot')}
            >
              <Text style={styles.buttonText}>Chatbot</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return renderPage();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
