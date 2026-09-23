import { usePreferences } from './context/PreferencesContext.js';
import RouteFocus from './components/ui/RouteFocus.jsx';
import './App.css';
import { useStorage } from './lib/useStorage.js';
import AuthProvider from './context/AuthProvider.jsx';
import RecoveryPage from './components/pages/recovery/index.jsx';
import OrderConfirmation from './components/pages/orderConfirmation/index.jsx';
import {
  Content,
  Footer,
  Header,
  About,
  Contacts,
  Delivery,
  FavoriteItemPage,
  CartPage,
  LoginPage,
  AccPage,
  SignUp,
  OrderPage,
} from './components/index.jsx';
import { Routes, Route, Link } from 'react-router-dom';
import ProductDetail from './components/content/products/index.jsx';
import { FavoriteProvider } from './context/FavoriteContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
function App() {
  const { t } = usePreferences();
  const [clickCounts, setClickCounts] = useStorage('freshpress.views', {});
  return (
    <AuthProvider>
      <CartProvider>
        <FavoriteProvider>
          <a className="skip-link" href="#main-content">
            {t('Перейти до вмісту')}
          </a>
          <RouteFocus />
          <Header />
          <Routes>
            <Route
              path="/"
              element={
                <Content
                  clickCounts={clickCounts}
                  setClickCounts={setClickCounts}
                />
              }
            />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/about-us" element={<About />} />
            <Route path="/delivery" element={<Delivery />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/account" element={<AccPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/favorite" element={<FavoriteItemPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/recovery" element={<RecoveryPage />} />
            <Route path="/orders/:id" element={<OrderConfirmation />} />
            <Route path="/order" element={<OrderPage />} />
            <Route
              path="*"
              element={
                <main id="main-content" tabIndex={-1} className="page">
                  <div className="empty-state panel">
                    <h1>{t('Сторінку не знайдено')}</h1>
                    <Link to="/" className="button">
                      {t('До каталогу')}
                    </Link>
                  </div>
                </main>
              }
            />
          </Routes>
          <Footer />
        </FavoriteProvider>
      </CartProvider>
    </AuthProvider>
  );
}
export default App;
