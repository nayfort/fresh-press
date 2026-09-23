import { createContext, useContext } from 'react';
export const PreferencesContext = createContext();
export const usePreferences = () => useContext(PreferencesContext);
