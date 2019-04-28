const MongoClient = require("mongodb").MongoClient;
const settings = require("./settings");
const mongoConfig = settings.mongoConfig;

let establishedConnection = undefined;
let connectedDatabase = undefined;

module.exports = async () =>{
    if(!establishedConnection){
        establishedConnection = await MongoClient.connect(mongoConfig.serverUrl);
        connectedDatabase = await establishedConnection.db(mongoConfig.database);
    }
    return connectedDatabase;
};
