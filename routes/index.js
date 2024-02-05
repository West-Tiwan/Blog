var express = require('express');
var router = express.Router();
const upload = require('./multer.js');
const passport = require('passport');
const localStratergy = require('passport-local');
var userModel = require('./users.js');
var postModel = require('./post.js');
passport.use(new localStratergy(userModel.authenticate()));

function isLoggedin(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

router.get('/', function (req, res, next) {
  res.render('index', { footer: false });
});

router.post('/register', function (req, res) {
  var userdata = new userModel({
    username: req.body.username,
    name: req.body.name,
    secret: req.body.secret,
    bio: "Bio of new user",
    profileImage: "default.png"
  });
  userModel.register(userdata, req.body.password, function (err, user) {
    if (err) {
      let error1 = JSON.stringify(err.message);
      console.log(error1);
      res.redirect('/');
    }
    else {
      console.log(userdata);
      res.redirect('/login');
    }
  });
});

router.get('/login', function (req, res) {
  res.render('login', { footer: false });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/'
}));

router.get('/logout', function (req, res, next) {
  req.logOut(function (err) {
    if (err) { return next(err); }
    res.redirect('/login');
  })
});

router.get('/feed', isLoggedin, async function (req, res) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  const post = await postModel.find().populate('user');
  res.render('feed', { footer: true, post, user });
});

router.get('/profile', isLoggedin, async function (req, res) {
  const user = await userModel.findOne({ username: req.session.passport.user }).populate("posts");
  res.render('profile', { footer: true, user: user });
});

router.post('/update', upload.single('image'), async function (req, res) {
  try {
    const user = await userModel.findOneAndUpdate({ username: req.session.passport.user }, { username: req.body.username, name: req.body.name, bio: req.body.bio }, { new: true });
    if (req.file) {
      if (user.profileImage != 'default.png') {
        fs.rm("public/images/uploads/" + user.profileImage, { force: true }, (err) => {
          console.log(err);
        });
      }
      user.profileImage = req.file.filename;
    }
    await user.save();
  } catch (err) {
    console.log(err);
  }
  res.redirect('/profile');
});

router.get('/search', isLoggedin, async function (req, res) {
  res.render('search', { footer: true });
});

router.get('/edit', isLoggedin, async function (req, res) {
  const user = await userModel.findOne({ username: req.session.passport.user })
  res.render('edit', { footer: true, user: user });
});

router.get('/upload', isLoggedin, async function (req, res) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  res.render('upload', { footer: true, user: user });
});

router.post('/upload', isLoggedin, upload.single("image"), async function (req, res) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  const post = await postModel.create({
    cover: req.file.filename,
    heading:req.body.heading,
    user: user._id,
    body: req.body.body,
  })
  user.posts.push(post._id);
  await user.save();
  console.log(post);
  res.redirect("/feed");
});

router.get('/username/:username', isLoggedin, async function (req, res) {
  const regex = new RegExp(`^${req.params.username}`, 'i');
  const users = await userModel.find({ username: regex });
  res.json(users);
});

router.get('/delete/post/:id', isLoggedin, async function (req, res) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  const post = await postModel.findOne({ _id: req.params.id });
  user.posts.splice(user.posts.indexOf(post._id), 1);
  let rem = await postModel.deleteOne({ _id: req.params.id });
  fs.rm("public/images/uploads/" + post.picture, { force: true }, (err) => {
    console.log(err);
  });
  user.save();
  res.redirect('/profile');
});

module.exports = router;
