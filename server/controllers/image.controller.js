const fs = require('fs');
const path = require('path');
const { Configuration, OpenAIApi } = require('openai');

const User = require('../models/user.model');
const Image = require('../models/image.model');

require('dotenv').config();

const { OPENAI_SECRET_KEY, SERVER_URL } = process.env;

const configuration = new Configuration({
  apiKey: OPENAI_SECRET_KEY,
});

class ImageController {
  constructor() {}

  generate = async (req, res) => {
    const { id, prompt } = req.body;
    if (!id) {
      return res.status(404).json({ message: 'User ID is required' });
    }
    try {
      let user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User does not exist' });
      }
      const openai = new OpenAIApi(configuration);
      const response = await openai.createImage({
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        response_format: 'b64_json',
      });
      const { b64_json } = response?.data?.data[0];
      return res.status(201).json({
        base64: b64_json,
        prompt: prompt,
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Something went wrong' });
    }
  };

  upload = async (req, res) => {
    const { id, prompt } = req.body;
    const file = req.file;
    if (!id) {
      return res.status(404).json({ message: 'User ID is required' });
    }
    try {
      let user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User does not exist' });
      }
      // const buffer = Buffer.from(base64, 'base64');
      // const name = `dalle-${Date.now()}.png`;
      // fs.writeFileSync(
      //   path.join(__dirname, '..', 'public', 'photos', name),
      //   buffer
      // );
      let url = `${SERVER_URL}photo/${file.filename}`;
      let image = new Image({
        url: url,
        caption: prompt,
        user: user?._id,
      });
      await image.save();
      user.images.push(image._id);
      await user.save();
      return res.status(201).json({
        message: 'Image saved successfully',
        id: image._id,
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Something went wrong' });
    }
  };

  getAll = async (req, res) => {
    const size = req.query.size || 10;
    const page = req.query.page || 1;

    try {
      let images = await Image.find()
        .sort({ createdAt: -1 })
        .skip((page - 1) * size)
        .limit(size)
        .exec();
      if (images?.length > 0) {
        return res.status(200).json({ images: images });
      }
      return res.status(404).json({ message: 'No images found' });
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  };

  getImageDetails = async (req, res) => {
    const { id } = req.params;
    try {
      let image = await Image.findById(id)
        .populate('user', 'photo name')
        .exec();
      if (!image) {
        return res.status(404).json({ message: 'No images found' });
      }
      return res.status(200).json({ image: image });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: 'Something went wrong' });
    }
  };
}

module.exports = new ImageController();
