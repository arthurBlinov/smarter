const DB_NAME = "ExpensesDB";
const DB_VERSION = 1;
const STORE_NAME = "Expenses";

let db;

export const initializeDatabase = async () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    };

    request.onerror = (event) => {
      reject("Error opening database: " + event.target.error);
    };
  });
};

export const getDatabase = () => {
  if (!db) {
    throw new Error("Database is not initialized. Call initializeDatabase() first.");
  }
  return db;
};

export const removeExpensesTable = async () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DB_NAME);
    request.onsuccess = () => resolve("Database deleted successfully.");
    request.onerror = (event) => reject("Error deleting database: " + event.target.error);
  });
};

// Helper function to execute IndexedDB transactions
const executeTransaction = (mode, callback) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, mode);
    const store = transaction.objectStore(STORE_NAME);
    callback(store, resolve, reject);
    transaction.onerror = (event) => reject("Transaction error: " + event.target.error);
  });
};

export const fetchExpenses = async (date, page, limit) => {
  return executeTransaction("readonly", (store, resolve) => {
    const request = store.getAll();
    request.onsuccess = () => {
      const filtered = request.result.filter((item) => item.date === date);
      resolve(filtered.slice((page - 1) * limit, page * limit));
    };
  });
};

export const fetchMonthWithoutPag = async (month, year) => {
  return executeTransaction("readonly", (store, resolve) => {
    const request = store.getAll();
    request.onsuccess = () => {
      const filtered = request.result.filter(
        (item) =>
          item.date.startsWith(`${year}-${month.toString().padStart(2, "0")}`)
      );
      resolve(filtered);
    };
  });
};

export const fetchMonthlyExpenses = async (month, year, page, limit) => {
  return executeTransaction("readonly", (store, resolve) => {
    const request = store.getAll();
    request.onsuccess = () => {
      const filtered = request.result
        .filter((item) =>
          item.date.startsWith(`${year}-${month.toString().padStart(2, "0")}`)
        )
        .slice((page - 1) * limit, page * limit);
      resolve(filtered);
    };
  });
};

export const addExpense = async (expense, note, date) => {
  return executeTransaction("readwrite", (store, resolve) => {
    const request = store.add({ expense, note, date });
    request.onsuccess = () => resolve();
  });
};

export const updateExpense = async (id, updatedExpense, updatedNote) => {
  return executeTransaction("readwrite", (store, resolve) => {
    const request = store.get(id);
    request.onsuccess = () => {
      const expense = request.result;
      if (!expense) return resolve("Expense not found");

      expense.expense = updatedExpense;
      expense.note = updatedNote;
      store.put(expense);
      resolve();
    };
  });
};

export const deleteExpense = async (id) => {
  return executeTransaction("readwrite", (store, resolve) => {
    store.delete(id);
    resolve();
  });
};

export const deleteMonthExpenses = async (month, year) => {
  return executeTransaction("readwrite", (store, resolve) => {
    const request = store.getAll();
    request.onsuccess = () => {
      const filtered = request.result.filter(
        (item) =>
          item.date.startsWith(`${year}-${month.toString().padStart(2, "0")}`)
      );
      filtered.forEach((item) => store.delete(item.id));
      resolve();
    };
  });
};

export const deleteDayExpenses = async (month, year, day) => {
  return executeTransaction("readwrite", (store, resolve) => {
    const request = store.getAll();
    request.onsuccess = () => {
      const filtered = request.result.filter(
        (item) =>
          item.date.startsWith(
            `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`
          )
      );
      filtered.forEach((item) => store.delete(item.id));
      resolve();
    };
  });
};

export const clearExpensesTable = async () => {
  return executeTransaction("readwrite", (store, resolve) => {
    store.clear();
    resolve();
  });
};

// import { getDatabase } from "./sqlTables";

// export const fetchExpenses = async (date, page, limit) => {
//   try {
//     const db = getDatabase();
//     const offset = (page - 1) * limit;
//     return await db.getAllAsync(
//       `
//       SELECT * FROM Expenses 
//       WHERE date = ? 
//       ORDER BY id ASC
//       LIMIT ? OFFSET ?;
//       `,
//       [date, limit, offset]
//     );
//   } catch (error) {
//     throw new Error('משהו השתבש');
//   }
// };


// export const fetchMonthWithoutPag = async (month, year) => {
//   try {
//     const db = getDatabase();
//     return await db.getAllAsync(
//       `
//       SELECT * FROM Expenses 
//       WHERE strftime('%m', date) = ? 
//         AND strftime('%Y', date) = ?;
//       `,
//       [month.toString().padStart(2, "0"), year.toString()]
//     );
//   } catch (error) {
//     throw new Error('משהו השתבש');
//   }
// };

// export const fetchMonthlyExpenses = async (month, year, page, limit) => {
//   try {
//     const db = getDatabase();
//     const offset = (page - 1) * limit;
//     return await db.getAllAsync(
//       `
//       SELECT * FROM Expenses 
//       WHERE strftime('%m', date) = ? 
//         AND strftime('%Y', date) = ? 
//       ORDER BY date ASC
//       LIMIT ? OFFSET ?;
//       `,
//       [month.toString().padStart(2, "0"), year.toString(), limit, offset]
//     );
//   } catch (error) {
//     throw new Error('משהו השתבש');
//   }
// };

// export const addExpense = async (expense, note, date) => {
//   try {
//     const db = getDatabase();
//     return await db.runAsync(
//       "INSERT INTO Expenses (expense, note, date) VALUES (?, ?, ?);",
//       expense,
//       note,
//       date
//     );
//   } catch (error) {
//     throw new Error('משהו השתבש');
//   }
// };

// export const updateExpense = async (id, updatedExpense, updatedNote) => {
//   try {
//     const db = getDatabase();
//     return await db.runAsync(
//       "UPDATE Expenses SET expense = ?, note = ? WHERE id = ?;",
//       updatedExpense,
//       updatedNote,
//       id
//     );
//   } catch (error) {
//     throw new Error('משהו השתבש');
//   }
// };

// export const deleteExpense = async (id) => {
//   try {
//     const db = getDatabase();
//     return await db.runAsync("DELETE FROM Expenses WHERE id = ?;", id);
//   } catch (error) {
//     throw new Error('משהו השתבש');
//   }
// };
// export const deleteMonthExpenses = async (month, year) => {
//   try {
//     const db = getDatabase();
//     await db.runAsync(
//       `
//       DELETE FROM Expenses 
//       WHERE strftime('%m', date) = ? 
//         AND strftime('%Y', date) = ?;
//       `,
//       [month.toString().padStart(2, "0"), year.toString()]
//     );
//   } catch (error) {
//     throw new Error('משהו השתבש');
//   }
// };
// export const clearExpensesTable = async () => {
//   try {
//     const db = getDatabase();
//     await db.runAsync("DELETE FROM Expenses;");
//   } catch (error) {
//     throw new Error('משהו השתבש');
//   }
// };