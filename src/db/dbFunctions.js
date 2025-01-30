import { getDatabase } from "./sqlTables";

export const fetchExpenses = async (date, page, limit) => {
  try {
    const db = getDatabase();
    const offset = (page - 1) * limit;
    return await db.getAllAsync(
      `
      SELECT * FROM Expenses 
      WHERE date = ? 
      ORDER BY id ASC
      LIMIT ? OFFSET ?;
      `,
      [date, limit, offset]
    );
  } catch (error) {
    throw new Error('משהו השתבש');
  }
};


export const fetchMonthWithoutPag = async (month, year) => {
  try {
    const db = getDatabase();
    return await db.getAllAsync(
      `
      SELECT * FROM Expenses 
      WHERE strftime('%m', date) = ? 
        AND strftime('%Y', date) = ?;
      `,
      [month.toString().padStart(2, "0"), year.toString()]
    );
  } catch (error) {
    throw new Error('משהו השתבש');
  }
};

export const fetchMonthlyExpenses = async (month, year, page, limit) => {
  try {
    const db = getDatabase();
    const offset = (page - 1) * limit;
    return await db.getAllAsync(
      `
      SELECT * FROM Expenses 
      WHERE strftime('%m', date) = ? 
        AND strftime('%Y', date) = ? 
      ORDER BY date ASC
      LIMIT ? OFFSET ?;
      `,
      [month.toString().padStart(2, "0"), year.toString(), limit, offset]
    );
  } catch (error) {
    throw new Error('משהו השתבש');
  }
};

export const addExpense = async (expense, note, date) => {
  try {
    const db = getDatabase();
    return await db.runAsync(
      "INSERT INTO Expenses (expense, note, date) VALUES (?, ?, ?);",
      expense,
      note,
      date
    );
  } catch (error) {
    throw new Error('משהו השתבש');
  }
};

export const updateExpense = async (id, updatedExpense, updatedNote) => {
  try {
    const db = getDatabase();
    return await db.runAsync(
      "UPDATE Expenses SET expense = ?, note = ? WHERE id = ?;",
      updatedExpense,
      updatedNote,
      id
    );
  } catch (error) {
    throw new Error('משהו השתבש');
  }
};

export const deleteExpense = async (id) => {
  try {
    const db = getDatabase();
    return await db.runAsync("DELETE FROM Expenses WHERE id = ?;", id);
  } catch (error) {
    throw new Error('משהו השתבש');
  }
};
export const deleteMonthExpenses = async (month, year) => {
  try {
    const db = getDatabase();
    await db.runAsync(
      `
      DELETE FROM Expenses 
      WHERE strftime('%m', date) = ? 
        AND strftime('%Y', date) = ?;
      `,
      [month.toString().padStart(2, "0"), year.toString()]
    );
  } catch (error) {
    throw new Error('משהו השתבש');
  }
};
export const clearExpensesTable = async () => {
  try {
    const db = getDatabase();
    await db.runAsync("DELETE FROM Expenses;");
  } catch (error) {
    throw new Error('משהו השתבש');
  }
};