const mongoose = require('mongoose');
const BSON = require('bson');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: null
    },
    email: {
        type: String,
        required: true,
        default: null
    },
    photo: {
      type: String,
      required: false,
      default: null
    },
    phoneNumber: {
        type: String,
        required: true,
        default: null
    },
    fcmRegistrationToken: {
        type: String,
        required: true,
        default: null
    },
    walletAddress: {
        type: String,
        required:false,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);