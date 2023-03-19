const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models/user.model');

class AuthController {
  constructor() {}

  login = async (req, res, next) => {
    const { email, password } = req.body;

    // Validate user input
    if (!email || !password) {
      return res
        .status(400)
        .send({ message: 'Email and password are required' });
    }

    // Authenticate the user
    try {
      let user = await User.findOneAndUpdate(
        { email: email.toLowerCase() },
        { isAuthenticated: true }
      );
      // If the email and password do not match, call done with false
      if (!user) {
        return res.status(404).json({ message: 'User do not existed' });
      }
      bcrypt.compare(password, user.password, (error, result) => {
        if (result) {
          // If the email and password match, create a token and call done with the user and token
          const token = jwt.sign(
            { user_id: user?._id },
            process.env.TOKEN_KEY,
            {
              expiresIn: '5h',
            }
          );

          return res.status(200).json({
            token: token,
            id: user?._id,
            name: user?.name,
            photo: user?.photo,
          });
        } else {
          return res.status(404).json({ message: 'Password mismatch' });
        }
      });
    } catch (err) {
      return next(err);
    }
  };

  signup = async (req, res, next) => {
    const { email, password, name } = req.body;

    // Validate user input
    if (!email || !password || !name) {
      return res
        .status(400)
        .send({ message: 'Email, name and password are required' });
    }

    try {
      let user = await User.findOne({ email: email });
      if (user) {
        return res.status(404).json({ message: 'Email has already been used' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        email: email.toLowerCase(),
        name: name,
        password: hashedPassword,
        photo: `${process.env.SERVER_URL}photo/default`,
        isAuthenticated: true,
      });
      await newUser.save();

      const token = jwt.sign({ user_id: newUser?._id }, process.env.TOKEN_KEY, {
        expiresIn: '5h',
      });

      return res.status(200).json({
        token: token,
        id: newUser?._id,
        name: newUser?.name,
        photo: newUser?.photo,
      });
    } catch (err) {
      return next(err);
    }
  };

  renewToken = async (req, res) => {
    // Check for JWT in the Authorization header
    const token = req.headers.authorization?.split(' ')[1];
    // console.log(token);
    if (!token) {
      return res.status(401).send('Unauthorized');
    }

    try {
      const decoded = jwt.verify(token, process.env.TOKEN_KEY);
      let user = await User.findById(decoded.user_id);
      if (!user.isAuthenticated) {
        return res.status(401).send('Unauthorized');
      }
      const newToken = jwt.sign({ user_id: user?._id }, process.env.TOKEN_KEY, {
        expiresIn: '5h',
      });

      return res.status(200).json({
        token: newToken,
      });
    } catch (err) {
      console.log(err);
      return res.status(401).send('Unauthorized');
    }
  };

  isAuthenticated = async (req, res, next) => {
    // Check for JWT in the Authorization header
    const token = req.headers.authorization?.split(' ')[1];
    // console.log(token);
    if (!token) {
      return res.status(401).send('Unauthorized');
    }

    try {
      const decoded = jwt.verify(token, process.env.TOKEN_KEY);
      let user = await User.findById(decoded.user_id);
      if (!user.isAuthenticated) {
        return res.status(401).send('Unauthorized');
      }
      return next();
    } catch (err) {
      return res.status(401).send('Unauthorized');
    }
  };
}

module.exports = new AuthController();
