const { body } = require('express-validator');

exports.createBookValidation = [
    body('name').trim().isLength({ min: 5 }),
    body('author').trim().isLength({ min: 5 }),
];

exports.updateBookValidation = [
    body('name').trim().isLength({ min: 5 }),
    body('author').trim().isLength({ min: 5 }),
];
