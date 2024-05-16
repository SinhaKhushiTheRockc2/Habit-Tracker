// Import statement for mongoose
import mongoose from "mongoose";

// Schema creation
const HabitSchema = new mongoose.Schema({
    name: { type: String, required: true },
    statuses:[{
        date:String,
        status:String
    }]
  },{timestamps:true});
  
//   Model Creation
const HabitModel=mongoose.model('Habit',HabitSchema);

// Export statement
export default HabitModel;