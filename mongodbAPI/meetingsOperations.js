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
        
