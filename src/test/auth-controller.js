const expect = require('chai').expect;
const sinon = require('sinon');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const signup = require('../controllers/auth').signup;
const login = require('../controllers/auth').login;

describe('Auth Controller - Sign up', function(){
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {
                email: 'testEmail@gmail.com',
                name: 'testUser',
                password: 'testPassword'
            }
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

    it('should create user', async () => {
        const hashedPassword = 'hashedpassword';
        sinon.stub(bcrypt, 'hash').resolves(hashedPassword);

        const saveStub = sinon.stub(User.prototype, 'save').resolves({
            _id: 'newUserId'
        });

        await signup(req, res, next);

        expect(bcrypt.hash.calledOnceWith('testPassword', 12)).to.be.true;
        expect(saveStub.calledOnce).to.be.true;
        expect(res.status.calledOnceWith(201)).to.be.true;
        expect(res.json.calledOnceWith({ message: 'User created', userId: 'newUserId' })).to.be.true;
    });

    it('should throw 500 for unexpected errors', async () => {
        sinon.stub(bcrypt, 'hash').throws();

        await signup(req, res, next);

        expect(next.calledOnce).to.be.true;
        const error = next.firstCall.args[0];
        expect(error).to.be.an('error');
        expect(error.statusCode).to.equal(500);
    });

})

describe('Auth Controller - Login', function(){
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {
                email: 'testEmail@gmail.com',
                name: 'testUser',
                password: 'testPassword'
            }
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

    it('should return a token and userId if login is successful', async () => {
        const user = {
            _id: 'userId',
            email: 'testEmail@gmail.com',
            password: 'hashedPassword'
        };
        sinon.stub(User, 'findOne').resolves(user);
        sinon.stub(bcrypt, 'compare').resolves(true);
        const token = 'jwtToken';
        sinon.stub(jwt, 'sign').returns(token);

        await login(req, res, next);

        expect(bcrypt.compare.calledOnceWith('testPassword', 'hashedPassword')).to.be.true;
        expect(res.status.calledOnceWith(200)).to.be.true;
        expect(res.json.calledOnceWith({ token: token, userId: user._id.toString() })).to.be.true;
    });

    it('should throw an error 401 if the password is wrong', async () => {
        const user = {
            email: 'testEmail@gmail.com',
            password: 'hashedPassword'
        };
        sinon.stub(User, 'findOne').resolves(user);
        sinon.stub(bcrypt, 'compare').resolves(false);

        await login(req, res, next);

        expect(bcrypt.compare.calledOnceWith('testPassword', 'hashedPassword')).to.be.true;
        expect(next.calledOnce).to.be.true;
        const error = next.firstCall.args[0];
        expect(error).to.be.an('error');
        expect(error.message).to.equal('Wrong password');
        expect(error.statusCode).to.equal(401);
    });

    it('should throw an error 401 if the user could not be found', async () => {
        sinon.stub(User, 'findOne').resolves(null);

        await login(req, res, next);

        expect(next.calledOnce).to.be.true;
        const error = next.firstCall.args[0];
        expect(error).to.be.an('error');
        expect(error.message).to.equal('A user with this email could not be found');
        expect(error.statusCode).to.equal(401);
    });

    it('should throw an error 500 for unexpected errors',  async () =>{
        sinon.stub(User, 'findOne').throws();

        await login(req, res, next);

        expect(next.calledOnce).to.be.true;
        const error = next.firstCall.args[0];
        expect(error).to.be.an('error');
        expect(error.statusCode).to.equal(500);
    })
})