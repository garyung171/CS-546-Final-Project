const usersCollection = require("./getCollections").users
const connection = require("./establishConnection");
const ObjectID = require("mongodb").ObjectID;
const slugify = require("slugify");
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
    const user = await users.findOne({"username":username});
    if(user === null){
        return {empty:true};
    }
    return user;
}

let getUserById = async function(id){
    if(typeof(id) === "string"){
        id = ObjectID(id);
    }
    const users = await usersCollection();
    const user = await users.find({"_id":id});
    if(user === null){
        return {empty:true};
    }
    return user;
}

let getUserByProfileAddress = async function(profileAddress){
    if(typeof(profileAddress) != "string"){
        throw new Error("The input profileAddress is not a string");
    }
    const users = await usersCollection();
    const user = await users.findOne({"profileAddress":profileAddress});
    if(user === null){
        return {empty:true};
    }
    return user;
}
   
let getUserBySessionID= async function(sessionID){
    if(!sessionID){
        throw "No SessionID inputted";
    }
    let users = await usersCollection();
    let user = await users.findOne({"validLoginSessions":sessionID});
    if(user === null){
        return {empty:true};
    }
    return user;
}
    
let addSessionToUser = async function(user,sessionID){
    if(!user || !sessionID){
        throw "No user inputted";
    }
    const users = await usersCollection();
    console.log(user);
    user["validLoginSessions"].push(sessionID);
    console.log(user["validLoginSessions"]);
    const modifiedUpdateInfo = await users.updateOne({"_id":user["_id"]},
    {$set:
        {
            "validLoginSessions":user["validLoginSessions"]
        }
    });
    if(modifiedUpdateInfo.modifiedCount === 0){
        throw "Unable to modify user";
    }
}

let createUser = async function(username, password, location, email){
    if(!username || !password || !location || !email){
        throw "Necessary information missing.";
    }else{
        const users = await usersCollection();
        const usernameInDatabase = await getUserByUsername(username)["empty"] == false;
        const profileAddressInDatabase = await getUserByProfileAddress(slugify(username))["empty"] == false;
        if(usernameInDatabase||profileAddressInDatabase){
            return false;
        } 
        let person = {
            "username": username,
            "password": password,
            "location": location,
            "email": email,
            "preferences": [],
            "validLoginSessions": [],
            "profileAddress":slugify(username)
        }
        const insertInfo = await users.insertOne(person);
        if(insertInfo.insertedCount === 0){
            throw "Unable to create user.";
        }
        return true;
    }
}
module.exports = {
    getAllUsers,
    getUserByUsername,
    getUserById,
    getUserBySessionID,
    addSessionToUser,
    getUserByProfileAddress,
    createUser
}
