
let express = require('express');
let app = express();
let parser = require('body-parser').json();
let validator = require('express-validator')();
let config = require('./config');
let route = require('./routes');
let mongoose = require('mongoose');
let authentication = require('./lib/authentication');
let debug = require('debug')('users');

// connecting to mongodb
mongoose.connect(config.MONGODB_URL);

// On mongoose success connection
mongoose.connection.on('connected',function () {
    console.log("mongodb connected successfully");
    debug("mongodb connected successfully");
});

// On mongoose failed connection
mongoose.connection.on('error',function (err) {
    console.log("mongodb connection failed... trying to reconnect again");
    console.log("Error is : " + err);
    debug("mongodb connection failed... trying to reconnect again");
    mongoose.connect(config.MONGODB_URL);
});

// Passing Authentication middleware
app.use(authentication().unless({
    path : ['/user/login','/user/signup','/admin/login/','/admin/signup']
}));

// Passing third party middle wares
app.use(validator);
app.use(parser);

// Routing app
route(app);

app.listen(config.HTTP_PORT,function () {
    console.log("Server created at port : %s",config.HTTP_PORT);
    debug("Server created at port : %s",config.HTTP_PORT);
});