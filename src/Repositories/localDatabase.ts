import * as SQLite from 'expo-sqlite';
import { Book } from '../Models/Book';
import { DATABASE_NAME } from '../Library/generalConstants';
import * as FileSystem from 'expo-file-system';

export class LocalDatabase {
    private db: SQLite.SQLiteDatabase | null = null;

    public constructor() {
        this.InitializeDatabase();
    }

    // Get all books
    public async GetAll(): Promise<Book[]> {
        const db = await this.GetDatabaseConnection();
        const rows = await db.getAllAsync('SELECT * FROM books;');
        return rows.map((row: any): Book => ({
            id: row.id,
            title: row.title,
            author: row.author,
            genre: row.genre,
            status: row.status,
            reviewCount: row.reviewCount,
            avgRating: row.avgRating
        }));
    }

    // Get a specific book by ID
    public async Get(id: number): Promise<Book | null> {
        const db = await this.GetDatabaseConnection();
        const row: any = await db.getFirstAsync('SELECT * FROM books WHERE id = ?;', id);
        if (!row) return null;

        return {
            id: row.id,
            title: row.title,
            author: row.author,
            genre: row.genre,
            status: row.status,
            reviewCount: row.reviewCount,
            avgRating: row.avgRating
        };
    }

    // Add or update a book
    public async AddOrUpdate(book: Book): Promise<void> {
        const db = await this.GetDatabaseConnection();

        const existingBook: Book | null = await this.Get(book.id);
        if (existingBook) {
            try {
                await db.runAsync(
                    `UPDATE books SET title = ?, author = ?, genre = ?, status = ?, reviewCount = ?, avgRating = ? WHERE id = ?;`,
                    book.title, book.author, book.genre, book.status, book.reviewCount, book.avgRating, book.id
                );
            } catch (error) {
                console.log("Error updating book in database", error);
            }
        } else {
            try {
                await db.runAsync(
                    `INSERT INTO books (id, title, author, genre, status, reviewCount, avgRating) VALUES (?, ?, ?, ?, ?, ?, ?);`,
                    book.id, book.title, book.author, book.genre, book.status, book.reviewCount, book.avgRating
                );
            } catch (error) {
                console.log("Error adding book to database", error);
            }
        }
    }

    // Delete a book by ID
    public async Delete(id: number): Promise<void> {
        const db = await this.GetDatabaseConnection();
        try {
            await db.runAsync('DELETE FROM books WHERE id = ?;', id);
            console.log(`Book with id ${id} deleted.`);
        } catch (error) {
            console.log("Error deleting book from database", error);
        }
    }

    // Initialize database (create table for books)
    private async InitializeDatabase(): Promise<void> {
        const db = await this.GetDatabaseConnection();
        await db.execAsync(
            `PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS books (
                id INTEGER PRIMARY KEY NOT NULL,
                title TEXT NOT NULL,
                author TEXT NOT NULL,
                genre TEXT NOT NULL,
                status TEXT NOT NULL,
                reviewCount INTEGER NOT NULL,
                avgRating REAL NOT NULL
            );`
        );
        console.log('Database initialized: books table created.');
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
    }
}
