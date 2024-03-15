exports.getBooks = (req, res, next) => {
    //Create
    res.status(200).json({
        books: [{name: 'Pequeno Príncipe', author: 'Fulano'}]
    });
};

exports.createBook = (req, res, next) => {
    const name = req.body.name;
    const author = req.body.author;
    //Create book in db
    res.status(201).json({
        message: 'Book created!',
        post: {name: name, author: author}
    })
};
