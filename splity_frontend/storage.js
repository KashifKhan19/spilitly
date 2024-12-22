import AsyncStorage from '@react-native-async-storage/async-storage';

const storeUserData = async (userData) => {
  try {
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
    console.log('User data stored successfully');
  } catch (error) {
    console.error('Error storing user data:', error);
  }
};

export { storeUserData };