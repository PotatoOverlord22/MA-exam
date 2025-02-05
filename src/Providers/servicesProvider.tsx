import React, { createContext, useContext } from 'react';
import { BookService as BookService } from '../Services/bookService';
import { LocalDatabase } from '../Repositories/localDatabase';

export interface IServices {
    BookService: BookService;
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
    const entityService: BookService = new BookService(localDatabase);

    return (
        <ServicesContext.Provider value={{ BookService: entityService }}>
            {props.children}
        </ServicesContext.Provider>
    );
};