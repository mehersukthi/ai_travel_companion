import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { db } from './firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Country, State, City } from 'country-state-city';
import languages from '@cospired/i18n-iso-languages';

languages.registerLocale(require("@cospired/i18n-iso-languages/langs/en.json"));

export default function CreateProfile({ userId, onProfileCreated }) {
  // Visible state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [language, setLanguage] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');

  // Hidden state for future features
  const [dates, setDates] = useState('');
  const [travel, setTravelLocation] = useState('');

  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Non-binary', value: 'non-binary' },
    { label: 'Prefer not to say', value: 'prefer-not-to-say' }
  ];

  // Get all countries
  const countries = Country.getAllCountries().map(country => ({
    label: country.name,
    value: country.isoCode
  }));

  // Get states for selected country
  const states = selectedCountry 
    ? State.getStatesOfCountry(selectedCountry).map(state => ({
        label: state.name,
        value: state.isoCode
      }))
    : [];

  // Get cities for selected state
  const cities = selectedState
    ? City.getCitiesOfState(selectedCountry, selectedState).map(city => ({
        label: city.name,
        value: city.name
      }))
    : [];

  // Get all languages
  const languageOptions = Object.entries(languages.getNames('en'))
    .map(([code, name]) => ({
      label: name,
      value: code
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const handleCountryChange = (value) => {
    setSelectedCountry(value);
    setSelectedState('');
    setSelectedCity('');
  };

  const handleStateChange = (value) => {
    setSelectedState(value);
    setSelectedCity('');
  };

  const validateForm = () => {
    if (!firstName.trim()) return 'First name is required';
    if (!lastName.trim()) return 'Last name is required';
    if (!language) return 'Please select a language';
    if (!age) return 'Age is required';
    if (!gender) return 'Please select a gender';
    if (!selectedCountry) return 'Please select a country';
    if (!bio.trim()) return 'Please provide a short bio';
    if (isNaN(age) || parseInt(age) < 18 || parseInt(age) > 120) return 'Please enter a valid age between 18 and 120';
    return '';
  };

  const handleProfileCreation = async () => {
    try {
      const validationError = validateForm();
      if (validationError) {
        setError(validationError);
        return;
      }

      const countryName = Country.getCountryByCode(selectedCountry)?.name;
      const stateName = State.getStateByCodeAndCountry(selectedState, selectedCountry)?.name;

      await updateDoc(doc(db, 'users', userId), {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        language: languages.getName(language, 'en'),
        age: parseInt(age),
        gender,
        location: {
          country: countryName,
          state: stateName || '',
          city: selectedCity || ''
        },
        hobbies: hobbies.trim(),
        bio: bio.trim(),
        // Include hidden fields in the database
        travelPreferences: {
          dates: dates,
          travelLocation: travel
        },
        updatedAt: new Date().toISOString()
      });

      console.log('Profile created successfully');
      onProfileCreated();
    } catch (error) {
      console.error('Error creating profile:', error);
      setError('Failed to create profile. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>Create Your Profile</Text>
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your first name"
            value={firstName}
            onChangeText={setFirstName}
            onFocus={() => setError('')}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your last name"
            value={lastName}
            onChangeText={setLastName}
            onFocus={() => setError('')}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Language</Text>
          <View style={styles.pickerWrapper}>
            <RNPickerSelect
              onValueChange={setLanguage}
              items={languageOptions}
              style={pickerSelectStyles}
              placeholder={{ label: 'Select a language', value: null }}
              value={language}
              onOpen={() => setError('')}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your age"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
            maxLength={3}
            onFocus={() => setError('')}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.pickerWrapper}>
            <RNPickerSelect
              onValueChange={setGender}
              items={genderOptions}
              style={pickerSelectStyles}
              placeholder={{ label: 'Select your gender', value: null }}
              value={gender}
              onOpen={() => setError('')}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Country</Text>
          <View style={styles.pickerWrapper}>
            <RNPickerSelect
              onValueChange={handleCountryChange}
              items={countries}
              style={pickerSelectStyles}
              placeholder={{ label: 'Select a country', value: null }}
              value={selectedCountry}
              onOpen={() => setError('')}
            />
          </View>
        </View>

        {selectedCountry && states.length > 0 && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>State/Province</Text>
            <View style={styles.pickerWrapper}>
              <RNPickerSelect
                onValueChange={handleStateChange}
                items={states}
                style={pickerSelectStyles}
                placeholder={{ label: 'Select a state', value: null }}
                value={selectedState}
              />
            </View>
          </View>
        )}

        {selectedState && cities.length > 0 && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>City</Text>
            <View style={styles.pickerWrapper}>
              <RNPickerSelect
                onValueChange={setSelectedCity}
                items={cities}
                style={pickerSelectStyles}
                placeholder={{ label: 'Select a city', value: null }}
                value={selectedCity}
              />
            </View>
          </View>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Hobbies</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your hobbies"
            value={hobbies}
            onChangeText={setHobbies}
            onFocus={() => setError('')}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Short Bio</Text>
          <TextInput
            style={[styles.input, styles.bioInput]}
            placeholder="Tell us about yourself"
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={4}
            onFocus={() => setError('')}
          />
        </View>

        <TouchableOpacity 
          onPress={handleProfileCreation} 
          style={styles.button}
        >
          <Text style={styles.buttonText}>Create Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  pickerWrapper: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff',
    width: '100%',
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#dc3545',
    marginBottom: 10,
    textAlign: 'center',
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: 'black',
    width: '100%',
    height: 40,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: 'black',
    width: '100%',
    height: 40,
  },
});