const mongoose=require("mongoose")
async function db(){
try {
    mongoose.set('strictQuery',false);
    if (!process.env.MONGO_URL) {
        throw new Error("MONGO_URL is missing from backendnew/.env");
    }
    await mongoose.connect(process.env.MONGO_URL)
    console.log("db is connected")
} catch (error) {
    console.error('db connection error:', error.message)
}
}

module.exports={
    db
}
