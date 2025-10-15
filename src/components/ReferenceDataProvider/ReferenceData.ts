import React, { createContext, useContext } from 'react';

export interface ReferenceData {
    category: string[];
    split: string[];
}

export const defaultReferenceData: ReferenceData = {
    category: [
        'Select Category',
        'Bills & Payments',
        'Eating out & Entertainment',
        'Gifts',
        'Groceries',
        'Home Setup',
        'Medical Expenses',
        'MG Hector - Car Loan EMI',
        'Home Loan EMI',
        'Travel, Fuel, Cabs & Vehicle Related',
        'Learning & Upskilling',
        'Miscellaneous',
        "Anshu's Personal - Essentials",
        "Anshu's Personal - Non-essentials",
        "Nehu's Personal - Essentials",
        "Nehu's Personal - Non-essentials",
        'Non Expense Transaction',
        'Donation',
        "Ishu's Expenses",
    ],

    split: [
        'Select Split',
        'Anshu Paid - Split Equally',
        'Anshu Paid - For Self',
        'Anshu Paid - For Nehu',
        'Nehu Paid - Split Equally',
        'Nehu Paid - For Self',
        'Nehu Paid - For Anshu',
    ],
};

export const ReferenceDataContext =
    createContext<ReferenceData>(defaultReferenceData);

export const useReferenceData = () => {
    return useContext(ReferenceDataContext);
};
