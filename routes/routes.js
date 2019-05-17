const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const path = require("path");
const slugify = require("slugify");
const userOperations = require("../mongodbAPI/userOperations");
const saltRounds = 8;

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
        res.redirect("/profile/"+slugify(username));
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

router.get("/profile/:username", async(req, res) => {
    try{
        let currentUser = await userOperations.getUserByUsername(req.params.username);
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
            loggedIn:req.session.loggedIn
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
            res.send("Please enter a vlid username");
        }else{
            let currentUser = await userOperations.getUserBySessionID(req.session.id);
            let newName = req.body.newName;
            const usernameInDatabase = await userOpertaions.getUserByUsername(currentUser.username)["empty"] == false;
            const profileAddressInDatabase = await userOpertaions.getUserByProfileAddress(slugify(currentUser.username))["empty"] == false;
            if(usernameInDatabase||profileAddressInDatabase){
                res.send("Username is taken.");
            }
            let update = await userOperations.updateUsername(currentUser.username, newName);
            if(update){
                // Where are we directing after this?
            }
        }
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

router.post("/updatePassword", async(req, res) =>{
    try{
        if(req.body.newPassword == ""){
            res.send("Please enter a valid password.");
        }else{
            let currentUser = await userOperations.getUserBySessionID(req.session.id);
            let newPassword = await bcrypt.hash(req.body.newPassword, saltRounds);
            let update = await userOperations.updatePassword(currentUser.username, newPassword);
            if(update){
                // Where are we directing after this?
            }
        }
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

router.post("/updateLocation", async(req, res) =>{
    try{
        if(req.body.newLocation == ""){
            res.send("Please enter a valid location.");
        }else{
            let currentUser = await userOperations.getUserBySessionID(req.session.id);
            let newLocation = req.body.newLocation;
            let update = await userOperations.updateLocation(currentUser.username, newLocation);
            if(update){
                // Where are we directing after this?
            }
        }
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

router.post("/updateEmail", async(req,res) => {
    try{
        if(req.body.newEmail == ""){
            res.send("Please enter a valid email.");
        }else{
            let currentUser = await userOperations.getUserBySessionID(req.session.id);
            let newEmail = req.body.newEmail;
            let update = await userOperations.updateEmail(currentUser.username, newEmail);
            if(update){
                // Where are we directing after this?
            }
        }
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

router.post("/updatePreferences", async (req, res) => {
    try{
        if(req.body.preferences == ""){
            res.send("Please select some preferences");
        }else{
            let currentUser = await userOperations.getUserBySessionID(req.session.id);
            let preferences = req.body.preferences;
            let update = await userOperations.updatePreferences(currentUser.username, preferences);
            if(update){
                // Ajax
            }
        }
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
})

module.exports = router;
