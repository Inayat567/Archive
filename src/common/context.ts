import React from 'react';
import UserPresence from './UserPresence';

export const PresenceContext = React.createContext<null|UserPresence>(null);
export const UserContext = React.createContext(null);
export const CompanyContext = React.createContext({
    companyUpdated: 0
});