const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rideSchema = new Schema({
    distance: {
        type: Number,
    },
    splitMoney: {
        type: Number
    },
    carDetails: {
        type: Array,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    driverName:{
        type:String,
        required: true,
    },
    passengers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    availableSeats: {
        type: Number,
        required: true,
        min: 1,
    },
    origin: {
        coordinates: {
            type: [Number],
        },
    },
    destination: {
        coordinates: {
            type: [Number],
        },
    },
    date:{
        type : Date ,
        required:true
    },
    status:{
        type:String,
        enum:['complete','ongoing']
    },
    DriverDp:{
        type:String,
    },
    driverNumber: {
        type: Number,
        required: true,
    },
});

mongoose.model('Ride', rideSchema);