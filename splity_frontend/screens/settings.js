import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Switch
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './connectionToBackend';
import axios from 'axios';
import * as ImageManipulator from 'expo-image-manipulator'
import * as FileSystem from 'expo-file-system'

const SettingsScreen = ({ navigation, showHalfScreen, setShowHalfScreen, name }) => {
    const [isEnabled, setIsEnabled] = useState(false);
    const [userImage, setUserImage] = useState(null);
    const [userImagebase64, setUserImagebase64] = useState(null);

    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.2,
            base64: false,
            cropping: true
        });

        const compressedImage = await ImageManipulator.manipulateAsync(
            result.assets[0].uri,
            [{ resize: { width: 50 } }],
            { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
        );

        const base64String = await FileSystem.readAsStringAsync(compressedImage.uri, {
            encoding: FileSystem.EncodingType.Base64
        });

        setUserImage(compressedImage.uri);
        console.log(base64String)
        setUserImagebase64(base64String);
        await uploadImage()
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                const response = await fetch(`${BASE_URL}/get-user-profile`, {
                    method: 'POST',
                    headers: {
                        Authorization: token,
                    },
                });

                if (!response.ok) {
                    return;
                }

                const data = await response.json();
                setUserImagebase64(data.profilePicture);
            } catch (error) {
                console.error('Error fetching profile picture:', error);
                Alert.alert('Error', 'Failed to fetch profile picture');
            }
        };

        fetchUserProfile();
    }, []);

    const uploadImage = async (imageUri) => {
        try {
            const userToken = await AsyncStorage.getItem('userToken');
            const response = await axios.post(BASE_URL + '/upload-user-dp', {
                userImageBase64: userImagebase64,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: userToken
                }
            });

            console.log('Image upload successful:', response.data);
            Alert.alert('Image upload successful:');
        } catch (error) {
            console.error('Error uploading ID card images:', error);
            Alert.alert('Upload failed!');
        }
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('userToken');
            Alert.alert("Logged out!")
            navigation.navigate('SignInScreen');
        } catch (error) {
            console.error('Error clearing token:', error);
        }
    };


    return (
        <View style={styles.overlay}>
            <View style={styles.halfScreen}>
                <View style={styles.background}>
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => setShowHalfScreen(false)}
                        >
                            <Image source={require('../assets/backarrow.png')} style={styles.backArrow} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.container1}>
                        <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
                            {userImagebase64 ? (
                                <Image
                                    source={{ uri: `data:image/jpeg;base64,${userImagebase64}` }}
                                    style={styles.profileImage}
                                />
                            ) : (
                                <Image
                                    source={require('../assets/Profile.png')}
                                    style={styles.profileImage}
                                />
                            )}
                        </TouchableOpacity>
                        <Text style={{ fontSize: 26, fontWeight: 'bold' }}>
                            Hi, {name}
                        </Text>
                        <View style={styles.optionsparent}>
                            <TouchableOpacity style={styles.options} onPress={() => navigation.navigate("EditProfile")}>
                                <Text style={styles.text}>Edit Profile</Text>
                                <Image source={require('../assets/nextarrow.png')} style={styles.nextArrow} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.options} onPress={() => navigation.navigate("AddVehicle")}>
                                <Text style={styles.text}>Add a Vehicle</Text>
                                <Image source={require('../assets/nextarrow.png')} style={styles.nextArrow} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.options} onPress={() => navigation.navigate("")}>
                                <Text style={styles.text}>Change Password</Text>
                                <Image source={require('../assets/nextarrow.png')} style={styles.nextArrow} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.options} onPress={() => navigation.navigate("")}>
                                <Text style={styles.text}>FAQs & Help</Text>
                                <Image source={require('../assets/nextarrow.png')} style={styles.nextArrow} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.options}>
                                <Text style={styles.text}>Push Notification</Text>
                                <Switch
                                    trackColor={{ false: '#767577', true: '#C08AFF' }}
                                    thumbColor={isEnabled ? 'white' : '#f4f3f4'}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={toggleSwitch}
                                    value={isEnabled}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginTop: 220, right: 60 }}>
                            <TouchableOpacity style={styles.exit} onPress={handleLogout}>
                                <Image source={require('../assets/exit.png')} style={styles.exitImage} />
                                <Text style={styles.exitText}>Sign Out</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default SettingsScreen;

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'flex-end',
        zIndex: 5,

    },
    halfScreen: {
        width: '70%',
        height: '100%',
        backgroundColor: 'white',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
    },
    background: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        borderRadius: 20,
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        padding: 10,
    },
    backButton: {
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 10,
        padding: 5,
    },
    backArrow: {
        width: 30,
        height: 30,
    },
    container1: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 20,
        width: '100%',
    },
    imageContainer: {
        width: 150,
        height: 150,
        borderRadius: 75,
        overflow: 'hidden',
        backgroundColor: '#ccc',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    optionsparent: {
        width: '100%',
        height:"50%",
        paddingVertical: 10,
    },
    options: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderBottomWidth: 0.5,
        height: '20%'
    },
    text:{
        fontSize: 20,
        left:5
    },
    nextArrow: {
        width: 10,
        height: 10,
    },
    exit: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        bottom: 50,
        right: 40
    },
    exitImage: {
        width: 20,
        height: 20,
    },
    exitText: {
        left: 20,
        color: '#FF0101',
        fontSize: 17,
    }, profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
    },
});
