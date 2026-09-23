import PropTypes from 'prop-types';
import { FavoriteContext } from './FavoriteContext.js';
import { useStorage } from '../lib/useStorage.js';
import { productsData } from '../staticData/productData.js';

export const FavoriteProvider = ({ children }) => {
  const [ids, setIds] = useStorage('freshpress.favorites', []);
  const favorites = productsData.filter((product) => ids.includes(product.id));
  const addFavorite = (product) =>
    setIds((items) =>
      items.includes(product.id) ? items : [...items, product.id],
    );
  const removeFavorite = (id) =>
    setIds((items) => items.filter((item) => item !== id));
  return (
    <FavoriteContext.Provider
      value={{ favorites, addFavorite, removeFavorite }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};
FavoriteProvider.propTypes = { children: PropTypes.node.isRequired };
