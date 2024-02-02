const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/wtblog");
const userSchema = mongoose.Schema({
  username: String,
  name:String,
  profileImage: String,
  bio:String,
  password: String,
  secret: String,
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }],
});
userSchema.plugin(plm);
module.exports = mongoose.model("user", userSchema);