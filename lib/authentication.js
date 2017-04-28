
let xtend = require('xtend');
let unless = require('express-unless');
let token_dal = require('../dal/token');
let async = require('async');

module.exports = function authentication(opts) {
    let defaultOpts = {
        setAuth: true
    };
    defaultOpts = xtend(defaultOpts, opts);

    let middleWare = function middleWare(req, res, next) {
        async.waterfall([
            checkOption,
            checkAuthenticationExistence,
            checkAuthenticationType,
            checkTokenExistence,
            tokenRevoked,
            tokenExpired
        ], function () {
            // Token seems okay
            next();
        });

        // Check Authentication option values
        function checkOption(callback) {
            if (defaultOpts.setAuth === false) {
                next();
            } else {
                callback();
            }
        }

        // Checks if Authentication Exists
        function checkAuthenticationExistence(callback) {
            let auth = req.get("Authentication");
            if (!auth) {
                res.status(403);
                res.json({error: "Please set authentication key"});
            } else {
                callback();
            }
        }

        // Checks if Authentication type is Bearer
        function checkAuthenticationType(callback) {
            let auth_array = auth.split(/\s+/);
            let auth_name = auth_array[0];
            if (auth_name !== "Bearer") {
                res.status(403);
                res.json({error: "Set Authentication type to Bearer"});
            } else {
                callback();
            }
        }

        // Check for token's existence
        function checkTokenExistence(callback) {
            let token_value = auth_array[1];
            let query = {value: token_value};

            token_dal.get(query, function (err, data) {
                if (err) {
                    res.status(500);
                    res.json({error: "Server Error, Try again"});
                } else {

                    if (!data._id) {
                        res.status(401);
                        res.json({error: "Token is not recognized"});
                    } else {
                        callback(null, data);
                    }
                }
            });
        }

        // Check if token is revoked
        function tokenRevoked(err, data, callback) {
            if (data.revoked) {
                res.status(401);
                res.json({error: "Token is revoked, Login again"});
            } else {
                callback(null, data);
            }
        }

        // Check if token has expired
        function tokenExpired(err, data, callback) {
            let expiryDate = data.expirationDate;

            function expired(date) {
                let now = new Date();
                if ((date.getYear() > now.getYear()) && (date.getMonth() > now.getMonth()) && (date.getDate() > now.getDate())) {
                    return true;
                } else {
                    return false;
                }
            }

            if (expired(expiryDate)) {
                // token has expired
                res.statusCode(401);
                res.json({error: "Token has expired"});
            } else {
                // token has not yet expired
                callback();
            }
        }

    }

    middleWare.unless = unless;
    return middleWare;
}