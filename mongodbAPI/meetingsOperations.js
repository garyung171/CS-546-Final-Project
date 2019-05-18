const meetingsCollection = require("./getCollections").meetups;
const usersCollection = require("./getCollections").users;
const connection = require("./establishConnection");
const ObjectID = require("mongodb").ObjectID;
const slugify = require("slugify");

let createMeeting = async function(meetupName,owner,date,location, preferences){
    if(!meetingsCollection || !owner || !date || !location || !preferences){
        return false;
    }
    else{
        const meetings = await meetingsCollection();
        const users = await usersCollection();
        let meeting = {
                        meetupName:meetupName,
                        owner:owner,
                        attendees:[owner], 
                        date:date,
                        location:location,
                        preferences: preferences,
                        comments:[]
                    } 
        const insertInfo = await meetings.insertOne(meeting);
        if(insertInfo.insertedCount === 0){
            throw "Unable to create user."
        }
        return insertInfo.insertedId;
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

let getUsersFutureMeetings = async function(id,date){
    if(!date){
        return false;
    }else{
        const meetings = await meetingsCollection();
        let found = await meetings.find({"attendees":id,"date" : {$gte : date}});
        if(found === null){
            return {"empty" : true};
        }
        return found.toArray();
    }
}

let getUsersPreviousMeetings = async function(id,date){
    if(!date){
        return false;
    }else{
        const meetings = await meetingsCollection();
        let found = await meetings.find({"attendees":id,"date" : {$lt : date}});
        if(found === null){
            return {"empty" : true};
        }
        return found.toArray();
    }
}
let getMeetingByMeetId = async function(meetId){
    if(!meetId){
        return false;
    }else{
        const meetings = await meetingsCollection();
        let found = meetings.findOne({"_id" : meetId});
        if (found === null){
            return {"empty" : true};
        }
        return found;
    }
}

let updateMeetingsComments = async function(meetId, comment){
    if(!meetId || !comment){
        return false;
    }else{
        const meetings = await meetingsCollection();
        let meeting = await getMeetingByMeetId(meetId);
        let comments = meeting.comments;
        comments.push(comment);
        const modifiedUpdateInfo = await meetings.updateOne(
            {"_id" : meetId},
            {$set:
                {"comments" : comments}
            }
        );
        if (modifiedUpdateInfo.modifiedCount === 0){
            return false;
        }
        return true;
    }
}

module.exports = {
    createMeeting,
    getMeetingByUserId,
    getMeetingByOwnerId,
    getMeetingByLocation,
    getMeetingByPreferences,
    getPreviousMeetings,
    getFutureMeetings,
    getUsersPreviousMeetings,
    getUsersFutureMeetings,
    getMeetingByMeetId,
    updateMeetingsComments
}
