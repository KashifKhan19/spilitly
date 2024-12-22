import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, FlatList, ActivityIndicator, Linking, } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import io from 'socket.io-client';
import { Picker } from '@react-native-picker/picker';

import SettingsScreen from './settings';
import styles from './For_homeScreen/styles';

import { BASE_URL } from './connectionToBackend';
const apikey = 'AIzaSyBklFQ0MG6N2SuenHhjeAhqQGiVeGhWAh0';


export default function HomeScreen({ navigation }) {
    const [userData, setUserData] = useState(null);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [origin, setOrigin] = useState({
        latitude: 30.218617,
        longitude: 66.975482,
    });
    const [destination, setDestination] = useState({
        latitude: 30.267259,
        longitude: 66.944148,
    });
    const [distance, setDistance] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showHalfScreen, setShowHalfScreen] = useState(false);
    const buttonRef = useRef(null);
    const indicatorRef = useRef(null);
    const [rideID, setRideId] = useState(null);
    const [rides, setRides] = useState([]);
    const [destinationEnter, setdestinationEnter] = useState(true);
    const [selection, setselection] = useState(false);
    const [riderSelected, setRiderSelected] = useState('OfferRide');
    const [selectedRider, setSelectedRider] = useState(false);
    const [selectedPassenger, setSelectedPassenger] = useState(false);
    const [myPassenger, setMyPassenger] = useState([]);
    const [myDriver, setMyDriver] = useState([]);
    const [seats, setSeats] = useState(0);
    const [money, setMoney] = useState(0);
    const [requestSetion, setRequestSetion] = useState(false);
    const [vechicleData, setvechicleData] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [pendingRequestId, setPendingRequestId] = useState(null);
    const [waitforResponse, setWaitForResponse] = useState(false);
    const [myDriverData, setMyDriverData] = useState({});
    const [passengerCommunication, setPassengerCommunication] = useState(false);

    useEffect(() => {
        const fetchPendingRequests = async () => {
            try {
                const longitude = '66.969465';
                const latitude = '30.197552';

                const response = await axios.post(BASE_URL + '/pendingRequests', {
                    longitude,
                    latitude
                });
                const filteredRequestIds = await getFilteredRequests();

                const updatedRequests = response.data.requests.filter((req) => !filteredRequestIds.includes(req._id));
                setPendingRequests(updatedRequests)
            } catch (error) {
                console.error('Error retrieving pending requests:', error);
                setErrorMessage('An error occurred while retrieving pending requests');
            }
        };

        const fetchUserData = async () => {
            try {
                const userToken = await AsyncStorage.getItem('userToken');
                const response = await axios.post(BASE_URL + '/retrieve_user', {}, {
                    headers: {
                        'Authorization': userToken
                    }
                });

                setUserData(response.data.data);
            } catch (error) {
                console.error('Error retrieving user data:', error);
                setErrorMessage('An error occurred while retrieving user data');
            }
        };

        const getUserLocation = async () => {
            // try {
            //     const { status } = await Location.requestForegroundPermissionsAsync();
            //     if (status !== 'granted') {
            //         console.error('Location permission not granted');
            //         return;
            //     }

            //     const location = await Location.getCurrentPositionAsync({});
            //     setOrigin({ latitude: location.coords.latitude, longitude: location.coords.longitude });
            //     console.log('orgine', origin);
            // } catch (error) {
            //     console.error('Error getting user location:', error);
            // }
        };

        const fetchRides = async () => {
            try {
                const response = await fetch(`${BASE_URL}/getRides`, {
                });
                const data = await response.json();
                if (response.ok) {
                    setRides(data.rides);
                } else {
                    console.error('Failed to fetch rides:', data.error || 'Unknown error');
                }
            } catch (error) {
                console.error('Error fetching rides:', error);
            }
        };

        fetchPendingRequests();
        getUserLocation();
        fetchUserData();
        fetchVehicles();
        fetchRides();

        const fetchPendingRequestsInterval = setInterval(fetchPendingRequests, 5000);
        const fetchRidesInterval = setInterval(fetchRides, 5000);
        const fetchVehiclesInterval = setInterval(fetchRides, 30000);

        const socket = io(BASE_URL);
        socket.on('connect', () => {
            console.log('Connected to socket server');
        });

        socket.on('rideCompleted', (data) => {
            Alert.alert('Ride Completed', 'Your ride has been marked as complete by the driver.');
            setPassengerCommunication(false);
            setdestinationEnter(true);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from socket server');
        });

        return () => {
            clearInterval(fetchPendingRequestsInterval);
            clearInterval(fetchRidesInterval);
            clearInterval(fetchVehiclesInterval);
            socket.disconnect();
        };


    }, [myPassenger]);

    const fetchVehicles = async () => {
        try {
            const userToken = await AsyncStorage.getItem('userToken');
            const response = await axios.post(
                `${BASE_URL}/myVehicles`,
                {},
                {
                    headers: {
                        'Authorization': userToken,
                    },
                }
            );
            setvechicleData(response.data.data || []);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
            setError('An error occurred while fetching vehicles');
        }
    };

    const onPlaceSelected = (details, flag) => {
        const set = flag === setDestination;
        const position = {
            latitude: details?.geometry.location.lat || 0,
            longitude: details?.geometry.location.lng || 0,
        };
        set(position);

    };

    const handleContinue = () => {
        setdestinationEnter(false);
        setselection(true);
    };

    const riderOrPassenger = () => {
        if (riderSelected === 'OfferRide') {

            setSelectedRider(true);
            setselection(false);
        }
        else {
            setSelectedPassenger(true);
            setselection(false);
        }
    }

    const handleVehicleChange = (carDetails) => {
        setSelectedVehicle(carDetails)
    };

    const startRide = async () => {
        setSelectedRider(false)
        setRequestSetion(true)
        if (buttonRef.current && indicatorRef.current) {
            buttonRef.current.setNativeProps({ disabled: true });
            indicatorRef.current.setNativeProps({ style: { display: 'flex' } });
        }
        try {
            const userToken = await AsyncStorage.getItem('userToken');
            const response = await fetch(BASE_URL + '/createRide', {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: userToken },
                body: JSON.stringify({
                    availableSeats: seats,
                    origin: { coordinates: [30.197552, 66.975382] },
                    destination: /*{ coordinates: [destination.latitude, destination.longitude] }*/ { coordinates: [30.269032, 66.941206] },
                    date: new Date(),
                    status: 'ongoing',
                    splitMoney: money,
                    distance: distance,
                    carDetails: selectedVehicle,
                    driverNumber: userData.phoneNumber,
                    DriverDp: userData.profilePicture,
                    driverName: userData.fullName
                })
            });
            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', data.message);
                setRideId(data.rideId)
            } else {
                Alert.alert('Error', data.error || 'Failed to create ride');
            }
        } catch (error) {
            console.error('Error starting ride:', error);
            Alert.alert('Error', 'An unexpected error occurred');
        } finally {
            if (buttonRef.current && indicatorRef.current) {
                buttonRef.current.setNativeProps({ disabled: false });
                indicatorRef.current.setNativeProps({ style: { display: 'none' } });
            }
        }
    };

    const saveFilteredRequest = async (requestId) => {
        try {
            const existingFilteredRequests = await AsyncStorage.getItem('filteredRequests');
            let filteredRequests = existingFilteredRequests ? JSON.parse(existingFilteredRequests) : [];

            if (!filteredRequests.includes(requestId)) {
                filteredRequests.push(requestId);

                await AsyncStorage.setItem('filteredRequests', JSON.stringify(filteredRequests));
            }
        } catch (error) {
            console.error('Error saving filtered request:', error);
        }
    };

    const getFilteredRequests = async () => {
        try {
            const existingFilteredRequests = await AsyncStorage.getItem('filteredRequests');
            return existingFilteredRequests ? JSON.parse(existingFilteredRequests) : [];
        } catch (error) {
            console.error('Error retrieving filtered requests:', error);
            return [];
        }
    };

    const removeRequest = async (requestId) => {
        try {
            await saveFilteredRequest(requestId);

            const updatedRequests = pendingRequests.filter((request) => request._id !== requestId);
            setPendingRequests(updatedRequests);

            const userToken = await AsyncStorage.getItem('userToken');
            const response = await fetch(BASE_URL + '/updateRequestStatus', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: userToken },
                body: JSON.stringify({ requestId, action: 'reject' })
            });

            const data = await response.json();

            if (data.request) {
                setPendingRequests((prevRequests) => prevRequests.filter((request) => request._id !== requestId));
            } else {
                console.error('Request data not found in response');
            }
        } catch (error) {
            console.error('Error rejecting request:', error);
        }


    };

    const requestAccept = async (requestId, rideId) => {
        try {
            const response = await axios.put(BASE_URL + '/updateRequestStatus', {
                requestId,
                rideId,
                action: 'accept'
            }, {});

            if (response.data.request) {
                const { passenger } = response.data.request;
                Alert.alert('Request Accepted', `Passenger: ${passenger.name}\nLocation: ${response.data.request.origin.coordinates}\nDestination: ${response.data.request.destination.coordinates}`, [
                    {
                        text: 'Call',
                        onPress: () => Linking.openURL(`tel:${passenger.phoneNumber}`)
                    },
                    {
                        text: 'Message',
                        onPress: () => Linking.openURL(`sms:${passenger.phoneNumber}`)
                    },
                    { text: 'OK' }
                ]);
                setMyPassenger((prevRequests) => [...prevRequests, response.data.request]);
            }
        } catch (error) {
            console.error('Error accepting request:', error);
        }
    };

    const handleRideCompleted = async () => {
        try {
            const response = await axios.put(BASE_URL + '/updateRideStatus', {
                status: 'complete',
                rideId: rideID
            });

            if (response.status === 200) {
                Alert.alert('Success', 'Ride status updated to complete');
                setMyPassenger([]);
                setMyDriver([])
                setdestinationEnter(true);
                setRequestSetion(false);
                setSelectedRider(false);
            } else {
                Alert.alert('Error', 'Failed to update ride status');
            }
        } catch (error) {
            console.error('Error updating ride status:', error);
            Alert.alert('Error', 'An error occurred while updating ride status');
        }
    };

    const createRequest = async (driverId, driverName, rideId) => {
        try {
            const userToken = await AsyncStorage.getItem('userToken');
            const response = await fetch(`${BASE_URL}/createRequest`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: userToken,
                },
                body: JSON.stringify({
                    passengerName: userData.fullName,
                    origin: [30.219229, 66.990597],
                    destination: [30.267259, 66.944148],
                    passengerNumber: userData.phoneNumber,
                    passengerDp: userData.profilePicture,
                    requestedTo: driverId,
                    rideId: rideId.toString(),
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setPendingRequestId(data.request._id);
                setWaitForResponse(true)
                setSelectedPassenger(false)
                waitForResponse(data.request._id, driverName);
            } else {
                console.error('Failed to create request:', data.error || 'Unknown error');
            }
        } catch (error) {
            console.error('Error creating request:', error);
        }
    };

    const waitForResponse = (requestId, driverName) => {
        const intervalId = setInterval(async () => {
            try {
                const response = await fetch(`${BASE_URL}/getRequestStatus/${requestId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    if (data.request.status === 'accepted') {
                        clearInterval(intervalId);
                        setMyDriver((prevRequests) => [...prevRequests, data.rideDetails]);
                        setMyDriverData(data.rideDetails)
                        setSelectedPassenger(false);
                        setWaitForResponse(false);
                        setPassengerCommunication(true);
                        Alert.alert(
                            'Request Accepted',
                            `Your ride request has been accepted by ${rideDetails.driverName}. Contact details: ${rideDetails.driverNumber}.`
                        );
                    } else if (data.request.status === 'rejected') {
                        clearInterval(intervalId);
                        setSelectedPassenger(true)
                        setWaitForResponse(false)
                        Alert.alert(
                            'Request Rejected',
                            `Your ride request has been rejected by ${driverName}.`,
                            [
                                { text: 'OK', onPress: () => { setSelectedPassenger(true); setWaitForResponse(false); } }
                            ]
                        );
                    }
                } else {
                    console.error('Failed to get request status:', data.error || 'Unknown error');
                }
            } catch (error) {
                return
            }
        }, 5000);
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                showsUserLocation={true}
                followsUserLocation={true}
                initialRegion={{
                    latitude: origin.latitude,
                    longitude: origin.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                <Marker
                    coordinate={origin}
                    title="Me"
                    description="Current Location"
                    pinColor="blue"
                />

                {myPassenger.map((passenger, index) => (
                    <React.Fragment key={index}>
                        <Marker
                            key={index}
                            coordinate={{
                                latitude: passenger.origin.coordinates[0],
                                longitude: passenger.origin.coordinates[1],
                            }}
                            title={`Passenger ${index + 1}`}
                            description={`Name: ${passenger.passenger.name}\nPhone: ${passenger.passengerNumber}`}
                            pinColor="green"
                            onPress={() => Alert.alert(
                                'Passenger Info',
                                `Name: ${passenger.passenger.name}\nPhone: ${passenger.passengerNumber}`,
                                [
                                    {
                                        text: 'Call',
                                        onPress: () => Linking.openURL(`tel:${passenger.passengerNumber}`)
                                    },
                                    {
                                        text: 'Message',
                                        onPress: () => Linking.openURL(`sms:${passenger.passengerNumber}`)
                                    },
                                    { text: 'OK' }
                                ]
                            )}
                        />
                    </React.Fragment>
                ))}

                {myDriver.map((driver, index) => (
                    <React.Fragment key={index}>
                        <Marker
                            key={index}
                            coordinate={{
                                latitude: driver.origin.coordinates[0],
                                longitude: driver.origin.coordinates[1],
                            }}
                            title={`Driver`}
                            description={`Name: ${driver.driverName}\nPhone: ${driver.driverNumber}`}
                            pinColor="green"
                            onPress={() => Alert.alert(
                                'Driver Info',
                                `Name: ${driver.driverName}\nPhone: ${driver.driverNumber}\nCar: ${driver.carDetails[0].model}\nCar Number: ${driver.carDetails[0].plateNumber}`,
                                [
                                    {
                                        text: 'Call',
                                        onPress: () => Linking.openURL(`tel:${driver.driverNumber}`)
                                    },
                                    {
                                        text: 'Message',
                                        onPress: () => Linking.openURL(`sms:${driver.driverNumber}`)
                                    },
                                    { text: 'OK' }
                                ]
                            )}
                        />
                        <Marker
                            coordinate={{
                                latitude: driver.destination.coordinates[0],
                                longitude: driver.destination.coordinates[1],
                            }}
                            title={"Destination"}
                            pinColor="red"
                        />
                    </React.Fragment>
                ))}
                <Marker
                    coordinate={destination}
                    title={"Destination"}
                    pinColor="red"
                />
            </MapView>

            <TouchableOpacity style={styles.menuButton} onPress={() => setShowHalfScreen(true)}>
                <View style={styles.menuIcon}>
                    <View style={styles.menuBar} />
                    <View style={[styles.menuBar, { marginTop: 3 }]} />
                    <View style={[styles.menuBar, { marginTop: 3 }]} />
                </View>
            </TouchableOpacity>
            {showHalfScreen && (
                <SettingsScreen
                    showHalfScreen={showHalfScreen}
                    setShowHalfScreen={setShowHalfScreen}
                    name={userData.fullName}
                    navigation={navigation}
                />
            )}

            {destinationEnter && (
                <View style={styles.searchContainer}>
                    <Text style={styles.greetingText}>Hi, {userData ? userData.fullName : 'Loading...'}</Text>
                    <Text>Where are you going today?</Text>
                    <GooglePlacesAutocomplete
                        styles={{ textInput: styles.input }}
                        placeholder="Origin"
                        fetchDetails
                        onPress={data => onPlaceSelected(data, 'origin')}
                        query={{
                            key: { apikey },
                            language: 'en',
                        }}
                    />
                    <GooglePlacesAutocomplete
                        styles={{ textInput: styles.input }}
                        placeholder="Destination"
                        fetchDetails
                        onPress={data => onPlaceSelected(data, 'destination')}
                        query={{
                            key: { apikey },
                            language: 'en',
                        }}
                    />
                    <TouchableOpacity style={styles.nextButton} onPress={handleContinue}>
                        <Text style={{ color: 'white', fontSize: 12 }}>CONTINUE</Text>
                    </TouchableOpacity>
                </View>
            )}

            {selection && (
                <View style={styles.searchContainer}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: 15 }}>
                        <TouchableOpacity
                            style={riderSelected === 'OfferRide' ? styles.riderButtonOn : styles.riderButtonOff}
                            onPress={() => setRiderSelected('OfferRide')}>
                            <Text style={styles.greetingText}>Offer Ride</Text>
                            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 40 }}>{Math.ceil(duration)}</Text>
                                <Text style={{ fontSize: 10 }}>Est. minutes</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={riderSelected === 'findRide' ? styles.riderButtonOn : styles.riderButtonOff}
                            onPress={() => setRiderSelected('findRide')}>
                            <Text style={styles.greetingText}>Find a ride</Text>
                            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 40 }}>{Math.ceil(duration)}</Text>
                                <Text style={{ fontSize: 10 }}>Est. minutes</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.nextButton} onPress={riderOrPassenger}>
                        <Text style={{ color: 'white' }}>Continue</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* rider side */}
            {selectedRider && (
                <View style={styles.searchContainer}>
                    <View style={{ flexDirection: 'column', }}>
                        <View style={styles.carSelection}>
                            <Image source={require('../assets/Vectorcar.png')} style={{}} />
                            <Picker
                                style={{ width: '100%', }}
                                selectedValue={selectedVehicle}
                                onValueChange={(itemValue, itemIndex) => handleVehicleChange(itemValue)}
                            >
                                {vechicleData && vechicleData.map((vehicle) => (
                                    <Picker.Item
                                        key={vehicle._id}
                                        label={`       Model: ${vehicle.model}     Num: ${vehicle.plateNumber}`}
                                        value={{ plateNumber: vehicle.plateNumber, model: vehicle.model }}

                                    />
                                ))}
                            </Picker>
                        </View>


                        <View style={styles.otherSelection}>
                            <TouchableOpacity style={{
                                width: 50,
                                height: 50,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderTopLeftRadius: 10,
                                borderBottomLeftRadius: 10,
                                backgroundColor: '#EFEFEF',
                            }}
                                onPress={() => {
                                    if (seats > 0) {
                                        setSeats(seats - 1);
                                    }
                                }}
                            >
                                <Image source={require('../assets/minus.png')} />
                            </TouchableOpacity>

                            <View style={{ backgroundColor: '#EFEFEF', width: '60%', height: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginVertical: 15, }}>
                                <Text style={{ fontWeight: 'bold', }}>{seats} Seats</Text>
                                <Image style={{ width: 20, left: 5, height: 20, resizeMode: 'contain' }} source={require('../assets/seats.png')} />
                            </View>

                            <TouchableOpacity style={{
                                width: 50,
                                height: 50,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderTopRightRadius: 10,
                                borderBottomRightRadius: 10,
                                backgroundColor: '#EFEFEF'
                            }}
                                onPress={() => {
                                    if (seats < 5) {
                                        setSeats(seats + 1);
                                    }
                                }}>
                                <Image source={require('../assets/plus.png')} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.otherSelection}>
                            <TouchableOpacity style={{
                                width: 50,
                                height: 50,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderTopLeftRadius: 10,
                                borderBottomLeftRadius: 10,
                                backgroundColor: '#EFEFEF'
                            }}
                                onPress={() => {
                                    if (money > 0) {
                                        setMoney(money - 100);
                                    }
                                }}
                            >
                                <Image source={require('../assets/minus.png')} />
                            </TouchableOpacity>

                            <View style={{ backgroundColor: '#EFEFEF', width: '60%', height: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginVertical: 15, }}>
                                <Text style={{ fontWeight: 'bold', }}>{money} Money</Text>
                                <Image style={{ width: 20, left: 5 }} source={require('../assets/money.png')} />
                            </View>

                            <TouchableOpacity style={{
                                width: 50,
                                height: 50,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderTopRightRadius: 10,
                                borderBottomRightRadius: 10,
                                backgroundColor: '#EFEFEF'
                            }}
                                onPress={() => {
                                    if (money < 500) {
                                        setMoney(money + 100);
                                    }
                                }}>
                                <Image source={require('../assets/plus.png')} />
                            </TouchableOpacity>
                        </View>

                    </View>

                    <TouchableOpacity style={styles.nextButton} onPress={startRide}>
                        <Text style={{ color: 'white', fontSize: 12 }}>S T A R T  Y O U R  R I D E  N O W</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* PendingRequest */}
            {!selectedRider && requestSetion && (
                <View style={styles.flatListPendingRequests}>
                    <FlatList
                        contentContainerStyle={styles.flatListPendingRequestsContent}
                        data={pendingRequests}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <View style={styles.requestItem}>
                                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                    {item.passengerDp ? (<Image
                                        style={{ width: 50, height: 50, bottom: 10, borderRadius: 25 }}
                                        source={{ uri: `data:image/jpeg;base64,${item.passengerDp}` }}
                                    />) :
                                        <Image style={{ width: 50, height: 50, bottom: 10, borderRadius: 25 }} source={require('../assets/Profile.png')} />
                                    }

                                    <Text style={{ fontWeight: 'bold', right: 40 }}>{item.passenger.name} has Requested a{'\n'}ride on your route</Text>
                                    <TouchableOpacity style={{ borderWidth: 1, borderRadius: 15, bottom: 10, height: 30 }} onPress={() => removeRequest(item._id)}>
                                        <Image source={require('../assets/cross.png')} />
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity style={styles.nextButton} onPress={() => requestAccept(item._id, item.rideId)}>
                                    <Text style={{ color: 'white', fontSize: 12 }}> A C C E P T</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                    <View style={{ alignItems: 'flex-end' }}>
                        <TouchableOpacity style={styles.nextButton2} onPress={handleRideCompleted}>
                            <Text style={{ color: 'white', fontSize: 12 }}>Ride Completed</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* passenger side */}
            {selectedPassenger && (
                <View style={styles.searchContainer}>
                    <FlatList
                        data={rides}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, alignItems: 'center', borderBottomWidth: 1 }}>
                                {item.DriverDp ? (
                                    <Image
                                        style={{ width: 50, height: 50, resizeMode: 'cover', borderRadius: 25 }}
                                        source={{ uri: `data:image/jpeg;base64,${item.DriverDp}` }}
                                    />
                                ) : (
                                    <Image style={{ width: 50, height: 50, resizeMode: 'center' }} source={require('../assets/Profile.png')} />
                                )}
                                <View style={{ flexDirection: 'column', bottom: 8, right: 8 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.driverName}</Text>
                                    <Text style={{ fontSize: 15 }}>{item.carDetails?.[0].model}</Text>
                                </View>
                                <View style={{ left: 20 }}>
                                    <Text style={{ fontWeight: 'bold', left: 50, fontSize: 14 }}>{item.splitMoney} RS</Text>
                                    <Text style={{ fontSize: 12 }}>Est. time {Math.ceil(item.duration)} min</Text>
                                </View>
                                <TouchableOpacity style={{ borderWidth: 1, borderRadius: 30, top: 2, padding: 15, marginBottom: 10 }} onPress={() => createRequest(item.creator, item.driverName, item._id)}>
                                    <Image source={require('../assets/check.png')} />
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                </View>
            )}

            {/* waitForResponse */}
            {waitforResponse && !selectedPassenger && (
                <View style={{ flex: 1 / 4, justifyContent: 'center', alignItems: 'center', position: 'absolute', backgroundColor: "white", bottom: 50, paddingHorizontal: 5 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>waiting for response</Text>
                    <ActivityIndicator size='large' />
                </View>
            )}


            {!selectedPassenger && passengerCommunication && (
                <View style={styles.passengerCommunication}>
                    <View style={{ borderBottomWidth: 0.5, paddingVertical: 15, justifyContent: 'center' }}><Text style={{ fontSize: 24, fontWeight: 'bold', bottom: 5, left: 10 }}>Your driver is coming</Text></View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 15, paddingVertical: 10 }}>
                        <View>
                            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{myDriverData.driverName}</Text>
                            <Text style={{ fontSize: 18, color: '#A0ABC0', left: 5 }}>{myDriverData.carDetails?.[0].model}</Text>
                            <View style={{ backgroundColor: '#EAEAEA', width: '120%', paddingVertical: 5, borderRadius: 15, alignItems: 'center', marginVertical: 10, }}><Text style={{ color: '#A0ABC0', }}>Car Number: {myDriverData.carDetails?.[0].plateNumber}</Text></View>
                        </View>
                        {myDriverData.DriverDp ? (
                            <Image
                                source={{ uri: `data:image/jpeg;base64,${myDriverData.DriverDp}` }}
                                style={{ width: 80, height: 80, resizeMode: 'contain', borderRadius: 40 }}
                            />
                        ) :
                            <Image style={{ width: 80, height: 80, resizeMode: 'contain', borderRadius: 25 }} source={require('../assets/Profile.png')} />
                        }

                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10 }}>
                        <TouchableOpacity style={styles.message} onPress={() => Linking.openURL(`sms:${myDriverData.driverNumber}`)}>
                            <Image source={require('../assets/message.png')} />
                            <Text style={{ color: 'white', fontSize: 15 }}>Message</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.call} onPress={() => Linking.openURL(`tel:${myDriverData.driverNumber}`)}>
                            <Image source={require('../assets/call.png')} />
                            <Text style={{ color: 'white', fontSize: 15 }}>Call now</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}