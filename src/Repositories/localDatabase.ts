import * as SQLite from 'expo-sqlite';
import { Transaction } from '../Models/Transaction';
import { DATABASE_NAME } from '../Library/generalConstants';
import * as FileSystem from 'expo-file-system';

export class LocalDatabase {
    private db: SQLite.SQLiteDatabase | null = null;

    public constructor() {
        this.InitializeDatabase();
    }

    // Get all transactions
    public async GetAll(): Promise<Transaction[]> {
        const db = await this.GetDatabaseConnection();
        const rows = await db.getAllAsync('SELECT * FROM transactions;');
        return rows.map((row: any): Transaction => ({
            id: row.id,
            date: row.date,
            amount: row.amount,
            type: row.type,
            category: row.category,
            description: row.description
        }));
    }

    // Get a specific transaction by ID
    public async Get(id: number): Promise<Transaction | null> {
        const db = await this.GetDatabaseConnection();
        const row: any = await db.getFirstAsync('SELECT * FROM transactions WHERE id = ?;', id);
        if (!row) return null;

        return {
            id: row.id,
            date: row.date,
            amount: row.amount,
            type: row.type,
            category: row.category,
            description: row.description
        };
    }

    // Add or update a transaction
    public async AddOrUpdate(transaction: Transaction): Promise<void> {
        const db = await this.GetDatabaseConnection();

        const existingTransaction: Transaction | null = await this.Get(transaction.id);
        if (existingTransaction) {
            try {
                await db.runAsync(`
                    UPDATE transactions
                    SET date = ?, amount = ?, type = ?, category = ?, description = ?
                    WHERE id = ?;
                `, transaction.date, transaction.amount, transaction.type, transaction.category, transaction.description, transaction.id);
            } catch (error) {
                console.log("Error updating transaction in database", error);
            }
        } else {
            try {
                await db.runAsync(`
                    INSERT OR REPLACE INTO transactions (id, date, amount, type, category, description)
                    VALUES (?, ?, ?, ?, ?, ?);
                `, transaction.id, transaction.date, transaction.amount, transaction.type, transaction.category, transaction.description);
            } catch (error) {
                console.log("Error adding transaction to database", error);
            }
        }
    }

    // Delete a transaction by ID
    public async Delete(id: number): Promise<void> {
        const db = await this.GetDatabaseConnection();
        try {
            await db.runAsync('DELETE FROM transactions WHERE id = ?;', id);
            console.log(`Transaction with id ${id} deleted.`);
        } catch (error) {
            console.log("Error deleting transaction from database", error);
        }
    }

    // Initialize database (create table for transactions)
    private async InitializeDatabase(): Promise<void> {
        const db = await this.GetDatabaseConnection();
        await db.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY NOT NULL,
                date TEXT NOT NULL,
                amount REAL NOT NULL,
                type TEXT NOT NULL,
                category TEXT NOT NULL,
                description TEXT NOT NULL
            );
        `);

        console.log('Database initialized: transactions table created.');
    }

    // Get database connection
    private async GetDatabaseConnection(): Promise<SQLite.SQLiteDatabase> {
        if (!this.db) {
            this.db = await SQLite.openDatabaseAsync(DATABASE_NAME);
        }
        return this.db;
    }

    // Reset database (delete the database)
    private async ResetDatabase(): Promise<void> {
        const dbPath = `${FileSystem.documentDirectory}SQLite/${DATABASE_NAME}`;

        try {
            const dbInfo = await FileSystem.getInfoAsync(dbPath);
            if (dbInfo.exists) {
                await FileSystem.deleteAsync(dbPath);
                console.log("Database deleted successfully. Restart the app to recreate it.");
            } else {
                console.log("Database does not exist, nothing to delete.");
            }
        } catch (error) {
            console.log("Error deleting database:", error);
        }
    };
}
