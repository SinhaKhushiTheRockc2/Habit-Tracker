// Import statements
import express from "express";
import HabitController from "../controller/habit.controller.js";

// Router creation
const habitRouter = express.Router();

// Controller instance creation
const habitInstance=new HabitController();

//retrieving habits from db for home
habitRouter.get('',(req,res)=>{
    habitInstance.getHabit(req,res);
})

//appending habits form
habitRouter.get('/habit-form',(req,res)=>{
    habitInstance.getForm(req,res);
});


//appending habits
habitRouter.post('',(req,res)=>{
    habitInstance.addHabit(req,res);
})

//toggling habits
habitRouter.get('/habitStatus',(req,res)=>{
    habitInstance.toggleHabit(req,res);
})

//deleting habits
habitRouter.get('/:id',(req,res)=>{
    habitInstance.deleteHabit(req,res);
})

export default habitRouter;


