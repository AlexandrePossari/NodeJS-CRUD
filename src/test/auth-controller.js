const expect = require('chai').expect;
const sinon = require('sinon');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
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
    it('should throw an error 500 if accessing the database fails', function(done){
        sinon.stub(User, 'findOne');
        User.findOne.throws();

        const req = {
            body: {
                email: 'test@test.com',
                password: 'tester'
            }
        }

        AuthController.login(req, {}, ()=> {}).then(result => {
            expect(result).to.be.an('error')
            expect(result).to.have.property('statusCode', 500)
            done();
        }).catch(err => {
            done(err);
        });

        User.findOne.restore();
    })
})