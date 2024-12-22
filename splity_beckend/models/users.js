const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')

const userSchema = new Schema({
    fullName: {
        type: String, 
        required: true}, 
    email: {
        type: String,
        unique: true,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true,
        unique: true
    },
    institution: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        trim: true,
    },
    ridesCreated: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ride',
        },
    ],
    ridesJoined: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ride',
        },
    ],
    idCardFront: {
        type: String,
    },
    idCardBack: {
        type: String
    },
    vehicles: [{ type: Schema.Types.ObjectId, ref: 'Vehicle' }]
});

//hashing the password
userSchema.pre('save', function (next) {
    const user = this;
    //if passwrod not hashed already
    if (!user.isModified('password')) { return next(); }

    bcrypt.genSalt(10, (err, salt) => {
        if (err) { return next(err); }

        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) { return next(err); }
            user.password = hash;
            next();
        })
    })
})

//used in sign in (entered pass hashed then compared)
userSchema.methods.comparePassword = function (candidatePassword) {
    const user = this
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
            if (err) { reject("Error comparing passwords"); }
            if (!isMatch) { reject("Passwords Not  Matched"); }
            resolve(true);
        });
    })
};

mongoose.model('User', userSchema);
