const meetingsCollection = require("./getCollections").meetings
const connection = require("./establishConnection");
const ObjectID = require("mongodb").ObjectID;
const slugify = require("slugify");

let createMeeting = async function(meetupName,owner,date,location){
    if(!meetingsCollection || !owner || !date || !location){
        return false;
    }
    else{
        const meetings = await meetingsCollection();
        const users = await usersCollection();
        const ownerID = await getUserByUsername(username)["_id"];
        if(!ownerID){
            return false;
        }
        let meeting = {
                        meetupName:meetupName,
                        owner:ownerID,
                        attendees:[ownerID], 
                        date:date,
                        location:location,
                        comments:[]
                    } 
        const insertInfo = await meetings.insertOne(meeting);
        if(insertInfo.insertedCount === 0){
            throw "Unable to create user."
        }
        return true;
    }
} 

let getMeetingByOwnerId = async function(ownerId){
    if(!ownerId){
        return false;
    }else{
        const meetings = await meetingsCollection();
        const found = await meetings.findOne({"owner" : ownerId});
        if(found === null){
            return {"empty" : true};
        }
        return found;
    }
}

let getMeetingByUserId = async function(userId){
    if(!userId){
        return false;
    }else{
        const meetings = await meetingsCollection();
        const found = await meetings.find({"attendees" : userId});
        if(found === null){
            return {"empty" : true};
        }
        return found;
    }
}

let getMeetingByLocation = async function(location){
    if(!location){
        return false;
    }else{
        const meetings = await meetingsCollection();
        const found = await meetings.find({"location" : location});
        if(found === null){
            return {"empty" : true};
        }
        return found;
    }
}

let getMeetingByPreferences = async function(prefArray){
    if(!prefArray){
        return false;
    }else{
        const meetings = await meetingsCollection();
        let found = await meetings.find({"preferences" : {$in : prefArray}});
        if(found === null){
            return {"empty" : true};
        }
        return found;
    }
}

let getFutureMeetings = async function(date){
    if(!date){
        return false;
    }else{
        const meetings = await meetingsCollection();
        let found = await meetings.find({"date" : {$gt : date}});
        if(found === null){
            return {"empty" : true};
        }
        return found;
    }
}

let getPreviousMeetings = async function(date){
    if(!date){
        return false;
    }else{
        const meetings = await meetingsCollection();
        let found = await meetings.find({"date" : {$lt : date}});
        if(found === null){
            return {"empty" : true};
        }
        return found;
    }
}

module.exports = {
    createMeeting,
    getMeetingByUserId,
    getMeetingByOwnerId,
    getMeetingByLocation,
    getMeetingByPreferences,
    getPreviousMeetings,
    getFutureMeetings
}