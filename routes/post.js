const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI);
const postSchema = mongoose.Schema({
    cover: String,
    heading: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    body: String,
    date: {
        type: Date,
        default: Date.now,
    }
});
module.exports = mongoose.model("post", postSchema);