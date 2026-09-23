import { createContext, useContext } from 'react';

export const FavoriteContext = createContext();
export const useFavorites = () => useContext(FavoriteContext);
