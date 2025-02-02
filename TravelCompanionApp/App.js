import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Signup from './Signup';
import SignIn from './Signin';
import Chatbot from './Chatbot';
import SearchPage from './SearchPage';
import CreateProfile from './CreateProfile';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [userId, setUserId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Setting up auth');
      if (user) {
        console.log('User is signed in, ID:', user.uid);
        setUserId(user.uid);
        setIsAuthenticated(true);
      } else {
        console.log('No user signed in');
        setUserId(null);
        setIsAuthenticated(false);
      }  
      setLoading(false);  // Stop loading after checking auth state
    });

    return () => unsubscribe();  // Cleanup the listener when the component unmounts
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setCurrentPage('home');
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleNavigation = (page, userId = null, hasProfile = false) => {
    setUserId(userId);
    if (page === 'signin' && userId) {
      if (hasProfile) {
        setCurrentPage('home'); // User has profile, go to home
      } else {
        setCurrentPage('createProfile'); // User doesn't have profile, go to create profile
      }
    } else {
      setCurrentPage(page); // Handle all other navigation normally
    }
  };

  const renderPage = () => {
    if (loading) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Loading...</Text>
        </View>
      );
    }

    switch (currentPage) {
      case 'signup':
        return (
          <Signup 
            onSignupSuccess={() => handleNavigation('signin')}
            onBack={() => handleNavigation('home')}
          />
        );
      case 'signin':
        return (
          <SignIn 
            onSignInSuccess={(userId, hasProfile) => handleNavigation('signin', userId, hasProfile)}
            onBack={() => handleNavigation('home')}
          />
        );
      case 'createProfile':
        return <CreateProfile userId={userId} onProfileCreated={() => handleNavigation('home')} />;
      case 'chatbot':
        return (
          <View style={styles.container}>
            <Chatbot />
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => handleNavigation('home')}
            >
              <Text style={styles.buttonText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        if (isAuthenticated) {
          return (
            <View style={styles.container}>
              <View style={styles.header}>
                <Text style={styles.title}>Travel Companion App</Text>
                <TouchableOpacity
                  style={styles.signOutButton}
                  onPress={handleSignOut}
                >
                  <Text style={styles.buttonText}>Sign Out</Text>
                </TouchableOpacity>
              </View>
              <SearchPage userId={userId} />  {/* Pass userId to SearchPage */}
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleNavigation('chatbot')}
              >
                <Text style={styles.buttonText}>Chatbot</Text>
              </TouchableOpacity>
            </View>
          );
        } else {
          return (
            <View style={styles.container}>
              <Text style={styles.title}>Welcome to Travel Companion App</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleNavigation('signup')}
              >
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleNavigation('signin')}
              >
                <Text style={styles.buttonText}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.chatbotButton]}
                onPress={() => handleNavigation('chatbot')}
              >
                <Text style={styles.buttonText}>Try Our Chatbot</Text>
              </TouchableOpacity>
            </View>
          );
        }
    }
  };

  return renderPage();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
    alignSelf: 'center',
  },
  chatbotButton: {
    backgroundColor: '#28a745', // Different color for chatbot button
    marginTop: 20,
  },
  signOutButton: {
    backgroundColor: '#dc3545',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#6c757d',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    width: '80%',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
