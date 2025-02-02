import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import axios from 'axios';

export default function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(true);
  const [location, setLocation] = useState('');
  const [language, setLanguage] = useState('');
  const [age, setAge] = useState('');
  const [country, setCountry] = useState('');

  // Function to send messages and get AI response
  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { text: message, sender: 'user' };
    setMessages((prevMessages) => [userMessage, ...prevMessages]); // Add at the top
    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/chat', { message });

      const aiMessage = { text: response.data.reply, sender: 'ai' };
      setMessages((prevMessages) => [aiMessage, ...prevMessages]); // Add AI response at the top
    } catch (error) {
      console.error('Error with AI response:', error);
      setMessages((prevMessages) => [
        { text: 'Sorry, something went wrong. Please try again.', sender: 'ai' },
        ...prevMessages
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Toggle chat visibility
  const toggleChatVisibility = () => {
    setIsChatVisible(!isChatVisible);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Text style={styles.title}>AI Travel Assistant</Text>

      <TouchableOpacity onPress={toggleChatVisibility} style={styles.toggleButton}>
        <Text style={styles.toggleButtonText}>
          {isChatVisible ? 'Show Home Bar' : 'Show Chat'}
        </Text>
      </TouchableOpacity>

      {isChatVisible ? (
        <>
          <FlatList
            data={messages}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.messageContainer,
                  item.sender === 'user' ? styles.userMessage : styles.aiMessage
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    item.sender === 'user' ? styles.userText : styles.aiText
                  ]}
                >
                  {item.text}
                </Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            inverted
            contentContainerStyle={styles.messagesContainer}
          />

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type a message"
              value={message}
              onChangeText={setMessage}
              onSubmitEditing={handleSendMessage}
            />
            <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>

          {loading && <Text style={styles.loadingText}>AI is typing...</Text>}
        </>
      ) : (
        <View style={styles.homeBar}>
          <TextInput style={styles.homeInput} placeholder="Location" value={location} onChangeText={setLocation} />
          <TextInput style={styles.homeInput} placeholder="Language" value={language} onChangeText={setLanguage} />
          <TextInput style={styles.homeInput} placeholder="Age" value={age} onChangeText={setAge} />
          <TextInput style={styles.homeInput} placeholder="Country" value={country} onChangeText={setCountry} />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 10
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10
  },
  toggleButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: 'center'
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 16
  },
  messagesContainer: {
    paddingBottom: 10
  },
  messageContainer: {
    maxWidth: '80%',
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    marginHorizontal: '10%'
  },
  userMessage: {
    backgroundColor: '#d1f7d6',
    alignSelf: 'flex-end'
  },
  aiMessage: {
    backgroundColor: '#f1f0f0',
    alignSelf: 'flex-start'
  },
  messageText: {
    fontSize: 16,
    color: '#333'
  },
  userText: {
    color: '#1c1c1c'
  },
  aiText: {
    color: '#555'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20
  },
  input: {
    flex: 1,
    height: 40,
    paddingLeft: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc'
  },
  sendButton: {
    paddingHorizontal: 20,
    marginLeft: 10,
    backgroundColor: '#007BFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 10,
    color: '#888'
  },
  homeBar: {
    marginTop: 20
  },
  homeInput: {
    height: 40,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingLeft: 10,
    backgroundColor: '#fff'
  }
});
