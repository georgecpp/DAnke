const mongoose = require('mongoose');

const reactSchema = new mongoose.Schema({
    userTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    userFromId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    userFromName: {
        type: String,
        required: true
    },
    userFromImage: {
        type: String,
        required: true
    },
    reactType: {
        type: String,
        required: true
    },
    savedAtDate: {
        type: Date,
        required: true
    }
});


module.exports = mongoose.model('React', reactSchema);