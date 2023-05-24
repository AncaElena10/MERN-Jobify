const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const PrivateConstans = {
    UserSchema: new mongoose.Schema({
        name: {
            type: String,
            require: [true, 'Please provide name'],
            minLength: 3,
            maxLength: 20,
            trim: true,
        },
        lastName: {
            type: String,
            maxLength: 20,
            trim: true,
            default: '',
        },
        email: {
            type: String,
            require: [true, 'Please provide email'],
            unique: true,
            validate: {
                validator: validator.isEmail,
                message: 'Please provide a valid email'
            },
        },
        password: {
            type: String,
            require: [true, 'Please provide password'],
            minLength: 3, // TODO - change this
            select: false,
        },
        location: {
            type: String,
            maxLength: 20,
            trim: true,
            default: '',
        },
    })
};

PrivateConstans.UserSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password, salt);
});

PrivateConstans.UserSchema.methods.createJWT = function () {
    return jwt.sign(
        { userId: this._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_LIFETIME }
    );
};

PrivateConstans.UserSchema.methods.comparePassword = async function (incomingPassword) {
    return await bcrypt.compare(incomingPassword, this.password);
};

const PublicConstants = {
    model: mongoose.model('User', PrivateConstans.UserSchema),
};

module.exports = { ...PublicConstants };