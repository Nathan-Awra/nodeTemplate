
let Model = require('../models/user');
let config = require('../config');

// create User
exports.create = function createUser(data,callback) {
    Model.create(data,callback);
};

// get User
exports.get = function getUser(query,callback) {
    Model.findOne(query,Model.attributes,callback);
};

// delete User
exports.remove = function removeUser(query,callback){
    Model.findOneAndRemove(query,callback);
};

// update User
exports.update = function updateUser(query,updateData,callback) {
    Model.findOneAndUpdate(query, updateData, {new: true}, callback);
};

// get collection
exports.getCollection = function getCollectionUsers(query,callback) {
    Model.find(query,Model.attributes,callback);
};

// get Collection by pagination
exports.getCollectionPagination = function getCollectionUsers(query,pageNumber,callback) {
    Model.find(query,Model.attributes,function (err1,data) {
        let beginIndex = (pageNumber * config.ELEMENT_IN_PAGE)-12;

        if(data.length < beginIndex){
            // begin Index is greater than the available data length
            beginIndex = data.length - config.ELEMENT_IN_PAGE;
        }
        let lastIndex = beginIndex + config.ELEMENT_IN_PAGE;
        if(lastIndex > data.length){
            lastIndex = data.length;
        }
        let quantifiedArray = data.slice(beginIndex,lastIndex);

        // Counting data and format it for clearer understanding of the map
        Model.count(query,function (err2,countNumber) {
            // counting the hole of
            let approxPage = Math.ceil(countNumber/config.ELEMENT_IN_PAGE);
            let compiledData = {
                totalPage    : approxPage,
                currentPage  : pageNumber,
                data         : quantifiedArray
            };
            callback(err1,compiledData);
        });
    }).sort({lastModified : 'desc'});
};
