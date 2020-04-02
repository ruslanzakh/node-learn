const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const leaderSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    abbr: {
        type: String,
        default: '',
    },
    designation: {
        type: String,
        default: '',
    },
    featured: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
});

const Leader = mongoose.model('Leader', leaderSchema);

module.exports = Leader;