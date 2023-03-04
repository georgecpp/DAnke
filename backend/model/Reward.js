const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    rewardDAC: {
        type: Number,
        required: true
    },
    savedAtDate: {
        type: Date,
        required: true
    }
});


module.exports = mongoose.model('Reward', rewardSchema);