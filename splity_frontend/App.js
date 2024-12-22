import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import WelcomeScreen from './screens/welcomescreen';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import IDVerificationScreen from './screens/IDVerificationScreen';
import VehicleLicense from './screens/VehicleLicense';
import AddVehicle from './screens/AddVechicleScreen';
import EditProfile from './screens/EditProfile';
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/settings';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLogged, setIsLogged] = useState(false);

  const checkToken = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      setIsLogged(true);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLogged ? (
          <>
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen
              name="IDVerificationScreen"
              component={IDVerificationScreen}
            />
            <Stack.Screen name="EditProfile" component={EditProfile} />
            <Stack.Screen name="AddVehicle" component={AddVehicle} />
            <Stack.Screen name="VehicleLicense" component={VehicleLicense} />
            <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
            <Stack.Screen name="SignInScreen" component={SignInScreen} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
            <Stack.Screen name="SignInScreen" component={SignInScreen} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
            <Stack.Screen
              name="IDVerificationScreen"
              component={IDVerificationScreen}
            />
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
            <Stack.Screen name="AddVehicle" component={AddVehicle} />
            <Stack.Screen name="VehicleLicense" component={VehicleLicense} />
            <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}