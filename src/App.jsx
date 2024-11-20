import './App.css';
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
    SignUp, OrderPage
} from './components/index.jsx';
import { Routes, Route } from 'react-router-dom';
import ProductDetail from "./components/content/products/index.jsx";
import { FavoriteProvider } from './context/FavoriteContext';
import { CartProvider } from './context/CartContext.jsx';

function App() {
    return (
        <CartProvider>
        <FavoriteProvider>
            <Header />
            <Routes>
                <Route path="/" element={<Content />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/about-us" element={<About />} />
                <Route path="/delivery" element={<Delivery />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/account" element={<AccPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/favorite" element={<FavoriteItemPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/order" element={<OrderPage />} />
            </Routes>
            <Footer />
        </FavoriteProvider>
        </CartProvider>
    );
}

export default App;
