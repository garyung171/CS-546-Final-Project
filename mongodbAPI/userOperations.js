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
    user["validLoginSessions"].push(sessionID);
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
        return false;
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

let updateSessions = async function(username, array){
    const users = await usersCollection();
    const modifiedUpdateInfo = await users.updateOne({"username": username}, 
    {$set:
        { "validLoginSessions" : array}
    });
    if(modifiedUpdateInfo.modifiedCount === 0){
        throw "Could not update user.";
    }
    return true;
}

let updateUsername = async function(username, newName){
    const users = await usersCollection();
    const modifiedUpdateInfo = await users.updateOne({"username": username},
    {$set:
        { "username" : newName}
    });
    if(modifiedUpdateInfo.modifiedCount === 0){
        throw "Could not update user.";
    }
    return true;
}

let updatePassword = async function(username, newPassword){
    const users = await usersCollection();
    const modifiedUpdateInfo = await users.updateOne({"username": username},
    {$set:
        {"password" : newPassword}
    });
    if(modifiedUpdateInfo.modifiedCount === 0){
        throw "Could not update user.";
    }
    return true;
}

let updateLocation = async function(username, newLocation){
    const users = await usersCollection();
    const modifiedUpdateInfo = await users.updateOne({"username": username},
    {$set:
        {"location" : newLocation}
    });
    if(modifiedUpdateInfo.modifiedCount === 0){
        throw "Could not update user.";
    }
    return true;
}

let updateEmail = async function(username, newEmail){
    const users = await usersCollection();
    const modifiedUpdateInfo = await users.updateOne({"username": username},
    {$set:
        {"email" : newEmail}
    });
    if(modifiedUpdateInfo.modifiedCount === 0){
        throw "Could not update user.";
    }
    return true;
}

let updatePreferences = async function(username, prefArray){
    const users = usersCollection();
    const modifiedUpdateInfo = await users.updateOne({"username" : username}, 
    {$set : 
        {"preferences" : prefArray}
    });
    if(modifiedUpdateInfo.modifiedCount === 0){
        throw "Could not update user.";
    }
    return true;
}

module.exports = {
    getAllUsers,
    getUserByUsername,
    getUserById,
    getUserBySessionID,
    addSessionToUser,
    getUserByProfileAddress,
    createUser,
    updateSessions,
    updateUsername,
    updatePassword,
    updateLocation,
    updateEmail,
    updatePreferences
}
