// Import statement for necessary modules
import HabitModel from "../model/habit.schema.js";

//getting 7 days
function getDate(n) {
  let date = new Date();
  date.setDate(date.getDate() + n);
  var newDate = date.toLocaleDateString('pt-br').split('/').reverse().join('-');
  var day;
  switch (date.getDay()) {
      case 0: day = 'Sun';
          break;
      case 1: day = 'Mon';
          break;
      case 2: day = 'Tue';
          break;
      case 3: day = 'Wed';
          break;
      case 4: day = 'Thu';
          break;
      case 5: day = 'Fri';
          break;
      case 6: day = 'Sat';
          break;
  }
  return { date: newDate, day };
}


export default class HabitController{

//retrieving a habit from database
async getHabit(req,res){
  await HabitModel.find().select('-updatedAt -createdAt -__v').sort({ _id: -1 })
  .then(habits => {
      var days = [];
      days.push(getDate(0));
      days.push(getDate(1));
      days.push(getDate(2));
      days.push(getDate(3));
      days.push(getDate(4));
      days.push(getDate(5));
      days.push(getDate(6));
      res.render('home', { habit: habits, days });
  })
  .catch(err => {
      console.log(err);
  });
}
//appending habit form
async getForm(req,res){
  res.render('create-habit-form');
}

//appending a habit
async  addHabit(req,res){
  console.log(req.body);
  const { name } = req.body;
  console.log(name)
  await HabitModel.findOne({ name:name }).then(habit => {
      if (habit) {
          // Update Existing Habit Status
          let dates = habit.statuses, timezoneOffSet = (new Date()).getTimezoneOffset() * 60000;
          var today = (new Date(Date.now() - timezoneOffSet)).toISOString().slice(0, 10);
          dates.find(function (item, index) {
              if (item.date === today) {
                  console.log("Habit Already inserted in Database")
                  
                  res.redirect('/');
              }
              else {
                  statuses.push({ date: today, status: 'none' });
                  habit.statuses = dates;
                  habit.save()
                      .then(habit => {
                          console.log(habit);
                          res.redirect('/');
                      })
                      .catch(err => console.log(err));
              }
          });
      }
      else {
          let statuses = [], timezoneOffSet = (new Date()).getTimezoneOffset() * 60000;
          var localISOTime = (new Date(Date.now() - timezoneOffSet)).toISOString().slice(0, 10);
          statuses.push({ date: localISOTime, status: 'none' });
          const newHabit = new HabitModel({
             name,
              statuses
          });

         
           newHabit
              .save()
              .then(habit => {
                  console.log(habit);
                  res.redirect('/');
              })
              .catch(err => console.log(err));
      }
       
  })

}
  

//toggling status of the habit(done, not done, default)
async  toggleHabit(req,res){
  try {
      var d = req.query.date;
      var id = req.query.id;
      
      console.log("Date:", d);
      console.log("ID:", id);

      const habit = await HabitModel.findById(id);
      if (!habit) {
          throw new Error("Habit not found");
      }

      let statuses = habit.statuses;
      let found = false;

      statuses.find(function(item, index) {
          if (item.date === d) {
              if (item.status === 'none') {
                  item.status = 'done';
              } else if (item.status === 'not-done') {
                  item.status = 'none';
              } else if (item.status === 'done') {
                  item.status = 'not-done';
              }
              found = true;
          }
      });

      if (!found) {
          statuses.push({ date: d, status: 'done' });
      }

      habit.statuses = statuses;
      const updatedHabit = await habit.save();
      console.log("Updated Habit:", updatedHabit);

      res.redirect('/');
  } catch (err) {
      console.error("Error toggling habit:", err.message);
      res.status(500).send("Error updating habit status");
  }
}

//deleting a habit
async deleteHabit(req,res){
  const documentProduct = await HabitModel.findByIdAndDelete({ _id: req.params.id });
  if (!documentProduct) {
      res.status(500).json(err);
  } res.redirect('/')
}
 
}