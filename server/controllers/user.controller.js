const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');

class UserController {
  constructor() {}
  // getAllUsers = (req, res) => {};
  getUserById = async (req, res) => {
    const { id } = req.params;
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    if (id !== decoded.user_id) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    try {
      let user = await User.findById(id);
      res.status(200).json({ data: { user: user } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  };
  updateUserById = async (req, res) => {
    let message = '';
    const { id } = req.params;
    const { password: passwordObj, email, ...data } = req.body;
    const photo = req.file || null;
    // console.log(req.file);
    // console.log(req.body);
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    // console.log(id, decoded.user_id);
    if (id !== decoded.user_id) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    try {
      let user = await User.findById(id);

      if (!passwordObj) {
        message = 'Password is required to change information';
        return res.status(403).json({ message: message });
      }

      const password = JSON.parse(passwordObj);

      if (password.old && bcrypt.compareSync(password.old, user.password)) {
        const hashedPassword = password.new
          ? bcrypt.hashSync(password.new, 10)
          : user.password;
        user.password = hashedPassword;
      } else {
        message = 'Old password is incorrect';
        return res.status(403).send({ message: message });
      }

      if (email && email !== user.email) {
        let existed = await User.findOne({ email: email });
        if (existed) {
          message = 'Email already exists';
          return res.status(403).json({ message: message });
        }
        user.email = email;
      }

      if (photo) {
        console.log(photo.filename);
        user.photo = `${process.env.SERVER_URL}photo/${photo.filename}`;
      }
      // console.log(data);
      // await user.updateMany({ ...data });
      for (let key in data) {
        user[key] = data[key];
      }
      user.save();
      res.status(200).json({ user: user });
    } catch (err) {
      console.error(err);
      message = err.message || 'Something went wrong';
      res.status(500).json({ message: message });
    }
  };
  // removeUserById = (req, res) => {};
}

module.exports = new UserController();
