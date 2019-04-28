const usersCollection = require("./getCollections").users
const connection = require("./establishConnection");
const ObjectID = require("mongodb").ObjectID

let getAllUsers = async function(){
    const users = await users();
    const allUsers = await users.find({}).toArray();
    return allUsers;
}

module.exports = {
    getAllUsers
}
