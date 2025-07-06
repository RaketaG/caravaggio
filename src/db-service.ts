import { enablePromise, openDatabase, SQLiteDatabase } from 'react-native-sqlite-storage';

enablePromise(true);

export type CardType = {
  id: string;
  word: string;
  description: string
};

export const getDbConnection = async () => {
    return openDatabase({
        name: 'caravaggio-data.db',
        location: 'default'
    });
};

export const listTables = async (db: SQLiteDatabase) => {
  return await db.executeSql(`SELECT name FROM sqlite_master WHERE type='table';`);
};

export const createTable = async (db: SQLiteDatabase, tableName: string) => {
  await db.executeSql(
    `CREATE TABLE IF NOT EXISTS ${tableName}` +
    `(id TEXT PRIMARY KEY, word TEXT, description TEXT);`
  );
};

export const dropTable = async (db: SQLiteDatabase, tableName: string) => {
  await db.executeSql(
    `DROP TABLE IF EXISTS ${tableName};`
  );
};

export const listRecords = async (db: SQLiteDatabase, tableName: string) => {
  return (await db.executeSql(`SELECT * FROM ${tableName};`))[0];
};

export const insertRecord = async (
  db: SQLiteDatabase,
  tableName: string,
  id: string,
  word: string,
  description: string,
) => {
  await db.executeSql(
    `INSERT INTO ${tableName} (id, word, description) ` +
    `VALUES ('${id}', '${word}', '${description}');`
  );
};

export const updateRecord = async (
  db: SQLiteDatabase,
  tableName: string,
  id: string,
  word: string,
  description: string,
) => {
  await db.executeSql(
    `UPDATE ${tableName} ` +
    `SET word = '${word}', description = '${description}' ` +
    `WHERE id = '${id}';`
  );
};

export const deleteRecord = async (db: SQLiteDatabase, tableName: string, id: string) => {
  await db.executeSql(`DELETE FROM ${tableName} WHERE id = '${id}';`)
};