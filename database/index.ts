import { Expectation, Note } from "@/Types/index.types";
import { optionsUtils } from "@/utils";
import * as SQLite from "expo-sqlite";
import moment from "moment";

async function migrateDbIfNeeded(db: SQLite.SQLiteDatabase) {
  await db.execAsync(`
        CREATE TABLE IF NOT EXISTS expectations (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL ,title TEXT NOT NULL, options TEXT,created_at INTEGER,expected_at INTEGER,result TEXT,isDisappointed BOOLEAN,resultPercentage INTEGER,archived BOOLEAN default 0);
        CREATE TABLE IF NOT EXISTS secretNotes (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL ,category TEXT NOT NULL, notes TEXT, isDone BOOLEAN default 0, createdAt INTEGER, updatedAt INTEGER);
        `);

  // Add columns if they don't exist (for existing databases)
  try {
    const tableInfo = await db.getAllAsync("PRAGMA table_info(secretNotes)");
    const columns = tableInfo.map((column: any) => column.name);

    if (!columns.includes("isDone")) {
      await db.execAsync(
        "ALTER TABLE secretNotes ADD COLUMN isDone BOOLEAN default 0"
      );
    }

    if (!columns.includes("createdAt")) {
      await db.execAsync(
        "ALTER TABLE secretNotes ADD COLUMN createdAt INTEGER"
      );
    }

    if (!columns.includes("updatedAt")) {
      await db.execAsync(
        "ALTER TABLE secretNotes ADD COLUMN updatedAt INTEGER"
      );
    }
  } catch (error) {
    console.log("Migration error:", error);
  }
}

async function getAllExpectations(db: SQLite.SQLiteDatabase) {
  const data = await db.getAllAsync(`SELECT * FROM expectations`);
  return data as Expectation[];
}

async function cleartables(db: SQLite.SQLiteDatabase) {
  await db.execAsync(`DROP TABLE IF EXISTS expectations`);
}

async function getExpectationWithTitle(
  db: SQLite.SQLiteDatabase,
  title: string
) {
  const firstRow = await db.getFirstAsync(
    "SELECT * FROM expectations WHERE title=?",
    title
  );
  console.log(firstRow);
}

async function getExpectationWithId(db: SQLite.SQLiteDatabase, id: number) {
  const firstRow = await db.getFirstAsync(
    "SELECT * FROM expectations WHERE id=?",
    id
  );
  return firstRow;
}

async function addNewExpectation(
  db: SQLite.SQLiteDatabase,
  expectation: Expectation
) {
  const result = await db.runAsync(
    "INSERT INTO expectations (title,options,created_at,expected_at) VALUES (?, ?, ?, ?)",
    expectation.title,
    expectation.options,
    expectation.created_at,
    expectation.expected_at
  );
}
async function getExpectationsForADay(
  db: SQLite.SQLiteDatabase,
  date: Date
): Promise<Expectation[]> {
  try {
    const startOfDay = moment(date).startOf("day").unix() * 1000;
    const endOfDay = moment(date).endOf("day").unix() * 1000;

    const expectations = await db.getAllAsync(
      "SELECT * FROM expectations WHERE expected_at >= ? AND expected_at <= ?",
      [startOfDay, endOfDay]
    );
    return expectations as Expectation[];
  } catch (error) {
    console.error("Database error:", error);
    return [];
  }
}

async function updateExpectation(
  db: SQLite.SQLiteDatabase,
  expectation: Expectation,
  result: string
) {
  const isDisappointed = !optionsUtils
    .split(expectation.options)
    .includes(result);
  const resultPercentage = isDisappointed
    ? 0
    : 1 / optionsUtils.split(expectation.options).length;

  await db.runAsync(
    `
    UPDATE expectations
    SET 
      isDisappointed = ?,
      result = ?,
      resultPercentage = ?
    WHERE 
      id = ?
    `,
    isDisappointed,
    result,
    resultPercentage,
    expectation.id
  );
}
async function archiveExpectation(
  db: SQLite.SQLiteDatabase,
  expectation: Expectation,
  archived: boolean
) {
  await db.runAsync(
    `
    UPDATE expectations
    SET 
      archived = ?
    WHERE 
      id = ?
    `,
    archived,
    expectation.id
  );
}

async function importData(db: SQLite.SQLiteDatabase, data: Expectation[]) {
  try {
    // Start a transaction for bulk insert
    await db.withTransactionAsync(async () => {
      for (const expectation of data) {
        await db.runAsync(
          `INSERT INTO expectations (
            title,
            options,
            created_at,
            expected_at,
            result,
            isDisappointed,
            resultPercentage,
            archived
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            expectation.title,
            expectation.options,
            expectation.created_at,
            expectation.expected_at,
            expectation.result || null,
            expectation.isDisappointed || false,
            expectation.resultPercentage || null,
            expectation.archived || false,
          ]
        );
      }
    });
    return true;
  } catch (error) {
    console.error("Import error:", error);
    throw error;
  }
}

const getSecretNotes = async (db: SQLite.SQLiteDatabase) => {
  const data = await db.getAllAsync(`SELECT * FROM secretNotes`);
  return data as Note[];
};

const addNewNote = async (
  db: SQLite.SQLiteDatabase,
  note: Omit<Note, "id">
) => {
  const now = Date.now();
  const result = await db.runAsync(
    "INSERT INTO secretNotes (category, notes, createdAt, updatedAt) VALUES (?, ?, ?, ?)",
    note.category,
    note.notes,
    now,
    now
  );
};

const deleteNote = async (db: SQLite.SQLiteDatabase, id: number) => {
  const result = await db.runAsync("DELETE FROM secretNotes WHERE id = ?", id);
};

const markNoteAsDone = async (
  db: SQLite.SQLiteDatabase,
  id: number,
  isDone: boolean
) => {
  const now = Date.now();
  const result = await db.runAsync(
    "UPDATE secretNotes SET isDone = ?, updatedAt = ? WHERE id = ?",
    isDone,
    now,
    id
  );
};

const dbUtils = {
  getAllExpectations,
  getExpectationWithTitle,
  getExpectationsForADay,
  updateExpectation,
  getExpectationWithId,
  addNewExpectation,
  cleartables,
  archiveExpectation,
  importData,
  getSecretNotes,
  addNewNote,
  deleteNote,
  markNoteAsDone,
};

export { migrateDbIfNeeded, dbUtils };
