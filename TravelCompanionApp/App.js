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
import Chatbot from './Chatbot';
import Signup from './Signup';


export default function App() {
  return <Signup />;
}