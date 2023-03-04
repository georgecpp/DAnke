const mongoose = require('mongoose');

const vitalsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    steps: {
        type: Number,
        required: true
    },
    heartRateAvg: {
        type: Number,
        required: true
    },
    sleep: {
        type: String,
        required: true
    },
    savedAtDate: {
        type: Date,
        required: true
    }
});


module.exports = mongoose.model('Vitals', vitalsSchema);