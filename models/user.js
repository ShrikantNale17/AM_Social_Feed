const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    username: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },
    gender: {
        type: String,
        default: ''
    },
    DOB: {
        type: String,
        default: ''
    },
    mobile: {
        type: String,
        default: ''
    }

},
    {
        timestamps: true
    }
)

module.exports = mongoose.model('User', userSchema)