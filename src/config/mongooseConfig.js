// Importing necessary modules 
import mongoose from "mongoose";
import dotenv from "dotenv";

// Dotenv configuration
dotenv.config();

// Database url
const url=process.env.DB_URL;

// Function for handling database connectivity
const connectToDB=async()=>{
    try {
        // Establishing connection
        await mongoose.connect(`${url}/Habit_Tracker_DB`);
        console.log("MongoDb is connected using mongoose");
    } catch (error) {
        // Consoling error if any
        console.log(error);
    }
}

// Export statement
export default connectToDB;