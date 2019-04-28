const usersCollection = require("./getCollections").users
const connection = require("./establishConnection");
const ObjectID = require("mongodb").ObjectID

let getAllUsers = async function(){
    const users = await usersCollection();
    const allUsers = await users.find({}).toArray();
    return allUsers;
}

let getUserByUsername = async function(username){
    if(typeof(username) != "string"){
        throw new Error("The input username is not a string");
    }
    const users = await usersCollection();
    const user = await users.find({"username":username}).
    return user
}
module.exports = {
    getAllUsers,
    getUserByUsername
}
