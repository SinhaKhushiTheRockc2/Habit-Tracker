import HabitModel from "../model/habit.schema.js";

// Function to get date and day
function getDate(n) {
    let date = new Date();
    date.setDate(date.getDate() + n);
    const newDate = date.toLocaleDateString('pt-br').split('/').reverse().join('-');
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const day = days[date.getDay()];
    return { date: newDate, day };
}

export default class HabitController {

    // Retrieving a habit from database
    async getHabit(req, res) {
        try {
            const habits = await HabitModel.find().select('-updatedAt -createdAt -__v').sort({ _id: -1 });
            const days = Array.from({ length: 7 }, (_, i) => getDate(i));
            res.render('home', { habit: habits, days });
        } catch (err) {
            console.error(err);
            res.status(500).send("Server Error");
        }
    }

    // Appending habit form
    getForm(req, res) {
        res.render('create-habit-form');
    }

    // Appending a habit
    async addHabit(req, res) {
        try {
            const { name } = req.body;
            let habit = await HabitModel.findOne({ name });

            const timezoneOffset = (new Date()).getTimezoneOffset() * 60000;
            const today = new Date(Date.now() - timezoneOffset).toISOString().slice(0, 10);

            if (habit) {
                const existingStatus = habit.statuses.find(item => item.date === today);
                if (existingStatus) {
                    console.log("Habit already inserted in database");
                } else {
                    habit.statuses.push({ date: today, status: 'none' });
                    await habit.save();
                }
            } else {
                habit = new HabitModel({
                    name,
                    statuses: [{ date: today, status: 'none' }]
                });
                await habit.save();
            }
            res.redirect('/');
        } catch (err) {
            console.error(err);
            res.status(500).send("Server Error");
        }
    }

    // Toggling status of the habit (done, not done, default)
    async toggleHabit(req, res) {
        try {
            const { date, id } = req.query;
            const habit = await HabitModel.findById(id);
            if (!habit) throw new Error("Habit not found");

            let status = habit.statuses.find(item => item.date === date);
            if (status) {
                status.status = status.status === 'none' ? 'done' : status.status === 'done' ? 'not-done' : 'none';
            } else {
                habit.statuses.push({ date, status: 'done' });
            }

            await habit.save();
            res.redirect('/');
        } catch (err) {
            console.error("Error toggling habit:", err.message);
            res.status(500).send("Error updating habit status");
        }
    }

    // Deleting a habit
    async deleteHabit(req, res) {
        try {
            const documentProduct = await HabitModel.findByIdAndDelete(req.params.id);
            if (!documentProduct) return res.status(404).send("Habit not found");
            res.redirect('/');
        } catch (err) {
            console.error("Error deleting habit:", err.message);
            res.status(500).send("Error deleting habit");
        }
    }
}
