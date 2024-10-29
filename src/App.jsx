import './App.css';
import { Content, Footer, Header, About, Contacts, Delivery } from './components/index.jsx';
import { Routes, Route } from 'react-router-dom';
import ProductDetail from "./components/products/index.jsx";

function App() {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<Content />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/about-us" element={<About />} />
                <Route path="/delivery" element={<Delivery />} />
                <Route path="/contacts" element={<Contacts />} />
            </Routes>
            <Footer />
        </>
    );
}

export default App;
