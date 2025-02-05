import axios, { AxiosResponse } from "axios";
import { Sources } from "../Library/Enums/Sources";
import { IP_ADDRESS, PORT } from "../Library/generalConstants";
import { CustomResponse } from "../Models/CustomResponse";
import { Book } from "../Models/Book";
import { LocalDatabase } from "../Repositories/localDatabase";

export class BookService {
    private readonly _baseUrl: string = `http://${IP_ADDRESS}:${PORT}`;
    private localDatabase: LocalDatabase;

    constructor(localDatabase: LocalDatabase) {
        this.localDatabase = localDatabase;
    }

    public async GetAll(): Promise<CustomResponse<Book[]>> {
        try {
            console.log('Fetching all books from network.');
            const response: AxiosResponse<Book[]> = await axios.get(`${this._baseUrl}/books`);

            console.log('Fetch all successfull, updating local db.');
            await Promise.all(response.data.map(async (book) => {
                await this.localDatabase.AddOrUpdate(book);
            }));

            return {
                data: response.data,
                source: Sources.NETWORK
            };
        }
        catch (error) {
            console.log('Network request failed, falling back to local database:', error);
            const localData: Book[] = await this.localDatabase.GetAll();

            if (localData.length === 0) {
                console.log('No books found in local database.');
                throw new Error('No books found in local database.');
            }

            return {
                data: localData,
                source: Sources.LOCAL
            };
        }
    }

    public async Get(id: number): Promise<CustomResponse<Book>> {
        try {
            console.log('Fetching book from network: ', id);
            const response: AxiosResponse<Book> = await axios.get<Book>(`${this._baseUrl}/book/${id}`);
            await this.localDatabase.AddOrUpdate(response.data);
            return {
                data: response.data,
                source: Sources.NETWORK
            }
        }
        catch (error) {
            console.log('Network request failed, falling back to local database:', error);
            const localData: Book | null = await this.localDatabase.Get(id);

            if (!localData) {
                console.log('Book not found in local database.');
                throw new Error('Book not found in local database.');
            }

            return {
                data: localData,
                source: Sources.LOCAL
            }
        }
    }

    public async Create(book: Book): Promise<Book> {
        console.log('Creating book');
        try {
            const response: AxiosResponse<Book> = await axios.post<Book>(`${this._baseUrl}/book`, book);
            this.localDatabase.AddOrUpdate(response.data);
            return response.data;
        }
        catch (error) {
            console.log('Failed to create book: ', error);
            throw new Error('Failed to create book');
        }
    }

    public async Update(book: Book): Promise<Book> {
        console.log('Updating book: ', book.id);
        const response: AxiosResponse<Book> = await axios.put<Book>(`${this._baseUrl}/book/${book.id}`, book);
        return response.data;
    }

    public async Delete(id: number): Promise<void> {
        console.log('Deleting book: ', id);
        try {
            await axios.delete(`${this._baseUrl}/book/${id}`);
            await this.localDatabase.Delete(id);
        }
        catch (error) {
            console.log('Failed to delete book: ', id, error);
        }
    }

    public async GetAllCustomPages(): Promise<CustomResponse<Book[]>> {
        try {
            console.log('Fetching all books from network.');
            const response: AxiosResponse<Book[]> = await axios.get(`${this._baseUrl}/allBooks`);

            console.log('Fetch all successfull, updating local db.');
            await Promise.all(response.data.map(async (book) => {
                await this.localDatabase.AddOrUpdate(book);
            }));

            return {
                data: response.data,
                source: Sources.NETWORK
            };
        }
        catch (error) {
            console.log('Network request failed, falling back to local database:', error);
            const localData: Book[] = await this.localDatabase.GetAll();

            if (localData.length === 0) {
                console.log('No books found in local database.');
                throw new Error('No books found in local database.');
            }

            return {
                data: localData,
                source: Sources.LOCAL
            };
        }
    }
}