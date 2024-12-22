const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vehicleSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    make: {
        type: String, 
        required: true
    },
    model: {
        type: String,
        required: true
    },
    plateNumber: {
        type: String,
        required: true,
        unique: true
    },
    capacity: Number,
    licenseFront: {
        type: String,
    },
    licenseBack: {
        type: String
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    }
});

mongoose.model('Vehicle', vehicleSchema);