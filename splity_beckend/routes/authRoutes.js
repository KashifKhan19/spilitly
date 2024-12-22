const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const jwt = require('jsonwebtoken')//token given to user when created
const { jwtKey } = require('../keys')
const User = mongoose.model('User')
const Vehicle = mongoose.model('Vehicle');
const Ride = mongoose.model("Ride");
const Request = mongoose.model( "Request" ); 

router.use(express.json());

//user registration/signup
module.exports = router.post('/signup', async (req, res) => {
    const {
        fullName,
        email,
        phoneNumber,
        institution,
        password
    } = req.body

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const user = new User({
            fullName,
            email,
            phoneNumber,
            institution,
            password
        })

        await user.save()

        const token = jwt.sign({ _id: user._id }, jwtKey)

        res.send({res: 'Signup successful! ', token })
    } catch (err) {
        return res.status(422).send(err.message)
    }
})

//user login
module.exports = router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send('Please provide email and password');
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send('Email not found!');
        }
        await user.comparePassword(password);
        const token = jwt.sign({ _id: user._id }, jwtKey);
        res.send({res: 'Signin successful! ',  token });
    } catch (err) {
        return res.status(401).send('Password not matched');
    }
});

//update user information
module.exports = router.put('/update_user', async (req, res) => {
    const { fullName, email, phoneNumber } = req.body;
    const userToken = req.headers.authorization;

    try {
        const decodedUserToken = jwt.verify(userToken, jwtKey);
        const userId = decodedUserToken._id;
        const user = await User.findByIdAndUpdate(userId, { fullName, email, phoneNumber }, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({res:"Successfully Updataed: ",user});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

//retrieve a user's data
router.post('/retrieve_user', async (req, res) => {
    const userToken = req.headers.authorization;
    try {
        const decodedUserToken = jwt.verify(userToken, jwtKey);
        const userId = decodedUserToken._id;

        const userData = await User.findById(userId);
        if (!userData) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        return res.json({ status: "Ok", data: userData });
    } catch (error) {
        console.error('Error retrieving user data:', error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// check-existing users
router.post('/check-existing', async (req, res) => {
    const { email, phoneNumber } = req.body;

    try {
        const existingEmail = await User.findOne({ email });
        const existingPhone = await User.findOne({ phoneNumber });

        res.json({
            emailExists: !!existingEmail,
            phoneExists: !!existingPhone
        });
    } catch (error) {
        console.error('Error checking existing records:', error);
        res.status(500).json({ error: 'An error occurred while checking existing records.' });
    }
});

//upload userdp
router.post('/upload-user-dp', async (req, res) => {
    const { userImageBase64 } = req.body;
    const userToken = req.headers.authorization;

    try {
        const decodedUserToken = jwt.verify(userToken, jwtKey);
        const userId = decodedUserToken._id;

        await User.findByIdAndUpdate(userId, { profilePicture: userImageBase64 });

        res.status(200).json({ message: 'ID card images uploaded successfully' });
    } catch (error) {
        console.error('Error uploading ID card images:', error);
        res.status(500).json({ error: 'Failed to upload ID card images' });
    }
});

// getting user's dp 
router.post('/get-user-profile', async (req, res) => {
    const userToken = req.headers.authorization;
  
    try {
      const decodedUserToken = jwt.verify(userToken, jwtKey);
      const userId = decodedUserToken._id;
  
      const user = await User.findById(userId);
      if (user && user.profilePicture) {
        res.status(200).json({ profilePicture: user.profilePicture });
      } else {
        res.status(404).json({ error: 'Profile picture not found' });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ error: 'Failed to fetch user profile' });
    }
  });
  
//add vehicle
router.post('/vehicles', async (req, res) => {
    const { type, make, model, plateNumber } = req.body;
    const userToken = req.headers.authorization;
    try {
        const existingVehicle = await Vehicle.findOne({ plateNumber });
        if (existingVehicle) {
            return res.status(400).json({ error: 'Plate number already exists' });
        }

        const decodedUserToken = jwt.verify(userToken, jwtKey);
        const userId = decodedUserToken._id;

        const vehicle = new Vehicle({
            type,
            make,
            model,
            plateNumber,
            owner: userId
        });
        await vehicle.save();
        await User.findByIdAndUpdate(userId, { $push: { vehicles: vehicle._id } });

        res.status(201).json({res: "Vehicle added successfully", vehicle});
    } catch (error) {
        console.error('Error adding vehicle:', error);
        res.status(500).json({ error: 'Failed to add vehicle' });
    }
});

//vehicle license images
router.post('/licenseImages', async (req, res) => {
    const { idCardFrontBase64, idCardBackBase64, plateNumber } = req.body;
    const userToken = req.headers.authorization;
    try {
        jwt.verify(userToken, jwtKey);

        const existingCar = await Vehicle.findOneAndUpdate(
            { plateNumber: plateNumber },
            { $set: { licenseFront: idCardFrontBase64, licenseBack: idCardBackBase64 } },
            { new: true }
        );
        res.status(200).json({ message: 'ID card images uploaded successfully' });
    } catch (error) {
        console.error('Error uploading ID card images:', error);
        res.status(500).json({ error: 'Failed to upload ID card images' });
    }
});

//upload id card images
router.post('/upload-id-card', async (req, res) => {
    const { idCardFrontBase64, idCardBackBase64 } = req.body;
    const userToken = req.headers.authorization;

    try {
        const decodedUserToken = jwt.verify(userToken, jwtKey);
        const userId = decodedUserToken._id;

        await User.findByIdAndUpdate(userId, { idCardFront: idCardFrontBase64, idCardBack: idCardBackBase64 });

        res.status(200).json({ message: 'ID card images uploaded successfully' });
    } catch (error) {
        console.error('Error uploading ID card images:', error);
        res.status(500).json({ error: 'Failed to upload ID card images' });
    }
});

// get vehicles owned by a user
router.post("/myVehicles", async (req, res) => {
    const userToken = req.headers.authorization;

    try {
        const decodedUserToken = jwt.verify(userToken, jwtKey);
        const userId = decodedUserToken._id;

        const myVehicles = await Vehicle.find({ owner: userId });

        return res.json({data:myVehicles});
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        throw error;
    }
});

// create a ride
router.post('/createRide', async (req, res) => {
    const userToken = req.headers.authorization;
    try {
        const decodedUserToken = jwt.verify(userToken, jwtKey);
        const userId = decodedUserToken._id;

        const { driverName, driverNumber, availableSeats, origin, destination, date, status, carDetails, splitMoney,  distance, DriverDp} = req.body;
        
        const ride = new Ride({
            availableSeats:availableSeats, 
            origin:origin, 
            date:date, 
            status:status, 
            carDetails:carDetails, 
            splitMoney:splitMoney,  
            distance:distance,
            creator:userId,
            driverName:driverName,
            destination:destination,
            DriverDp:DriverDp,
            driverNumber: driverNumber 
        });

        const savedRide = await ride.save(); 
        const rideId = savedRide._id; 

        await User.findByIdAndUpdate(userId, { $push: { ridesCreated: rideId } });

        res.json({ message: 'Ride created successfully', ride: ride, rideId});
    } catch (error) {
        console.error('Error creating ride:', error);
        res.status(500).json({ error: 'An error occurred while creating the ride' });
    }
});

// Update ride status
router.put('/updateRideStatus', async (req, res) => {
    const { rideId, status } = req.body;
    const io = req.app.get('io');

    try {
        const ride = await Ride.findById(rideId);

        if (!ride) {
            return res.status(404).json({ error: 'Ride not found' });
        }

        if (status === 'complete') {
            ride.status = 'complete';
            io.emit('rideCompleted', { rideId })
        } else {
            return res.status(400).json({ error: 'Invalid status' });
        }

        await ride.save();
        res.status(200).json({ message: 'Ride status updated successfully', ride });
    } catch (error) {
        console.error('Error updating ride status:', error);
        res.status(500).json({ error: 'An error occurred while updating ride status' });
    }
});

//get all rides
router.get('/getRides', async (req, res) => {
    try {
        const rides = await Ride.find({ status: 'ongoing' });
        res.json({msg:"successfully fetched Rides:", rides });
    } catch (error) {
        console.error('Error fetching ongoing rides:', error);
        res.status(500).json({ error: 'An error occurred while fetching ongoing rides' });
    }
});

// request
router.post('/createRequest', async (req, res) => {
    const userToken = req.headers.authorization;
    try {
        const decodedUserToken = jwt.verify(userToken, jwtKey);
        const userId = decodedUserToken._id;
        const { passengerName, origin, destination, passengerNumber, passengerDp, rideId, requestedTo } = req.body;

        const newRequest = new Request({
            passenger: {
                name: passengerName,
                id: userId
            },
            origin:  {
                coordinates: origin, 
            },
            destination: {
                coordinates: destination,
            },
            status:"pending",
            passengerNumber:passengerNumber,
            passengerDp:passengerDp,
            requestedTo:requestedTo,
            rideId: rideId,
            ride: new mongoose.Types.ObjectId(rideId)
        });

        await newRequest.save();

        res.status(201).json({ message: 'Request created successfully', request: newRequest });
    } catch (error) {
        console.error('Error creating request:', error);
        res.status(500).json({ error: 'An error occurred while creating the request' });
    }
});

// retrieve pending requests
router.post('/pendingRequests', async (req, res) => {
    const { longitude, latitude } = req.body;

    try {
        if (!longitude || !latitude) {
            return res.status(400).json({ error: 'Current location coordinates are required' });
        }

        const currentTime = new Date();

        const pendingRequests = await Request.find({
            status: "pending",
            createdAt: { $gte: new Date(currentTime.getTime() - 2 * 60 * 60 * 1000) },
            // origin: {
            //     coordinates: {
            //         $near: {
            //             $geometry: {
            //                 coordinates: [parseFloat(longitude), parseFloat(latitude)]
            //             },
            //             $maxDistance: 2000 
            //         }
            //     }
            // }
        }).populate('passenger');

        res.status(200).json({ message: 'Pending requests retrieved successfully', requests: pendingRequests });
    } catch (error) {
        console.error('Error retrieving pending requests:', error);
        res.status(500).json({ error: 'An error occurred while retrieving pending requests' });
    }
});

// status of a request (accept or reject)
router.put('/updateRequestStatus', async (req, res) => {
    const { requestId, action, rideId } = req.body;

    try {
        const request = await Request.findById(requestId);

        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        let notificationMessage = '';

        if (action === 'accept') {
            request.status = 'accepted';
            notificationMessage = `Your ride request has been accepted.`;
            await Ride.findByIdAndUpdate(
                request.ride._id,
                { $push: { passengers: request.passenger.id } },
                { new: true }
            );
            await User.findByIdAndUpdate(request.passenger.id, { $push: { ridesJoined: rideId } });
        } else if (action === 'reject') {
            request.status = 'rejected';
            notificationMessage = `Your ride request has been rejected.`;
        } else {
            return res.status(400).json({ error: 'Invalid action' });
        }

        await request.save();

        res.status(200).json({ message: notificationMessage, request: request });
    } catch (error) {
        console.error('Error updating request status:', error);
        res.status(500).json({ error: 'An error occurred while updating request status' });
    }
});

// Get request status by ID
router.get('/getRequestStatus/:requestId', async (req, res) => {
    const { requestId } = req.params;

    try {
        const request = await Request.findById(requestId).populate('ride');
        const rideDetails = await Ride.findById(request.rideId)

        if (!request) {
            console.log("error: Request not found");
            return res.status(404).json({ error: 'Request not found' });
        }

        if (!rideDetails) {
            console.log("error: Ride details not found for this request");
            return res.status(404).json({ error: 'Ride details not found for this request' });
        }

        res.status(200).json({msg: "successfull", request, rideDetails });
    } catch (error) {
        console.error('Error fetching request status:', error);
        res.status(500).json({ error: 'An error occurred while fetching request status' });
    }
});


module.exports = router;