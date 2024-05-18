const { body } = require('express-validator');
const User = require('../models/user'); 

exports.signupValidation = [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email')
        .custom((value) => {
            return User.findOne({ email: value }).then(userDoc => {
                if (userDoc) {
                    return Promise.reject('Email address already exists!');
                }
            });
        })
        .normalizeEmail(),
    body('password').trim().isLength({ min: 5 }),
    body('name').trim().not().isEmpty()
];

