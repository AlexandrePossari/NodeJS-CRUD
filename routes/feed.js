const express = require('express');

const feedController = require('../controllers/feed');

const router = express.Router();

// /GET /feed/books
router.get('/books', feedController.getBooks);

// /POST /feed/book
router.post('/book', feedController.createBook);

module.exports = router;