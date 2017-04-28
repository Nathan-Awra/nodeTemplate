/**
 * Created by nathan on 4/13/17.
 */
let user_dal = require('../dal/user');
let async = require('async');

exports.checkUserExistence = function checkUserExistence(userName,email,phoneNumber,callback) {
    async.waterfall([
        checkUserNameExistence,
        checkEmailExistence,
        checkPhoneExistence
    ],function () {
        // User profile does not exist
        callback(null, null, null, false);
    });


    // Check's user name existence
    function checkUserNameExistence(cb) {
        // Checking if the user name already exists
        let query_userName = {userName : userName};
        user_dal.get_private(query_userName,function (err,data) {
            if (err) {
                callback(err, 500, {error: "Enquiry Error"}, true);
            }
            else if (data) {
                callback(err, 400, {error: "User name already exists"}, true);
            }else if(!data){
                cb();
            }
        });
    }

    // Check's email existence
    function checkEmailExistence(cb) {
        // Checking if the email already exists
        let query_email = {email: email};
        user_dal.get_private(query_email,function (err,data) {
            if (err) {
                callback(err, 500, {error: "Enquiry Error"}, true);
            }
            else if (data) {
                callback(err, 400, {error: "Email already exists"}, true);
            }
            else {
                cb();
            }
        });
    }

    // Check Phone existence
    function checkPhoneExistence(cb){
        // Checking if the phone already exists
        let query_phone = {phone: phoneNumber};
        user_dal.get_private(query_phone,function (err,data) {
            if(err){
                callback(err,500,{error : "Enquiry Error"},true);
            }
            else if(data){
                callback(err, 400, {error: "Phone number already exists"},true);
            }else{
               cb();
            }
        });
    }
}