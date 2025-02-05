import axios, { AxiosResponse } from "axios";
import { Sources } from "../Library/Enums/Sources";
import { IP_ADDRESS, PORT } from "../Library/generalConstants";
import { CustomResponse } from "../Models/CustomResponse";
import { Transaction } from "../Models/Transaction";
import { LocalDatabase } from "../Repositories/localDatabase";

export class TransactionService {
    private readonly _baseUrl: string = `http://${IP_ADDRESS}:${PORT}`;
    private localDatabase: LocalDatabase;

    constructor(localDatabase: LocalDatabase) {
        this.localDatabase = localDatabase;
    }

    public async GetAll(): Promise<CustomResponse<Transaction[]>> {
        try {
            console.log('Fetching all transactions from network.');
            const response: AxiosResponse<Transaction[]> = await axios.get(`${this._baseUrl}/transactions`);

            console.log('Fetch all successfull, updating local db.');
            await Promise.all(response.data.map(async (transaction) => {
                await this.localDatabase.AddOrUpdate(transaction);
            }));

            return {
                data: response.data,
                source: Sources.NETWORK
            };
        }
        catch (error) {
            console.log('Network request failed, falling back to local database:', error);
            const localData: Transaction[] = await this.localDatabase.GetAll();

            if (localData.length === 0) {
                console.log('No transactions found in local database.');
                throw new Error('No transactions found in local database.');
            }

            return {
                data: localData,
                source: Sources.LOCAL
            };
        }
    }

    public async Get(id: number): Promise<CustomResponse<Transaction>> {
        try {
            console.log('Fetching transaction from network: ', id);
            const response: AxiosResponse<Transaction> = await axios.get<Transaction>(`${this._baseUrl}/transaction/${id}`);
            await this.localDatabase.AddOrUpdate(response.data);
            return {
                data: response.data,
                source: Sources.NETWORK
            }
        }
        catch (error) {
            console.log('Network request failed, falling back to local database:', error);
            const localData: Transaction | null = await this.localDatabase.Get(id);

            if (!localData) {
                console.log('Transaction not found in local database.');
                throw new Error('Transaction not found in local database.');
            }

            return {
                data: localData,
                source: Sources.LOCAL
            }
        }
    }

    public async Create(transaction: Transaction): Promise<Transaction> {
        console.log('Creating transaction');
        try {
            const response: AxiosResponse<Transaction> = await axios.post<Transaction>(`${this._baseUrl}/transaction`, transaction);
            this.localDatabase.AddOrUpdate(response.data);
            return response.data;
        }
        catch (error) {
            console.log('Failed to create transaction: ', error);
            throw new Error('Failed to create transaction');
        }
    }

    public async Update(transaction: Transaction): Promise<Transaction> {
        console.log('Updating transaction: ', transaction.id);
        const response: AxiosResponse<Transaction> = await axios.put<Transaction>(`${this._baseUrl}/transaction/${transaction.id}`, transaction);
        return response.data;
    }

    public async Delete(id: number): Promise<void> {
        console.log('Deleting transaction: ', id);
        try {
            await axios.delete(`${this._baseUrl}/transaction/${id}`);
            await this.localDatabase.Delete(id);
        }
        catch (error) {
            console.log('Failed to delete transaction: ', id, error);
        }
    }

    public async GetAllCustomPages(): Promise<CustomResponse<Transaction[]>> {
        try {
            console.log('Fetching all transactions from network.');
            const response: AxiosResponse<Transaction[]> = await axios.get(`${this._baseUrl}/allTransactions`);

            console.log('Fetch all successfull, updating local db.');
            await Promise.all(response.data.map(async (transaction) => {
                await this.localDatabase.AddOrUpdate(transaction);
            }));

            return {
                data: response.data,
                source: Sources.NETWORK
            };
        }
        catch (error) {
            console.log('Network request failed, falling back to local database:', error);
            const localData: Transaction[] = await this.localDatabase.GetAll();

            if (localData.length === 0) {
                console.log('No transactions found in local database.');
                throw new Error('No transactions found in local database.');
            }

            return {
                data: localData,
                source: Sources.LOCAL
            };
        }
    }
}