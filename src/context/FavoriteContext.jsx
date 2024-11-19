import { createContext, useContext, useState } from "react";

const FavoriteContext = createContext();

export const useFavorites = () => useContext(FavoriteContext);

export const FavoriteProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);

    const addFavorite = (product) => {
        if (!favorites.some((item) => item.id === product.id)) {
            setFavorites([...favorites, product]);
        }
    };

    const removeFavorite = (productId) => {
        setFavorites(favorites.filter((item) => item.id !== productId));
    };

    return (
        <FavoriteContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
            {children}
        </FavoriteContext.Provider>
    );
};
