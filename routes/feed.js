const express = require('express');
const { body } = require('express-validator')

const feedController = require('../controllers/feed');

const router = express.Router();

router.get('/books', feedController.getBooks);

router.post('/book', [
    body('name').trim().isLength({ min: 5 }),
    body('author').trim().isLength({ min: 5 }),
], feedController.createBook);

router.get('/book/:bookId', feedController.getBook);

router.put('/book/:bookId', [
    body('name').trim().isLength({ min: 5 }),
    body('author').trim().isLength({ min: 5 }),
], feedController.updateBook);

router.delete('/book/:bookId', feedController.deleteBook);

module.exports = router;