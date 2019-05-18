const userOperations = require("./mongodbAPI/userOperations.js");
const meetingsOperations = require("./mongodbAPI/meetingsOperations.js");
const connection = require("./mongodbAPI/establishConnection.js");

async function main(){
    try{
        let detective = await userOperations.createUser("masterdetective123", "blah", "Hoboken", "blah@blah.com");
        let lemon = await userOperations.createUser("lemon", "blah", "Hoboken", "blah@blah.com");
        await meetingsOperations.createMeeting("Smite1", detective._id, new Date(), "Hoboken", ["Smite"]);
        await meetingsOperations.createMeeting("Dota1", detective._id, new Date(), "Hoboken", ["Dota"]);
        await meetingsOperations.createMeeting("Mixed", detective._id, new Date(), "Hoboken", ["Smite", "Dota"]);
        await meetingsOperations.createMeeting("Far", detective._id, new Date(), "New York", ["Smite"]);
        await meetingsOperations.createMeeting("Lonely", lemon._id, new Date(), "Hoboken", ["Smite"]);

    }catch(e){
        console.log(e);
    }
    const db = await connection();
    await db.serverConfig.close();

}

main();