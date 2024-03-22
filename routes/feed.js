const express = require('express');
const { body } = require('express-validator')

const feedController = require('../controllers/feed');

const router = express.Router();

// /GET /feed/books
router.get('/books', feedController.getBooks);

// /POST /feed/book
router.post('/book', [
    body('name').trim().isLength({min: 5}),
    body('author').trim().isLength({min: 5}),
],feedController.createBook);

module.exports = router;