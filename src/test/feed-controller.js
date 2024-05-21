const { expect } = require('chai');
const sinon = require('sinon');
const Book = require('../models/book'); 
const User = require('../models/user'); 
const deleteBook = require('../controllers/feed').deleteBook; 

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