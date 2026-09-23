import PropTypes from 'prop-types';
import { CartContext } from './CartContext.js';
import { useStorage } from '../lib/useStorage.js';
import { cartKey, normalizeCart } from '../lib/cart.js';

export const CartProvider = ({ children }) => {
  const [savedItems, setCartItems] = useStorage('freshpress.cart.v2', []);
  const cartItems = normalizeCart(savedItems);
  const addToCart = (product) => {
    const key = cartKey(product);
    setCartItems((saved) => {
      const items = normalizeCart(saved);
      if (items.some((item) => item.key === key))
        return items.map((item) =>
          item.key === key
            ? { ...item, quantity: Math.min(99, item.quantity + 1) }
            : item,
        );
      return [...items, { ...product, key, quantity: 1 }];
    });
  };
  const removeFromCart = (key) =>
    setCartItems((items) =>
      normalizeCart(items).filter((item) => item.key !== key),
    );
  const updateQuantity = (key, quantity) => {
    const value = Number(quantity);
    if (!Number.isInteger(value) || value < 1 || value > 99) return;
    setCartItems((items) =>
      normalizeCart(items).map((item) =>
        item.key === key ? { ...item, quantity: value } : item,
      ),
    );
  };
  const clearCart = () => setCartItems([]);
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
CartProvider.propTypes = { children: PropTypes.node.isRequired };
