const usersCollection = require("./mongodbAPI/getCollections").users
const meetingsCollection = require("./mongodbAPI/getCollections").meetups;
const userOperations = require("./mongodbAPI/userOperations.js");
const meetingsOperations = require("./mongodbAPI/meetingsOperations.js");
const connection = require("./mongodbAPI/establishConnection.js");
const bcrypt = require("bcrypt");
const saltRounds = 8
async function main(){
    try{
        let users = await usersCollection();
        let meetups = await meetingsCollection();
        await users.deleteMany({});
        await meetups.deleteMany({});  
        let password1 = await bcrypt.hash("blah1",saltRounds);
        let password2 = await bcrypt.hash("blah2",saltRounds);
        await userOperations.createUser("masterdetective123", password1, "Hoboken", "blah@blah.com");
        await userOperations.updatePreferences("masterdetective123", ["Smite", "DotA 2", "Risk of Rain 2"]);
        let detective = await userOperations.getUserByUsername("masterdetective123");
        await userOperations.createUser("lemon", password2, "Hoboken", "blah@blah.com");
        await userOperations.updatePreferences("lemon", ["Smite", "Dungeons and Dragons"]);
        let lemon = await userOperations.getUserByUsername("lemon");
        let meeting1 = await meetingsOperations.createMeeting("Smite1", detective._id, new Date(), "Hoboken", ["Smite"]);
        await meetingsOperations.createMeeting("Dota1", detective._id, new Date(), "Hoboken", ["DotA2"]);
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
