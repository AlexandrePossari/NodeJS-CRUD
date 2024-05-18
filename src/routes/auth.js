const express = require('express');
const { signupValidation } = require('../validations/auth');

const authController = require('../controllers/auth')

const router = express.Router();

router.put('/signup', signupValidation, authController.signup);

router.post('/login', authController.login)

module.exports = router;