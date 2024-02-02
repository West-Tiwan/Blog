const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/wtblog");
const postSchema = mongoose.Schema({
    cover: String,
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