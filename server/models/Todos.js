const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
    summary: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    isCompleted: {
        type: Boolean
    },
    labelIds: [{
        type: String
    }],
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

module.exports = mongoose.model('Todos', TodoSchema)