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
    let user = await userOperations.getUserByUsername(req.body.username);
    if(!user["empty"]){
        let validPassword = await bcrypt.compare(req.body.password,user["password"]);
        return validPassword
    }
    return false;
}

router.get("/",(req,res)=>{
        try{
            if(req.session.loggedIn){   
                currentUser = userOperations.getUserBySessionID(req.session.id);
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
        validLogin = checkLoginValidity(req.session.username,req.session.password);
        if(validLogin){
            let user = await userOperations.getUserByUsername(req.session.username); 
            await userOperations.addSessionToUser(user["_id"],req.session.id);
            req.session.loginError = false;
            res.redirect("/profile/"+currentUser["username"],{profileOwner:true});
            return;
        }
        else{
            req.session.loginError = true;
            res.redirect(401,"/");
            return;
        }
    }
    catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});
module.exports = router
