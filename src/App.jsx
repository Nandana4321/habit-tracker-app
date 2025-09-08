import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function App() {
const [habits, setHabits] = useState([]);
const [newHabit, setNewHabit] = useState("");
const [lastResetDate, setLastResetDate] = useState("");
const [history, setHistory] = useState([]);

// ⚡ Temporary fake data (for testing chart)
useEffect(() => {
  if (history.length === 0) {
    setHistory([
      { date: "Mon", completed: 1 },
      { date: "Tue", completed: 2 },
      { date: "Wed", completed: 3 },
    ]);
  }
}, []);
  // ✅ Notification functions
  const requestNotification = () => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  };

  const sendReminder = () => {
    if (Notification.permission === "granted") {
      new Notification("🔔 Habit Reminder", {
        body: "Don’t forget to check your habits today!",
      });
    }
  };

  // Load saved data
  useEffect(() => {
    const savedHabits = localStorage.getItem("habits");
    const savedDate = localStorage.getItem("lastResetDate");
    const savedHistory = localStorage.getItem("history");

    if (savedHabits) setHabits(JSON.parse(savedHabits));
    if (savedDate) setLastResetDate(savedDate);
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    // Ask for notification permission on first load
    requestNotification();
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
    localStorage.setItem("lastResetDate", lastResetDate);
    localStorage.setItem("history", JSON.stringify(history));
  }, [habits, lastResetDate, history]);

  // Reset daily and log history
  useEffect(() => {
    const today = new Date().toDateString();

    if (lastResetDate !== today) {
      if (lastResetDate) {
        setHistory((prev) => [
          ...prev,
          {
            date: lastResetDate,
            completed: habits.filter((h) => h.doneToday).length,
          },
        ]);
      }
      setHabits((prev) => prev.map((habit) => ({ ...habit, doneToday: false })));
      setLastResetDate(today);
    }
  }, [lastResetDate]);

  // Add habit
  const addHabit = () => {
    if (newHabit.trim() !== "") {
      setHabits([...habits, { name: newHabit, streak: 0, doneToday: false }]);
      setNewHabit("");
    }
  };

  // Mark as done
  const markDone = (index) => {
    setHabits((prev) =>
      prev.map((habit, i) =>
        i === index
          ? { ...habit, streak: habit.streak + 1, doneToday: true }
          : habit
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          🌱 Habit Tracker
        </h1>

        {/* 🔔 Reminder Button */}
        <div className="text-center mb-6">
          <button
            onClick={sendReminder}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
          >
            Send Reminder 🔔
          </button>
        </div>

        {/* Add Habit Input */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="Enter a new habit..."
            className="flex-1 border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={addHabit}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Add
          </button>
        </div>

        {/* Habit List */}
        <ul className="space-y-3 mb-6">
          {habits.map((habit, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow"
            >
              <div>
                <p className="font-semibold">{habit.name}</p>
                <p className="text-sm text-gray-500">
                  🔥 Streak: {habit.streak} days
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => markDone(index)}
                  disabled={habit.doneToday}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    habit.doneToday
                      ? "bg-green-400 text-white cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {habit.doneToday ? "Done ✅" : "Mark Done"}
                </button>

                {/* 🗑️ Delete Habit */}
                <button
                  onClick={() =>
                    setHabits((prev) => prev.filter((_, i) => i !== index))
                  }
                  className="px-3 py-1 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Progress Chart */}
        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3">📊 Progress</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="completed" stroke="#3b82f6" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default App;
