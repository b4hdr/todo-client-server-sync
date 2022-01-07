const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LabelSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    createDate: {
        type: Date,
        default: Date.now,
    },
    updateDate: {
        type: Date,
        default: Date.now,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: Number,
        default: Date.now
    }
});

module.exports = mongoose.model('Labels', LabelSchema)