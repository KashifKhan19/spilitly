const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requestSchema = new Schema({
    ride: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ride',
        required: true
    },
    passenger: {
        name: {
            type: String,
            required: true
        },
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    origin: {
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    destination: {
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    status: {
        type: String,
        enum: ['accepted', 'rejected', "pending"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    passengerNumber: {
        type: Number,
        required: true,
    },
    passengerDp: {
        type: String,
        // required: true,
    },
    requestedTo: {
        type: String,
        required: true,
    },
    rideId: {
        type: String,
        required: true,
    }
});


requestSchema.virtual('expirationTime').get(function () {
    const expirationTime = new Date(this.createdAt);
    expirationTime.setHours(expirationTime.getHours() + 2);
    return expirationTime;
});

mongoose.model('Request', requestSchema);
