const express = require('express');
const { body } = require('express-validator')

const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is-auth')

const router = express.Router();

router.get('/books', isAuth, feedController.getBooks);

router.post('/book', isAuth, [
    body('name').trim().isLength({ min: 5 }),
    body('author').trim().isLength({ min: 5 }),
], feedController.createBook);

router.get('/book/:bookId', isAuth, feedController.getBook);

router.put('/book/:bookId', isAuth, [
    body('name').trim().isLength({ min: 5 }),
    body('author').trim().isLength({ min: 5 }),
], feedController.updateBook);

router.delete('/book/:bookId', isAuth, feedController.deleteBook);

module.exports = router;