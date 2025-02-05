import React, { createContext, useContext } from 'react';
import { TransactionService as TransactionService } from '../Services/transactionService';
import { LocalDatabase } from '../Repositories/localDatabase';

export interface IServices {
    TransactionService: TransactionService;
};

const ServicesContext = createContext<IServices | undefined>(undefined);

export const useServices = () => {
    const context = useContext(ServicesContext);
    if (!context) {
        throw new Error('useServices must be used within a ServicesProvider');
    }

    return context;
};

export const ServicesProvider: React.FC<React.PropsWithChildren> = (props: React.PropsWithChildren) => {
    const localDatabase: LocalDatabase = new LocalDatabase();
    const entityService: TransactionService = new TransactionService(localDatabase);

    return (
        <ServicesContext.Provider value={{ TransactionService: entityService }}>
            {props.children}
        </ServicesContext.Provider>
    );
};