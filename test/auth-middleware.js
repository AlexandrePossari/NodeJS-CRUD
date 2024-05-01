const expect = require('chai').expect;

const authMiddleware = require('../middleware/is-auth');

describe('Auth middleware', function(){
    it('should throw an error if no authorization header is present', function (){
        const req = {
            get: function(){
                return null;
            }
        }
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw('Not authenticated');
    });
    
    it('should throw an error if the authorization header is only one string', function(){
        const req = {
            get: function(headerName){
                return 'abc';
            }
        };
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
    });

    it('should throw an error if the token cannot be verified', function(){
        const req = {
            get: function(headerName){
                return 'Bearer xyz'
            }
        };
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
    })

});

