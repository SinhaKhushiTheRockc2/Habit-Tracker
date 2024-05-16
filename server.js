// Importing necessary modules
import express from "express";
import path from 'path';
import dotenv from "dotenv";
import ejsLayouts from "express-ejs-layouts";

// Import statements for internal modules
import connectToDB from "./src/config/mongooseConfig.js";
import habitRouter from "./src/features/routes/habit.routes.js";


// Express server creation
const server=express();


// dotenv configuration
dotenv.config();

// server.use(express.json());
// Parse form data
server.use(express.urlencoded({ extended: true }));

// setup view engine settings
server.use(ejsLayouts);
server.set('view engine', 'ejs');
server.set("views", path.join(path.resolve(),"src","features", "views"));

// Path configuration
server.use('/',habitRouter);
// Specifying port
server.listen(process.env.PORT,()=>{
    console.log("Server is listening on "+process.env.PORT);
    connectToDB();
})