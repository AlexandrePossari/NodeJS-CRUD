const { validationResult } = require('express-validator');

const Book = require('../models/book');

exports.getBooks = (req, res, next) => {
    //Create
    res.status(200).json({
        books: [{name: 'Pequeno Príncipe', author: 'Fulano'}]
    });
};

exports.createBook = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation failed, data entered is incorrect');
        error.statusCode(422);
        throw error;
    }

    const name = req.body.name;
    const author = req.body.author;
    const book = new Book({
        name: name, 
        author: author
    });
    book.save().then(result => {
        console.log(result);
    }).catch(err => {
        res.status(201).json({
            message: 'Book created!',
            post: result
        })
        console.log(err)
    });
    
};
