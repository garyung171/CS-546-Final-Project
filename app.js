const express = require("express");
const app = express();
const static = express.static(__dirname + "/public");
const nunjucks = require("express-nunjucks");
const configRoutes = require("./routes");
const session = require("express-session");
const bodyParser = require("body-parser");
const devServer = app.get("env") === "development";

app.use("/public",static);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(session({
    name: "AuthCookie",
    secret: "Hooplah",
    resave: false,
    saveUninitialized: true
}));

app.set("views", __dirname + "/templates");

const njk = nunjucks(app,{
    watch:devServer, 
    noCache:devServer
});

var routeLogger = function(req,res,next){
    let requestDateTime = new Date().toUTCString();
    let method = req.method;
    let url = req.originalUrl;
    let authenticationStatus = (req.session.loggedIn) ? "(Autheticated User)":"(Non-Authenticated User)";
    console.log(`[${requestDateTime}]: ${method} ${url} ${authenticationStatus}`);
    next();
}

let authenticationMiddleware = function(req,res,next){
    if((req.originalUrl != "/" && req.originalUrl != "/login" && req.originalUrl != "/signup") && !req.session.loggedIn){
        res.redirect("/");
    }
    else{
        next();
    }
}

app.use(routeLogger);

app.use(authenticationMiddleware);

configRoutes(app);

app.listen(3000, ()=>{
    console.log("Running on http://localhost:3000");
});
