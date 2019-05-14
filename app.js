const express = require("express");
const app = express();
const nunjucks = require("express-nunjucks");
const configRoutes = require("./routes");
const session = require("express-session");
const bodyParser = require("body-parser");
const devServer = app.get("env") === "development";

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

configRoutes(app);

app.listen(3000, ()=>{
    console.log("Running on http://localhost:3000");
});
