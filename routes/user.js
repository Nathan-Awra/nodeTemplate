/**
 * Created by nathan on 4/12/17.
 */
let express = require('express');
let router = express.Router();
let controller = require('../controllers/user');
let authorization = require('../lib/authorization');
let constants = require('../lib/constants');
let superUser = constants.user_type.super_user;
let user = constants.user_type.user;

// TODO DON't forget to document.
// How to set api authorization param
// How to set api note


/**
 * @api {post} /user/signup Useristrator signUp
 * @apiName SignUp Useristrator.
 * @apiGroup Useristrator
 *
 * @apiParam {String} authorizationToken - Bearer - SuperUser's
 *
 * @apiParam {String} name - User Name
 * @apiParam {String} userName - User Unique user name
 * @apiParam {String} password - User Password
 * @apiParam {String} email - User Email
 * @apiParam {String} phone - User Phone Address
 *
 * @apiParamExample Request Example :
 *
 * key : Authorization
 * value : Bearer 165465d4af64a65f4d6a4f6d46f4a6
 *
 * {
 * "name"      : "sampleUserName",
 * "userName"  : "sampleUserUserName",
 * "password"  : "sampleUserPassword1234",
 * "email"     : "sampleuserEmail@someemail.com",
 * "phone"     : "123456789"
 * }
 *
 * @apiSuccessExample Response Example :
 *
 * {
 *   "_id"          : "58f8ae80dca47614b3a5b0f5",
 *   "lastModified" : "2017-04-20T12:50:08.766Z",
 *   "firstModified": "2017-04-20T12:50:08.766Z",
 *   "name"         : "sampleUserName",
 *   "userName"     : "sampleUserUserName",
 *   "email"        : "sampleuserEmail@someemai.com",
 *   "phone"        : "123456789",
 *   "__v"          : 0,
 *   "accessLevel"  : 2
 *   }
 *
 */
router.post('/signup',[authorization(superUser)],controller.signup);

// login
router.post('/login',[authorization(user)],controller.login);

// logout
router.post('/logout',[authorization(user)],controller.logout);

// get User by id
router.get('/find/:userId',[authorization(user)],controller.getUser);

// get all User by page
router.get('/find/page/:page',[authorization(user)], controller.page);

// update User by id
router.put('/update/:userId',[authorization(user)],controller.updateById);

// remove User by id
router.delete('/remove/:userId',[authorization(superUser)],controller.removeById);


module.exports = router;