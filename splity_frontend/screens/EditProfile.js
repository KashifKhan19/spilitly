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

const EditProfile = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [fullName, setfullName] = useState('');
    const [phoneNo, setphoneNo] = useState('');

    const [userToken, setUserToken] = useState(null);

    useEffect(() => {
        getUserToken();
    }, []);

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

    const handleSignIn = async () => {
        try {
            const response = await fetch(BASE_URL + '/update_user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: userToken // Include user token in headers
                },
                body: JSON.stringify({
                    fullName:fullName,
                    email:email,
                    phoneNumber:phoneNo
                })
            });

            if (response.ok) {
                Alert.alert('Success', 'Updated successfully');
                navigation.navigate('HomeScreen');
            } else {
                const errorMessage = await response.text();
                Alert.alert('Error', errorMessage);
            }
        } catch (error) {
            console.error('Error updating:', error);
            Alert.alert('Error', 'Failed to update');
        }
    };

    return (
        <View style={styles.background}>
            <View style={styles.header}>
                <TouchableOpacity style={{alignSelf: 'flex-start', right: 160 }} onPress={() => navigation.navigate('HomeScreen')}>
                    <Image source={require('../assets/backarrow.png')} style={{ width: 30, height: 30, }} />
                </TouchableOpacity>

                <Text style={{fontSize: 20, right: 20, fontWeight: 'bold'}}>
                    Edit Profile
                </Text>
            </View>
            <View style={styles.container}>
                <Text style={styles.textheadings}>Full Name</Text>
                <TextInput
                    style={styles.textInput} 
                    onChangeText={setfullName}
                />
                <Text style={styles.textheadings}>Email</Text>
                <TextInput
                    style={styles.textInput}
                    keyboardType="email-address"
                    onChangeText={setEmail}
                />
                <Text style={styles.textheadings}>Phone No.</Text>
                <TextInput
                    style={styles.textInput}
                    keyboardType="email-address"
                    onChangeText={setphoneNo}
                />

                <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
                    <Text style={{ color: '#FFFFFF', fontSize: 18 }}>SUBMIT</Text>
                </TouchableOpacity>
            </View>
        </View >
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        top: 80,
    },
    container: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
        top: 0,
        marginBottom: 400,
        width:"80%"
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
        paddingTop: 30,
        color: 'black',
        fontSize: 20,
    },
    header:{
        flexDirection: 'row',
        
    },
    textInput: {
        borderBottomWidth: 1,
        width: 320,
        paddingBottom: 10,
        borderColor: 'black',
        width:"100%"
    },
    signInButton: {
        backgroundColor: '#BA9CEE',
        borderRadius: 5,
        borderColor: '#BA9CEE',
        top: 70,
        width: '100%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        left: 0,
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

export default EditProfile;
