const mongoose = require('mongoose');
require('dotenv').config();
const plm = require('passport-local-mongoose');
mongoose.connect(process.env.MONGO_URI);
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