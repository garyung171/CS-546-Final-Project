const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const path = require("path");
const slugify = require("slugify");
const userOperations = require("../mongodbAPI/userOperations");
const meetingsOperations = require("../mongodbAPI/meetingsOperations");
const saltRounds = 8;
const ObjectID = require("mongodb").ObjectID;

let checkArraysHaveSameItems = function(arr1,arr2){
    if(arr1.length !== arr2.length){
        return false;
    }
    for(let i = 0; i < arr1.length; ++i){
        if(arr1[i] !== arr2[i]){
            return false;
        }
    }
    return true;
}
let checkLoginValidity = async function(username,password){
    if(!username || !password){
        return false;
    }
    let user = await userOperations.getUserByUsername(username);
    if(!user["empty"]){
        let validPassword = await bcrypt.compare(password,user["password"]);
        return validPassword;
    }
    return false;
}

router.get("/",async (req,res)=>{
    try{
        if(req.session.loggedIn){
            let currentUser = await userOperations.getUserBySessionID(req.session.id);
            res.redirect("/profile/"+slugify(currentUser["username"]));
            return;
        }
        else{
            res.render("login",{
                title:"Login",
                loginError:(req.session.loginError) ? true : false,
                signupError:(req.session.signupError)? true : false
            });
            return;
        }
    }
    catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

router.post("/login",async (req,res)=>{
    try{
        req.session.loginError = false;
        req.session.signupError = false;
        let validLogin = await checkLoginValidity(req.body.username,req.body.password);
        if(validLogin){
            let currentUser = await userOperations.getUserByUsername(req.body.username);
            await userOperations.addSessionToUser(currentUser,req.session.id);
            req.session.loggedIn = true;
            res.redirect("/profile/"+slugify(currentUser["username"]));
            return;
        }
        else{
            req.session.loginError = true;
            res.redirect("/");
            return;
        }
    }
    catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

router.post("/signup", async(req, res) =>{
    try{
        req.session.loginError = false;
        req.session.signupError = false;
        let username = req.body.username;
        let password = await bcrypt.hash(req.body.password, saltRounds);
        let location = req.body.location;
        let email = req.body.email;
        let successfulCreation = await userOperations.createUser(username,password,location,email);
        if(!successfulCreation){
            req.session.signupError = true;
            res.redirect("/");
            return;
        }
        req.session.loggedIn=true;
        let newUser = await userOperations.getUserByUsername(username);
        await userOperations.addSessionToUser(newUser,req.session.id);
        res.redirect("/profile/"+slugify(username));
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

router.get("/profile/:username", async(req, res) => {
    try{
        let currentUser = await userOperations.getUserByProfileAddress(req.params.username);
        let profileOwned = currentUser["validLoginSessions"].find(function(element){
            return req.session.id === element;
        }) != undefined;
        res.render("profile",{
            title: "Profile",
            username: currentUser.username,
            location: currentUser.location,
            email: currentUser.email,
            profileOwned:profileOwned,
            profileAddress:currentUser["profileAddress"],
            preferences:currentUser.preferences,
            loggedIn:req.session.loggedIn,
            userProfile: currentUser["username"]
        });
        return;
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

router.get("/edit-profile/:profileAddress", async (req, res) => {
    try{
        let currentUser = await userOperations.getUserBySessionID(req.session.id);
        if (currentUser.profileAddress != req.params.profileAddress) {
            res.sendStatus(403);
            return;
        }
        res.render("edit-profile",{
            title: "Edit Profile"
        });
        return;
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

router.get("/logout", async(req, res) => {
    if(!req.session.loggedIn){
        res.redirect("/");
    }
    else{
        try{
            let currentUser = await userOperations.getUserBySessionID(req.session.id);
            let sessions = currentUser.validLoginSessions;
            for(let i = 0; i < sessions.length; i++){
                if(sessions[i] == req.session.id){
                    sessions.splice(i, 1);
                }
            }
            let update = await userOperations.updateSessions(currentUser.username, sessions);
            if(update){
                req.session.destroy();
                res.redirect("/");
                return;
            }
        }catch(e){
            console.log(e);
            res.sendStatus(500);
        }
    }
});

router.post("/updateName", async(req, res) => {
    try{
        if(req.body.newName == ""){
            res.send(false);
            return;
        }else{
            let currentUser = await userOperations.getUserBySessionID(req.session.id);
            let newName = req.body.newName;
            const usernameInDatabase = await userOperations.getUserByUsername(newName);
            const profileAddressInDatabase = await userOperations.getUserByProfileAddress(slugify(newName));
            if(usernameInDatabase.empty===undefined||profileAddressInDatabase.empty===undefined){
                res.send(false);
                return
            }
            let update = await userOperations.updateUsername(currentUser.username, newName);
            res.send(update);
            return;
            }
        }
    catch(e){
        console.log(e);
        res.send(false);
        return;
    }
});

router.post("/updatePassword", async(req, res) =>{
    try{
        if(req.body.newPassword == ""){
            res.send(false);
            return;
        }else{
            let currentUser = await userOperations.getUserBySessionID(req.session.id);
            let newPassword = await bcrypt.hash(req.body.newPassword, saltRounds);
            let update = await userOperations.updatePassword(currentUser.username, newPassword);
            res.send(update);
            return;
        }
    }catch(e){
        console.log(e);
        res.send(false);
        return;
    }
});

router.post("/updateLocation", async(req, res) =>{
    try{
        if(req.body.newLocation == ""){
            res.send(false);
        }else{
            let currentUser = await userOperations.getUserBySessionID(req.session.id);
            let newLocation = req.body.newLocation;
            let update = await userOperations.updateLocation(currentUser.username, newLocation);
            res.send(update);
        }
    }catch(e){
        console.log(e);
        res.send(false);
    }
});

router.post("/updateEmail", async(req,res) => {
    try{
        if(req.body.newEmail == ""){
            res.send(false);
            return;
        }else{
            let currentUser = await userOperations.getUserBySessionID(req.session.id);
            let newEmail = req.body.newEmail;
            let update = await userOperations.updateEmail(currentUser.username, newEmail);
            res.send(update);
        }
    }catch(e){
        console.log(e);
        res.send(false);
    }
});

router.post("/updatePreferences", async (req, res) => {
    try{
        if(req.body["preferences"] === undefined){
            res.send(false);
            return;
        }else{
            let currentUser = await userOperations.getUserBySessionID(req.session.id);
            let preferences = (checkArraysHaveSameItems(req.body["preferences"],[""])) ? [] : req.body["preferences"];
            let update = await userOperations.updatePreferences(currentUser.username, preferences);
            res.send(update);
            return;
        }
    }catch(e){
        console.log(e);
        res.send(false);
        return;
    }
})

router.get("/create-meeting", async(req,res) =>{
    try{
        res.render("create-meeting",{createError:req.session.createError ? true : false});
    }
    catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});


router.post("/create-meeting", async (req,res) =>{
    if(!req.body.meetupName || !req.body.date || !req.body.location || !req.body.preferences || new Date(req.body.date) < new Date()){
        req.session.createError = true;
        res.redirect("/create-meeting");
        return;
    }
    try{
        req.session.createError = false;
        let owner = await userOperations.getUserBySessionID(req.session.id);
        let meetingCreated = await meetingsOperations.createMeeting(
            req.body.meetupName,
            owner["_id"],
            new Date(req.body.date),
            req.body.location,
            req.body.preferences
        );
        if(!meetingCreated){
            req.session.createError = true;
            res.redirect("/create-meeting");
            return;
        }
        res.redirect("/meeting/"+meetingCreated);
        return;
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

router.get("/joinmeeting/:meetingName", async (req, res) =>{
    try{
        req.session.joinError = false;
        let currentUser = await userOperations.getUserBySessionID(req.session.id);
        let meeting = await meetingsOperations.getMeetingByName(req.params.meetingName);
        let joined = await meetingsOperations.updateMeetingAttendees(meeting._id, currentUser);
        if(!joined){
            req.session.joinError = true;
        }
        res.redirect("/meeting/"+meeting._id);
        return;
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

router.get("/relevantMeetups", async (req, res) => {
    try{
        let currentUser = await userOperations.getUserBySessionID(req.session.id);
        let meetings = await userOperations.getRelevantMeetings(currentUser.username);
        async function revise(meetArray){
            for (const meeting of meetArray) {
                let owner = await userOperations.getUserById(meeting.owner)
                meeting.owner = owner.username;
            }
            return meetArray;
        }
        let newMeetings = await revise(await meetings.toArray());
        res.render("meetups", {
            meetups: await newMeetings
        });
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

router.get("/meeting/:meetId", async (req, res) => {
    try{
        let meetId = ObjectID(req.params.meetId);
        let meetup = await meetingsOperations.getMeetingByMeetId(meetId);
        if(meetup["empty"] === false){
            res.redirect("/relevantMeetups");
            return;
        }
        let meetupName = meetup.meetupName;
        let owner = await userOperations.getUserById(meetup.owner)
        let ownerName = owner.username;
        let attendees = meetup.attendees;
        let attendeesNames = [];
        for(let i = 0; i<attendees.length; i++){
            let user = await userOperations.getUserById(attendees[i]);
            let username = user.username;
            attendeesNames.push(username);
        };
        let date = meetup.date;
        let location = meetup.location;
        let comments = meetup.comments;
        for(let comment of comments){
            let commentPoster = await userOperations.getUserById(comment["postBy"]);
            comment["postBy"] = commentPoster.username;
        }
        let preferences = meetup.preferences;
        let joinError = false;
        if(req.session.joinError){
            joinError = true 
            req.session.joinError = false;
        }
        res.render("detail", {meetId:meetId,meetupName: meetupName, owner: ownerName, attendees: attendeesNames, date: date, location: location, comments: comments, preferences: preferences, joinError:joinError});
        return;
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

router.get("/my-meetings/:username", async(req,res)=>{
     try{
        let currentUser = await userOperations.getUserByProfileAddress(req.params.username);
        let profileOwned = currentUser["validLoginSessions"].find(function(element){
            return req.session.id === element;
        }) != undefined;
        previousMeetings = await meetingsOperations.getUsersPreviousMeetings(currentUser["_id"],new Date());
        futureMeetings = await meetingsOperations.getUsersFutureMeetings(currentUser["_id"],new Date());
        res.render("my-meetings",{futureMeetings:futureMeetings,previousMeetings:previousMeetings});
        return;
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});


router.post("/comments/:meetId", async (req, res) => {
    try{
        let meeting = await meetingsOperations.getMeetingByMeetId(ObjectID(req.params.meetId));
        let user = await userOperations.getUserBySessionID(req.session.id);
        let comment = {
            "_id": new ObjectID(),
            "postBy" : user._id,
            "date" : new Date(),
            "text" : req.body.commentText
        }
        let update = await meetingsOperations.updateMeetingsComments(ObjectID(req.params.meetId), comment);
        if(!update){
            throw "Unable to create comment"
        }
        res.redirect("/meeting/"+req.params.meetId);
        return;
    }catch(e){
        console.log(e);
        res.sendStatus(500);
        return;
    }
});

router.post("/leaveMeetup/:meetId", async(req, res) => {
    try{
        let currentUser = await userOperations.getUserBySessionID(req.session.id);
        let userId = currentUser._id;
        let update = await meetingsOperations.leaveMeeting(userId, req.params.meetId);
        if(!update){
            throw "Unable to leave meetup";
        }
        res.redirect("/meeting/"+req.params.meetId);
        return;
    }catch(e){
        console.log(e);
        res.sendStatus(500);
        return;
    }
})

router.get("/search/", async(req,res) => {
    try{
        let query = req.query.query;
        let allMatchedMeetings = await meetingsOperations.getMeetingsByRegex(`.*${query}.*`);
        for(let word of query.split(" ")){
            let matchedMeetings =  await meetingsOperations.getMeetingsByRegex(`.*${word}.*`);
            allMatchedMeetings.push(...matchedMeetings);
        }
        for(let i = 0; i < allMatchedMeetings.length; i++){
            for(let j = i+1;j < allMatchedMeetings.length; j++){
                if(allMatchedMeetings[i]._id.toString() == allMatchedMeetings[j]._id.toString()){
                    allMatchedMeetings.splice(j,1);
                }
            }
        }
        res.render("search-results",{meetings:allMatchedMeetings}); 
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});
    
module.exports = router;
