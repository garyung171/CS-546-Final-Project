const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const path = require("path");
const saltRounds = 16;
const userOperations = require("../mongodbAPI/userOperations");

let checkLoginValidity = async function(username,password){
    if(!username || !password){
        return false;
    }
    let user = await userOperations.getUserByUsername(username);
    if(!user["empty"]){
        let validPassword = await bcrypt.compare(password,user["password"]);
        return validPassword
    }
    return false;
}

router.get("/",async (req,res)=>{
        try{
            if(req.session.loggedIn){   
                currentUser = await userOperations.getUserBySessionID(req.session.id);
                res.redirect("/profile/"+currentUser["username"],{profileOwner:true});
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
        validLogin = await checkLoginValidity(req.body.username,req.body.password);
        if(validLogin){
            let user = await userOperations.getUserByUsername(req.body.username); 
            await userOperations.addSessionToUser(user,req.session.id);
            req.session.loginError = false;
            res.redirect("/profile/"+currentUser["username"],{profileOwner:true});
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
module.exports = router
