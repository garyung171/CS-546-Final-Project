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
    const newValidLoginSessions = user["validLoginSessions"].push(sessionID);
    const modifiedUpdateInfo = await users.updateOne({"_id":user["_id"]},{$set:{"validLoginSessions":newValidLoginSessions}});
    if(modifiedUpdateInfo.modifiedCount === 0){
        throw "Unable to modify user";
    }
}

let createUser = async function(user, pass, loc, em){
    if(!user || !pass || !loc || !em){
        throw "Necessary information missing.";
    }else{
        const users = await usersCollection();
        let person = {
            username: user,
            password: pass,
            location: loc,
            email: em,
            preferences: [],
            validLoginSessions: []
        }
        const insertInfo = await users.insertOne(person);
        if(insertInfo.insertedCount === 0){
            throw "Unable to create user.";
        }
    }
}
module.exports = {
    getAllUsers,
    getUserByUsername,
    getUserById,
    getUserBySessionID,
    addSessionToUser,
    createUser
}
