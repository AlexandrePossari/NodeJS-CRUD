const { expect } = require('chai');
const sinon = require('sinon');
const Book = require('../models/book');
const User = require('../models/user');
const updateBook = require('../controllers/feed').updateBook;
const deleteBook = require('../controllers/feed').deleteBook;
const getBook = require('../controllers/feed').getBook;
const createBook = require('../controllers/feed').createBook;

describe('Feed Controller - Create book', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: { name: "someName", author: "someAuthor" },
            userId: "someUserId"
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
        next = sinon.stub();
    });

    afterEach(() => {
        sinon.restore();
    });  

    it('should create the book', async () => {
        const saveBookStub = sinon.stub(Book.prototype, 'save').resolves({
            _id: 'someBookId',
            name: 'someName',
            author: 'someAuthor',
            creator: req.userId
        });

        const userStub = sinon.stub(User, 'findById').resolves({
            _id: req.userId,
            name: 'someUser',
            books: [],
            save: sinon.stub().resolvesThis()
        });

        await createBook(req, res, next);

        expect(saveBookStub.calledOnce).to.be.true;
        expect(userStub.calledOnceWith(req.userId)).to.be.true;
        expect(res.status.calledOnceWith(201)).to.be.true;
        expect(res.json.calledOnce).to.be.true;

        const response = res.json.firstCall.args[0];
        expect(response).to.have.property('message', 'Book created!');
        expect(response.book).to.include({ name: 'someName', author: 'someAuthor' });
        expect(response.creator).to.include({ _id: req.userId, name: 'someUser' });
    });

    it('should throw 500 for unexpected errors', async () => {
        const book = { creator: req.userId, name: req.body.name, author: req.body.author, save: sinon.stub().throws() };

        await createBook(req, res, next);

        expect(next.calledOnce).to.be.true;
        const error = next.firstCall.args[0];
        expect(error).to.be.an('error');
        expect(error.statusCode).to.equal(500);
    });

});

describe('Feed Controller - Get book', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            params: { bookId: 'someBookId' },
            body: { name: "someName", author: "someAuthor" },
            userId: 'someUserId'
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
        next = sinon.stub();
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should throw an error 404 if the book is not found', async () => {
        sinon.stub(Book, 'findById').returns(null);

        await getBook(req, res, next);

        expect(next.calledOnce).to.be.true;
        const error = next.firstCall.args[0];
        expect(error).to.be.an('error');
        expect(error.message).to.equal('Could not find book');
        expect(error.statusCode).to.equal(404);
    });    

    it('should throw 500 for unexpected errors', async () => {
        sinon.stub(Book, 'findById').throws();

        await getBook(req, res, next);

        expect(next.calledOnce).to.be.true;
        const error = next.firstCall.args[0];
        expect(error).to.be.an('error');
        expect(error.statusCode).to.equal(500);
    });

    it('should get the book', async () => {
        const book = { creator: req.userId, name: req.body.name, author: req.body.author };
        sinon.stub(Book, 'findById').returns(book);

        await getBook(req, res, next);

        expect(Book.findById.calledOnce).to.be.true;
        expect(res.status.calledOnceWith(200)).to.be.true;
        expect(res.json.calledOnceWith({ message: 'Book fetched', book: book })).to.be.true;
    });
});

describe('Feed Controller - Update book', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            params: { bookId: 'someBookId' },
            body: { name: "someName", author: "someAuthor" },
            userId: 'someUserId'
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
        next = sinon.stub();
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should throw an error 404 if the book is not found', async () => {
        sinon.stub(Book, 'findById').returns(null);

        await updateBook(req, res, next);

        expect(next.calledOnce).to.be.true;
        const error = next.firstCall.args[0];
        expect(error).to.be.an('error');
        expect(error.message).to.equal('Could not find book');
        expect(error.statusCode).to.equal(404);
    });

    it('should throw an error 403 if the user is not authorized', async () => {
        const book = { creator: 'someOtherUserId' };
        sinon.stub(Book, 'findById').returns(book);

        await updateBook(req, res, next);

        expect(next.calledOnce).to.be.true;
        const error = next.firstCall.args[0];
        expect(error).to.be.an('error');
        expect(error.message).to.equal('Not authorized');
        expect(error.statusCode).to.equal(403);
    });

    it('should update the book', async () => {
        const book = { creator: req.userId, name: req.body.name, author: req.body.author, save: sinon.stub().returnsThis() };
        sinon.stub(Book, 'findById').returns(book);

        await updateBook(req, res, next);

        expect(Book.findById.calledOnce).to.be.true;
        expect(book.save.calledOnce).to.be.true;
        expect(res.status.calledOnceWith(200)).to.be.true;
        expect(res.json.calledOnceWith({ message: 'Book updated', book: book })).to.be.true;
    });

    it('should throw 500 for unexpected errors', async () => {
        sinon.stub(Book, 'findById').throws();

        await updateBook(req, res, next);

        expect(next.calledOnce).to.be.true;
        const error = next.firstCall.args[0];
        expect(error).to.be.an('error');
        expect(error.statusCode).to.equal(500);
    });
});

describe('Feed Controller - Delete book', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            params: { bookId: 'someBookId' },
            userId: 'someUserId'
        };
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };
        next = sinon.stub();
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should throw an error 404 if the book is not found', async () => {
        sinon.stub(Book, 'findById').returns(null);

        await deleteBook(req, res, next);

        expect(next.calledOnce).to.be.true;
        const error = next.firstCall.args[0];
        expect(error).to.be.an('error');
        expect(error.message).to.equal('Could not find book');
        expect(error.statusCode).to.equal(404);
    });

    it('should throw an error 403 if the user is not authorized', async () => {
        const book = { creator: 'someOtherUserId' };
        sinon.stub(Book, 'findById').returns(book);

        await deleteBook(req, res, next);

        expect(next.calledOnce).to.be.true;
        const error = next.firstCall.args[0];
        expect(error).to.be.an('error');
        expect(error.message).to.equal('Not authorized');
        expect(error.statusCode).to.equal(403);
    });

    it('should delete the book and update the user', async () => {
        const book = { creator: req.userId };
        sinon.stub(Book, 'findById').returns(book);
        sinon.stub(Book, 'findByIdAndDelete').returns(book);
        const user = { books: { pull: sinon.stub() }, save: sinon.stub().returnsThis() };
        sinon.stub(User, 'findById').returns(user);
        
        await deleteBook(req, res, next);

        expect(Book.findById.calledOnce).to.be.true;
        expect(Book.findByIdAndDelete.calledOnceWith(req.params.bookId)).to.be.true;
        expect(User.findById.calledOnceWith(req.userId)).to.be.true;
        expect(user.books.pull.calledOnceWith(req.params.bookId)).to.be.true;
        expect(user.save.calledOnce).to.be.true;
        expect(res.status.calledOnceWith(200)).to.be.true;
        expect(res.json.calledOnceWith({ message: 'Deleted book' })).to.be.true;
    });

    it('should throw 500 for unexpected errors', async () => {
        sinon.stub(Book, 'findById').throws();

        await deleteBook(req, res, next);

        expect(next.calledOnce).to.be.true;
        const error = next.firstCall.args[0];
        expect(error).to.be.an('error');
        expect(error.statusCode).to.equal(500);
    });
});