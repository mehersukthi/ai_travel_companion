import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ImageBackground
} from 'react-native';
import axios from 'axios';

export default function ChatComponent() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { text: message, sender: 'user' };
    setMessages((prevMessages) => [userMessage, ...prevMessages]);
    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/chat', { message });
      const aiMessage = { text: response.data.reply, sender: 'ai' };
      setMessages((prevMessages) => [aiMessage, ...prevMessages]);
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

  return (
    <ImageBackground
      source={require('./assets/main_img.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <Text style={styles.mainTitle}>AI Travel Assistant</Text>
        <View style={styles.chatContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
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
                placeholderTextColor="#666"
                value={message}
                onChangeText={setMessage}
                onSubmitEditing={handleSendMessage}
              />
              <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>

            {loading && <Text style={styles.loadingText}>AI is typing...</Text>}
          </KeyboardAvoidingView>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 20,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  keyboardView: {
    flex: 1,
  },
  messagesContainer: {
    paddingBottom: 10,
  },
  messageContainer: {
    maxWidth: '80%',
    marginBottom: 10,
    padding: 12,
    borderRadius: 15,
  },
  userMessage: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
  },
  aiMessage: {
    backgroundColor: '#E9ECEF',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  userText: {
    color: '#fff',
  },
  aiText: {
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
    paddingTop: 10,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
    fontSize: 16,
    color: '#000',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  sendButton: {
    backgroundColor: '#007AFF',
    height: 40,
    width: 70,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 5,
    color: '#666',
  }
});