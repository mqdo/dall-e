const express = require('express');
const controller = require('../controllers/user.controller');

const router = express.Router();

router.get('/:id', controller.getUserById);

router.put('/update/:id', controller.updateUserById);

// router.delete('/:id', controller.removeUserById);

module.exports = router;