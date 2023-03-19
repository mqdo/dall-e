const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

require('dotenv').config();
require('./config/database').connect();

const controller = require('./controllers/auth.controller');
const userRouter = require('./routes/user.route');
const authRouter = require('./routes/auth.route');
const imageRouter = require('./routes/image.route');

const { API_PORT, SECRET_KEY } = process.env;
const port = process.env.PORT || API_PORT;

const app = express();

app.use(
  cors({
    origin: '*',
  })
);

app.use(
  session({
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const storage = multer.diskStorage({
  destination: 'public/photos/',
  filename: (req, file, cb) => {
    const [name] = file.originalname.split('.');
    const filename = name + '-' + Date.now() + path.extname(file.originalname);
    cb(null, filename);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
      return callback(new Error('Only images are allowed'));
    }
    callback(null, true);
  },
  limits: {
    fileSize: 2000 * 2000,
  },
});

app.use(express.static(path.join(__dirname, 'public', 'photos')));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.use(
  '/user',
  controller.isAuthenticated,
  upload.single('photo'),
  userRouter
);

app.use('/auth', authRouter);

app.use(
  '/image',
  controller.isAuthenticated,
  upload.single('image'),
  imageRouter
);

app.get('/photo/:name', async (req, res) => {
  const { name } = req.params;
  // console.log(name);
  try {
    res.status(200).sendFile(path.join(__dirname, 'public', 'photos', name));
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

app.get('/', controller.isAuthenticated, (req, res) => {
  res.send(`Welcome ${req.user.name || 'user-' + req.user._id}`);
});

app.listen(port, () => {
  console.log('listening on port ' + port);
});
