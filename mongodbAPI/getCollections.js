const dbConnection = require("./establishConnection");

const getCollectionFn = collection => {
    let requestedCollection = undefined;
    return async () =>{
        if(!requestedCollection){
            const db = await dbConnection();
            requestedCollection = await db.collection(collection);
        }
        return requestedCollection;
    };
};

module.exports = {
    users : getCollectionFn("users"),
    meetups : getCollectionFn("meetups")
}
