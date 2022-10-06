import sqlite3 from "sqlite3";
import { promisify } from "util";

export class DataStore {
    private db: sqlite3.Database

    constructor() {
        this.db = new sqlite3.Database('test.db')
        this.db.exec(
            `CREATE TABLE IF NOT EXISTS data (
                user_id PRIMARY KEY,
                data BLOB
            );`,
            (err) => {
                if (err) {
                    throw err;
                }
            });
    }

    // TODO Figure out promisify with typescript
    get(user_id: string): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            this.db.get(`SELECT data FROM data WHERE user_id = ?`, [user_id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row ? row.data : null);
                }
            });
        });
    }

    put(user_id: string, data: Buffer): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(`INSERT OR REPLACE INTO data (user_id, data) VALUES (?, ?)`, [user_id, data], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}