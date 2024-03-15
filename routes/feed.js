const express = require('express');

const feedController = require('../controllers/feed');

const router = express.Router();

// /GET /feed/books
router.get('/books', feedController.getBooks);

module.exports = router;