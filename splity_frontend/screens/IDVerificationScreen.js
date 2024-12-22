import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './connectionToBackend';
import axios from 'axios';
import * as ImageManipulator from 'expo-image-manipulator'
import * as FileSystem from 'expo-file-system'

const IDVerificationScreen = ({ navigation }) => {
  const [imageUriFront, setImageUriFront] = useState(null);
  const [imageUriBack, setImageUriBack] = useState(null);
  const [userToken, setUserToken] = useState(null);

  const [base64Img_f, setBase64Img_f] = useState('')
  const [base64Img_b, setBase64Img_b] = useState('')

  const getUserToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        setUserToken(token);
      } else {
        console.log('No user token found');
      }
    } catch (error) {
      console.error('Error retrieving user token:', error);
    }
  };

  useEffect(() => {
    getUserToken();
  }, []);

  const selectImageFront = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    // if (!permissionResult.granted) {
    //   alert('Permission denied. You need to grant permission to access photos.');
    //   return;
    // }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.2,
      base64: false 
    });

    // Compress the image
    const compressedImage = await ImageManipulator.manipulateAsync(
      result.assets[0].uri,
      [{ resize: { width: 200 } }], 
      { compress: 1, format: ImageManipulator.SaveFormat.JPEG } 
    );

    // Encode the compressed image to base64
    const base64String = await FileSystem.readAsStringAsync(compressedImage.uri, {
      encoding: FileSystem.EncodingType.Base64
    });

    setImageUriFront(compressedImage.uri);
    setBase64Img_f(base64String);
  };

  const sendImageToServer = async () => {
    if (!imageUriFront || !imageUriBack) {
      Alert.alert("Please Select both Images");
      return
    }
    // console.log(imageUriBack_base64Data)
    try {
      const response = await axios.post(BASE_URL + '/upload-id-card', {
        idCardFrontBase64: base64Img_f,
        idCardBackBase64: base64Img_b

      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: userToken
        }
      });

      console.log('Image upload successful:', response.data);
      Alert.alert('Image upload successful:');
      navigation.navigate("HomeScreen")
    } catch (error) {
      console.error('Error uploading ID card images:', error);
      Alert.alert('Upload failed!');
    }
  };

  const selectImageBack = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    // console.log(imageUriFront)
    // if (!permissionResult.granted) {
    //   alert('Permission denied. You need to grant permission to access photos.');
    //   return;
    // }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.2,
      base64: false

    });

    // Compress the image
    const compressedImage = await ImageManipulator.manipulateAsync(
      pickerResult.assets[0].uri,
      [{ resize: { width: 200 } }], 
      { compress: 1, format: ImageManipulator.SaveFormat.JPEG } 
    );

    // Encode the compressed image to base64
    const base64String = await FileSystem.readAsStringAsync(compressedImage.uri, {
      encoding: FileSystem.EncodingType.Base64
    });

    setImageUriBack(compressedImage.uri);
    setBase64Img_b(base64String);
  };

  return (
    <View style={styles.background}>
      <Image source={require('../assets/IDVerify.png')} style={styles.backgroundImage} />

      <View style={styles.container}>
        <Text style={styles.textheadings}>ID Card - Front Side</Text>

        <TouchableOpacity onPress={selectImageFront} style={styles.imageButton}>
          <Image
            source={imageUriFront ? { uri: imageUriFront } : require('../assets/IDfront.png')} style={styles.image} />
        </TouchableOpacity>
        <Text style={styles.textheadings}>ID Card - Back Side</Text>

        <TouchableOpacity onPress={selectImageBack} style={styles.imageButton}>
          <Image
            source={imageUriBack ? { uri: imageUriBack } : require('../assets/IDBack.png')} style={styles.image} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={sendImageToServer}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
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
    justifyContent: 'flex-start',
    top: 200,
    width: "90%",
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
    // paddingTop: 10,
    color: '#000000',
    fontSize: 26,
    fontWeight: 'bold',
  },
  imageButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#CCCCCC',
    borderRadius: 50,
    marginTop: 10,
    left: 40,
    marginBottom: 30,
    resizeMode: 'cover',
    width: '80%',
    height: '25%'
  },
  submitButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    left: "65%"
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    width: 400,
    height: 250,
    resizeMode: 'cover',
    borderRadius: 50
  }
});

export default IDVerificationScreen;