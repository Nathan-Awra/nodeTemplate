
let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let bcrypt = require('bcrypt');
let config = require('../config');
let async = require('async');

let User = new Schema({
    name            : {type : String},
    password        : {type : String},
    // Insert the rest of the attributes here.
});

// Hiding some attributes from being sent.
User.statics.attributes = {
    password: 0,
};

// verifying Password
User.methods.verifyPassword = function verifyPassword(password,callback) {
    bcrypt.compare(password,this.password,callback);
};

// Pre-save operation
User.pre('save',function modifyData(next) {
    // Updating time Stamp of first and last modified before initial save
    let now = new Date();
    let userSchema = this;
    // Saving for the first time
    if(!userSchema.firstModified){

        async.waterfall([
            updatingTime,
            hashingPassword],function () {
            next();
        });
        // Updating Log time
        function updatingTime(callback) {
            // Updating time
            userSchema.firstModified = now.toISOString();
            userSchema.lastModified = now.toISOString();
            callback();
        }
        // Hashing password
        function hashingPassword(callback) {
            // hashing password
            bcrypt.genSalt(config.SALT_LENGTH,function (err,salt) {
                bcrypt.hash(userSchema.password,salt,function (err,hashedPassword) {
                    userSchema.password = hashedPassword;
                    callback();
                });
            });
        }

    }
    // Modifying saved data
    else{
        userSchema.lastModified = now.toISOString();
        next();
    }
});

module.exports = mongoose.model("user", User);

