import { ReactNode } from 'react';
import { defaultReferenceData, ReferenceDataContext } from './ReferenceData';

export const ReferenceDataProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    return (
        <ReferenceDataContext.Provider value={defaultReferenceData}>
            {children}
        </ReferenceDataContext.Provider>
    );
};
