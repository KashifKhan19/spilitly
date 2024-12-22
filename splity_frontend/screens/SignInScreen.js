import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './connectionToBackend';

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogged, setIsLogged] = useState(null);

  const handleSignIn = async () => {
    try {
      const signInResponse = await fetch(BASE_URL + "/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });
  
      if (!signInResponse.ok) {
        throw new Error('Invalid email or password');
      }
  
      const signInData = await signInResponse.json();
  
      // Store token in AsyncStorage
      await AsyncStorage.setItem('userToken', signInData.token);
  
      Alert.alert('Sign in Successful.');
      navigation.navigate('HomeScreen');
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', error.message || 'An error occurred while signing in. Please try again.');
    }
  };

  return (
    <View style={styles.background}>
      <Image source={require('../assets/login.png')} style={styles.backgroundImage} />

      <View style={styles.container}>
        <Text style={styles.textheadings}>Email</Text>
        <TextInput
          style={styles.textInput}
          keyboardType="email-address"
          onChangeText={setEmail}
        />

        <Text style={styles.textheadings}>Password</Text>
        <TextInput
          style={styles.textInput}
          secureTextEntry={true}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={{ left: 150, padding: 20, paddingBottom: 80 }}>
          <Text style={{ color: '#FFFFFF', fontSize: 15.98 }}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signInButton}
          onPress={handleSignIn}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 22 }}>Sign in</Text>
        </TouchableOpacity>

        <View style={styles.signUpTextContainer}>
          <Text style={{ color: '#FFFFFF', fontSize: 14 }}>Don't have an account? { }</Text>
          <TouchableOpacity style={styles.signUpLink} onPress={() => navigation.navigate('SignUpScreen')}>
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    top: 180
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  textheadings: {
    paddingTop: 10,
    color: '#FFFFFF',
    fontSize: 20,
  },
  textInput: {
    borderBottomWidth: 1,
    width: 320,
    paddingBottom: 5,
    borderColor: '#FFFFFF',
    fontSize: 18,
    color: 'white'
  },
  signInButton: {
    backgroundColor: '#BA9CEE',
    borderRadius: 5,
    borderColor: '#BA9CEE',
    width: 270,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    left: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signUpTextContainer: {
    flexDirection: 'row',
    top: 10,
    left: 40
  }
});

export default SignInScreen;
