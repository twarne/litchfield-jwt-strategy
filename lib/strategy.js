'use strict';

var Passport = require('passport-strategy'),
    util = require('util'),
    JWT = require('green-jwt'),
    _ = require('underscore');

function JWTStrategy(options, loadAuthEntity, loadKey) {
    if(typeof options === 'function') {
        var temp = loadAuthEntity;
        loadAuthEntity = options;
        loadKey = temp;
        options = {};
    }
    if(!loadAuthEntity) {
        throw new TypeError('JWTStrategy requires a loadAuthEntity function');
    }

    this.name = 'jwt';
    this._loadAuthEntity = loadAuthEntity;
    this._loadKey = loadKey;
    this._passReqToCallback = options.passReqToCallback;
}

util.inherits(JWTStrategy, Passport.Strategy);

JWTStrategy.prototype.authenticate = function(req) {
    console.log('Authenticating JWT');

    if(!req.headers || !req.headers.authorization) {
        this.fail('No JWT found');
    }

    var encodedJWT = req.headers.authorization;
    var jwt = JWT.decode(encodedJWT);

    var self = this;
    this._loadKey(jwt)
    .then(
        function(verifyKey) {
            return jwt.verify(verifyKey);
        })
    .then(
        function(verified) {
            return this._loadAuthEntity(jwt.claim);
        })
    .then(
        function(authEntity) {
            req.authEntity = authEntity;
            req.jwt = jwt;
            self.pass();
        })
    .then(
        null,
        function(err) {
            self.fail('Failed to authenticate via JWT');
        }
    );
};

exports = module.exports = JWTStrategy;
