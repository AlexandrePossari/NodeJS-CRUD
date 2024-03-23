const { validationResult } = require('express-validator');

const Book = require('../models/book');

exports.getBooks = (req, res, next) => {
    Book.find().then(books => {
        res.status(200).json({ message: 'Books fetched', books: books })
    })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.getBook = (req, res, next) => {
    const bookId = req.params.bookId;
    Book.findById(bookId)
        .then(book => {
            if (!book) {
                const error = new Error("Could not find book");
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({ message: 'Book fetched', book: book })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.createBook = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, data entered is incorrect');
        error.statusCode = 422;
        throw error;
    }

    const name = req.body.name;
    const author = req.body.author;
    const book = new Book({
        name: name,
        author: author
    });
    book.save().then(result => {
        res.status(201).json({
            message: 'Book created!',
            post: result
        })
        console.log(result);
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};


exports.updateBook = (req, res, next) => {
    const bookId = req.params.bookId;
    const name = req.body.name;
    const author = req.body.author;
    Book.findById(bookId).then(book => {
        if (!book) {
            const error = new Error('Could not find book');
            error.statusCode = 404;
            throw error;
        }
        book.name = name;
        book.author = author;
        return book.save();
    }).then(result => {
        res.status(200).json({ message: 'Book updated', book: result });
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

exports.deleteBook = (req, res, next) => {
    const bookId = req.params.bookId;
    Book.findById(bookId).then(book => {
        if (!book) {
            const error = new Error('Could not find book');
            error.statusCode = 404;
            throw error;
        }
        return Book.findByIdAndDelete(bookId);
    }).then(result => {
        console.log(result);
        res.status(200).json({ message: 'Deleted book' })
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}



