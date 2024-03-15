exports.getBooks = (red, res, next) => {
    res.status(200).json({
        books: [{name: 'Pequeno Príncipe', author: 'Fulano'}]
    });
};
