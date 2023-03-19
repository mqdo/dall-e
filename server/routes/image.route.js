const express = require('express');

const controller = require('../controllers/image.controller');

const router = express.Router();

router.post('/generate', controller.generate);

router.post('/upload', controller.upload);

router.get('/detail/:id', controller.getImageDetails);

router.get('/all', controller.getAll);

module.exports = router;