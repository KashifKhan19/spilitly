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
import { SelectList } from 'react-native-dropdown-select-list';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './connectionToBackend';

const AddVehicle = ({ navigation }) => {
    const [selectedVehicle, setSelectedVehicle] = useState('bike');
    const [selectedMake, setMake] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [selectedLicensePlateNumber, setSelectedLicensePlateNumber] = useState('');
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

    const handleSubmit = async () => {
        if (!userToken) {
            console.error('User token not found');
            return;
        }
        if(!selectedVehicle || !selectedMake || !selectedModel || !selectedLicensePlateNumber){
            Alert.alert('Please Fill all fields');
            return;
        }

        try {
            const response = await fetch(BASE_URL + '/vehicles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: userToken // Include user token in headers
                },
                body: JSON.stringify({
                    type: selectedVehicle,
                    make: selectedMake,
                    model: selectedModel,
                    plateNumber: selectedLicensePlateNumber,
                })
            });

            if (response.ok) {
                Alert.alert('Success', 'Vehicle added successfully');
                navigation.navigate('VehicleLicense');
            } else {
                const errorMessage = await response.text();
                Alert.alert('Error', errorMessage);
            }
        } catch (error) {
            console.error('Error adding vehicle:', error);
            Alert.alert('Error', 'Failed to add vehicle');
        }
    };

    const vehicles = [
        { label: 'Bike', value: 'bike' },
        { label: 'Car', value: 'car' },
    ];

    const make = [
        { label: 'Honda', value: 'Honda' },
        { label: 'Toyota', value: 'Toyota' },
        { label: 'Suzuki', value: 'Suzuki' },
        { label: 'Hyundai', value: 'Hyundai' },
        { label: 'Kia', value: 'Kia' },
    ];

    const model = [
        { label: 'Corolla', value: 'Corolla' },
        { label: 'Civic', value: 'Civic' },
        { label: 'Mehran', value: 'Mehran' },
        { label: 'City', value: 'City' },
        { label: 'Mark X', value: 'Mark X' },
        { label: 'Sportage', value: 'Sportage' },
        { label: 'Alto', value: 'Alto' },
        { label: 'Bolan', value: 'Bolan' },
        { label: 'Swift', value: 'Swift' },
        { label: 'Cultus', value: 'Cultus' },
        { label: 'FX', value: 'FX' },
        { label: 'Vego', value: 'Vego' },
        { label: 'Prado', value: 'Prado' },
        { label: 'Surf', value: 'Surf' },
        { label: 'Axio', value: 'Axio' },
        { label: 'Vitz', value: 'Vitz' },
        { label: 'X corolla', value: 'X corolla' },
        { label: 'Indus', value: 'Indus' },
        { label: 'Picato', value: 'Picatoar' },
        { label: 'Elantra', value: 'Elantra' },
        { label: 'Sonata', value: 'Sonata' },
    ];

    return (
        <View style={styles.background}>
            <Image source={require('../assets/AddVehicle.png')} style={styles.backgroundImage} />
            <View style={styles.container}>
                <Text style={styles.textheadings}>Vehicle Type</Text>
                <View style={{ width: '100%', backgroundColor: '#D3D3D3', borderRadius: 10, borderColor: '#D3D3D3' }}>
                    <SelectList
                        setSelected={(val) => setSelectedVehicle(val)}
                        data={vehicles}
                        save="value"
                        dropdownStyles={{
                            backgroundColor: "grey",
                        }}
                    />
                </View>
                <Text style={styles.textheadings}>Make</Text>
                <View style={{ width: '100%', backgroundColor: '#D3D3D3', borderRadius: 10, borderColor: '#D3D3D3' }}>
                    <SelectList
                        setSelected={(val) => setMake(val)}
                        data={make}
                        save="value"
                        dropdownStyles={{
                            backgroundColor: "grey",
                        }}
                    />
                </View>
                <Text style={styles.textheadings}>Model</Text>
                <View style={{ width: '100%', backgroundColor: '#D3D3D3', borderRadius: 10, borderColor: '#D3D3D3' }}>
                    <SelectList
                        setSelected={(val) => setSelectedModel(val)}
                        data={model}
                        save="value"
                        dropdownStyles={{
                            backgroundColor: "grey",
                        }}
                    />
                </View>

                <Text style={styles.textheadings}>License Plate Number</Text>
                <TextInput
                    style={styles.textInput}
                    onChangeText={setSelectedLicensePlateNumber}
                    placeholder='e.g: QAB-52'
                />


            </View>
            <TouchableOpacity style={styles.arrowContainer} onPress={handleSubmit}>
                <Image source={require('../assets/arrow.png')} style={styles.arrowImage} />
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
        width: '90%',
        position: 'relative',
        zIndex: 1
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
        paddingTop: 20,
        color: '#19191C',
        fontSize: 20,
        paddingBottom: 10
    },
    textInput: {
        width: "100%",
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#D3D3D3'
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

export default AddVehicle;