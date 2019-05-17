const meetingsCollection = require("./getCollections").meetings
const connection = require("./establishConnection");
const ObjectID = require("mongodb").ObjectID;
const slugify = require("slugify");

