/**
 * Created by nathan M. Degineh - N8
 * Felege MicroService -- PlaceFinder
 * @Author Nathan
 * @Project Felege - Place Finder
 * @Description Felege is a place finder app.
 * @ModuleDescription Defines authorization middle ware.
 * @Date April 20th 2017
 */

let token_dal = require('../dal/token');
let admin_dal = require('../dal/admin');
let constants = require('./constants');
let async = require('async');

module.exports = function authorization(role) {
  
    return function (req,res,next) {

        async.waterfall([
            checkRole,
            checkTokenExistence,
            retrieveAdminData,
            checkAccessLevel],
            function (error) {
                if(error){
                    res.status(500);
                    res.json({message: "Server error, please try again"});
                }else{
                    // Authorization is okay
                    next();
                }
        });

        // Checking Role
        function checkRole(callback){

            if(role === constants.admin_type.super_admin || role === constants.admin_type.admin) {
                callback(null, role);
            }else{
                res.status(203);
                res.json({error : "Unknown access type, (Non - Authoritative)"});
            }
        }

        // Checking Token's existence
        function checkTokenExistence(error,adminType,callback) {
            let auth = req.get('Authentication');
            if(!auth){
                res.status(401);
                res.json({error: "Please set Authorization Key"});

            }else{
                let authArray = auth.split(/\s+/);
                let token = authArray[1];
                let token_query = {value: token};
                token_dal.get(token_query,function (err,data) {
                    if(err){
                        res.status(500);
                        res.json({error: "Server side error, please try again"});
                    }else{
                        callback(error,adminType,data);
                    }
                });
            }

        }

        // Retrieving Admin's data
        function retrieveAdminData(error,adminType,data,callback) {

            let userId = data.user;
            let user_query = {_id : userId};
            admin_dal.get(user_query,function (err,data) {
                if(err){
                    res.status(500);
                    res.json({error: "Server side error, please try again"});
                }else if(!data){
                    res.status(401);
                    res.json({error: "Unauthorized access"});
                }else if(data){
                    callback(error,adminType,data);
                }

            });

        }

        // Checking Access level
        function checkAccessLevel(error,adminType,data,callback) {
            if((data.accessLevel === 1) && (adminType === constants.admin_type.super_admin)){
                // Super admin access
                callback(error);

            }else if(((data.accessLevel === 2) || (data.accessLevel === 1)) && (adminType === constants.admin_type.admin)){
                // admin access
                callback(error);
            }else{
                res.status(401);
                res.json({error: "Unauthorized access"});
            }
        }
    }
};