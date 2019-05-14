const express = require("express");
const routes = require("./routes");
const routeExtender = app => {
    app.use("/",routes);
    app.use("*",function(req,res){
        res.sendStatus(404);
    });
}

module.exports = routeExtender;
