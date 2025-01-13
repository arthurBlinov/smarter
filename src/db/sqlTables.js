import * as SQLite from "expo-sqlite";

let db;

export const initializeDatabase = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync("ExpensesDb"); 
  }

  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS Expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        expense REAL,
        note TEXT,
        date TEXT
      );
    `);
  } catch (error) {
    console.error("Error creating Expenses table:", error);
    throw error;
  }
};
export const removeExpensesTable = async () => {
  const database = getDatabase(); 
  try {
    await database.execAsync("DROP TABLE IF EXISTS Expenses;");
    console.log("Expenses table removed successfully.");
  } catch (error) {
    console.error("Error removing Expenses table:", error);
    throw error;
  }
};
export const getDatabase = () => {
  if (!db) {
    throw new Error("Database is not initialized. Call initializeDatabase() first.");
  }
  return db;
};




