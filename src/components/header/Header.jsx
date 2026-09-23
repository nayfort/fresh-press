import PreferencesControls from './PreferencesControls.jsx';
import { usePreferences } from '../../context/PreferencesContext.js';
import { NavLink, Link } from 'react-router-dom';
import Logo from '../../assets/imgs/png/logo.png';
import { Favorite, OrangeCart, User } from '../../assets/imgs/svg/index.js';
import { useCart } from '../../context/CartContext.js';
import { useFavorites } from '../../context/FavoriteContext.js';
import { useAuth } from '../../context/AuthContext.js';
import './styles.css';
export default function Header() {
  const { t } = usePreferences();
  const { cartItems } = useCart();
  const { favorites } = useFavorites();
  const { user } = useAuth();
  const quantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <header className="header-container">
      <div className="header-inner">
        <Link to="/" className="brand" aria-label={t('Fresh Press — головна')}>
          <img src={Logo} className="logo-pic" alt="Fresh Press" />
        </Link>
        <PreferencesControls />
        <nav className="contacts-block" aria-label={t('Головна навігація')}>
          <NavLink className="connect-btn" to={user ? '/account' : '/login'}>
            <User />
            <span>{t('Акаунт')}</span>
          </NavLink>
          <NavLink className="connect-btn" to="/favorite">
            <span className="nav-icon">
              <Favorite />
              {favorites.length > 0 && (
                <span className="nav-count">{favorites.length}</span>
              )}
            </span>
            <span>{t('Обране')}</span>
          </NavLink>
          <NavLink className="connect-btn" to="/cart">
            <span className="nav-icon">
              <OrangeCart />
              {quantity > 0 && <span className="nav-count">{quantity}</span>}
            </span>
            <span>{t('Кошик')}</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
