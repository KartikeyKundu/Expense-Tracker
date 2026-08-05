import mongoose from "mongoose";


export default async function connectDB(){
    if (mongoose.connection.readyState === 1) return;

    if (!process.env.CONN_STRING){
        throw new Error("No connection string was given");
    }

    try{
        await mongoose.connect(process.env.CONN_STRING);
        console.log("Successfully connnected to the databse...");
    }
    catch (err){
        console.log("Issues connecting with the database ", err);
        throw err;
    }
}
