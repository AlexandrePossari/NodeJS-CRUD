const express = require('express');
const { createBookValidation } = require('../validations/feed');
const { updateBookValidation } = require('../validations/feed');

const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is-auth')

const router = express.Router();

router.get('/books', isAuth, feedController.getBooks);

router.post('/book', isAuth, createBookValidation, feedController.createBook);

router.get('/book/:bookId', isAuth, feedController.getBook);

router.put('/book/:bookId', isAuth, updateBookValidation, feedController.updateBook);

router.delete('/book/:bookId', isAuth, feedController.deleteBook);

module.exports = router;