import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './connectionToBackend';

const SignUpScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setphoneNumber] = useState('');
  const [institution, setinstitution] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');

  const submitSignUp = async () => {
    try {
      if (!fullName || !email || !phoneNumber || !institution || !password || !confirmPassword) {
        Alert.alert('Error', 'Please fill in all fields.');
        return;
      } else if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match.');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[0-9]{11}$/;

      if (!emailRegex.test(email)) {
        Alert.alert('Error', 'Invalid email format');
        return;
      }

      if (!phoneRegex.test(phoneNumber)) {
        Alert.alert('Error', 'Invalid phone number format');
        return;
      }

      const phoneNumberAsString = phoneNumber.toString();

      // Check if user already exists
      const checkResponse = await fetch(BASE_URL + "/check-existing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          phoneNumber: phoneNumberAsString
        })
      });
      const checkData = await checkResponse.json();
      if (checkData.emailExists || checkData.phoneExists) {
        Alert.alert('Error', 'User with this email or phone number already exists. Please use a different one.');
        return;
      }

      // If user does not exist, proceed with signup
      const signUpResponse = await fetch(BASE_URL + "/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName,
          email: email,
          phoneNumber: phoneNumberAsString,
          institution: institution,
          password: password
        })
      });
      const signUpData = await signUpResponse.json();

      // Store token in AsyncStorage
      await AsyncStorage.setItem('userToken', signUpData.token);

      console.log(signUpData);

      Alert.alert('Signup Successful', 'You have successfully signed up.');
      navigation.navigate('IDVerificationScreen');
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An error occurred while signing up. Please try again.');
    }
  };


  return (
    <View style={styles.background}>
      <Image source={require('../assets/signup.png')} style={styles.backgroundImage} />
      <View style={styles.container}>
        <Text style={styles.textheadings}>Full Name</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={setFullName}
        />

        <Text style={styles.textheadings}>Email</Text>
        <TextInput
          style={styles.textInput}
          keyboardType='email-address'
          onChangeText={setEmail}
        />
        <Text style={styles.textheadings}>Phone No.</Text>
        <TextInput
          style={styles.textInput}
          keyboardType='number-pad'
          onChangeText={setphoneNumber}
        />

        <Text style={styles.textheadings}>Institution</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={setinstitution}
        />
        <Text style={styles.textheadings}>Password</Text>
        <TextInput
          style={styles.textInput}
          secureTextEntry={true}
          onChangeText={setPassword}
        />

        <Text style={styles.textheadings}>Confirm Password</Text>
        <TextInput
          style={styles.textInput}
          secureTextEntry={true}
          onChangeText={setconfirmPassword}
        />
      </View>
      <TouchableOpacity style={styles.arrowContainer} onPress={submitSignUp}>
        <Image source={require('../assets/arrowwhite.png')} style={styles.arrowImage} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    top: 280,
    width: "80%",
    // borderWidth: 2
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    resizeMode:'cover'
  },
  textheadings: {
    paddingTop: 10,
    color: '#FFFFFF',
    fontSize: 26,
  },
  textInput: {
    borderBottomWidth: 1,
    width: "90%",
    paddingTop: 5,
    paddingBottom: 5,
    borderColor: '#FFFFFF',
    fontSize: 18,
    color: 'white',
    fontSize: 26
  },
  arrowContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,

  },
  arrowImage: {
    position: 'absolute',
    width: 50,
    height: 50,
    resizeMode: 'contain',
    bottom: 10,
    right: 20
  },

});

export default SignUpScreen;
