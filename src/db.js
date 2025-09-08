import { openDB } from "idb";

export const dbPromise = openDB("habit-tracker", 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("habits")) {
      db.createObjectStore("habits", { keyPath: "id", autoIncrement: true });
    }
    if (!db.objectStoreNames.contains("history")) {
      db.createObjectStore("history", { keyPath: "date" });
    }
  },
});

export const habitDB = {
  async getHabits() {
    return (await dbPromise).getAll("habits");
  },
  async addHabit(habit) {
    return (await dbPromise).add("habits", habit);
  },
  async updateHabit(habit) {
    return (await dbPromise).put("habits", habit);
  },
  async deleteHabit(id) {
    return (await dbPromise).delete("habits", id);
  },
};
