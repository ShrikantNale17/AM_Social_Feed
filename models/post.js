const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        required: true
    },
    likes: {
        type: Array,
        default: []
    },
    comments: {
        type: Array,
        default: []
    }
},
    {
        timestamps: true
    })

module.exports = mongoose.model('post', postSchema)