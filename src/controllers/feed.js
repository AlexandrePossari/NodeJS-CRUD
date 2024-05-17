const { validationResult } = require('express-validator');

const Book = require('../models/book');
const User = require('../models/user');

exports.getBooks = async (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 2;
    try{
        const totalItems = await Book.find().countDocuments()
        const books = await Book.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
        res.status(200).json({ message: 'Books fetched', books: books, totalItems: totalItems })        
    } catch (err){
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }   
};

exports.getBook = async (req, res, next) => {
    try{
        const bookId = req.params.bookId;
        const book = await Book.findById(bookId)
        if (!book) {
            const error = new Error("Could not find book");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ message: 'Book fetched', book: book })
    } catch (err){
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    } 
        
};

exports.createBook = async (req, res, next) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Validation failed, data entered is incorrect');
            error.statusCode = 422;
            throw error;
        }
        let creator;
        const name = req.body.name;
        const author = req.body.author; 

        const book = new Book({
            name: name,
            author: author,
            creator: req.userId
        });
        const result = await book.save();
        const user = await User.findById(req.userId);
        creator = user;
        user.books.push(book);
        const resultUserSave = await user.save(); 
        res.status(201).json({
            message: 'Book created!',
            book: book,
            creator: {_id: creator._id, name: creator.name}
        }) 
    } catch (err){
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }        
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
        if(book.creator.toString() !== req.userId){
            const error = new Error('Not authorized');
            error.statusCode = 403;
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
        if(book.creator.toString() !== req.userId){
            const error = new Error('Not authorized');
            error.statusCode = 403;
            throw error;
        }
        return Book.findByIdAndDelete(bookId);
    }).then(result => {
        return User.findById(req.userId);
    }).then(user => {    
        user.books.pull(bookId);
        return user.save();
    }).then(result => {
        res.status(200).json({ message: 'Deleted book' })
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}



