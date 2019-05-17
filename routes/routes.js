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
                loginError:(req.session.loginError) ? true : false
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
        let validLogin = await checkLoginValidity(req.body.username,req.body.password);
        if(validLogin){
            let currentUser = await userOperations.getUserByUsername(req.body.username);
            await userOperations.addSessionToUser(currentUser,req.session.id);
            req.session.loginError = false;
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
        let username = req.body.username;
        let password = await bcrypt.hash(req.body.password, saltRounds);
        let location = req.body.location;
        let email = req.body.email;
        let successfulCreation = await userOperations.createUser(username,password,location,email);
        if(!successfulCreation){
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
            profileAddress:currentUser["profileAddress"]
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
            await userOperations.updateSessions(currentUser.username, sessions);
            req.session.destroy();
            res.redirect("/");
            return;
        }catch(e){
            console.log(e);
            res.sendStatus(500);
        }
    }
});

router.get("/edit-profile/:profileAddress", async (req, res) => {
    try{
        let currentUser = await userOperations.getUserBySessionID(req.session.id);
        if (currentUser.profileAddress != profileAddress) {
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

router.post("/updatePage", async(req, res) => {
    try{
        let currentUser = await userOperations.getUserBySessionID(req.session.id);
        let newLocation = req.body.newLocation;
        let newUserName = req.body.newUserName;
        let newPassword = req.body.newPassword;
        // how to update the preferences? allow to change all?
        //same with how to update all the fields
    }catch(e){
        cosole.log(e);
        res.sendStatus(500);
    }
});

module.exports = router;
