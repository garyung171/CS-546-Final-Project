const express = require("express");

const routeExtender = app => {
    app.get("/",(req,res)=>{
        res.render('index',{title:"Testing"});
    });
    app.use("*",function(req,res){
        res.sendStatus(404);
    });
}

module.exports = routeExtender;
