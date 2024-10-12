import './App.css';
import { Content, Footer, Header } from './components/index.jsx';
import { Routes, Route } from 'react-router-dom';
import ProductDetail from "./components/products/index.jsx";

function App() {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<Content />} />
                <Route path="/product/:id" element={<ProductDetail />} />
            </Routes>
            <Footer />
        </>
    );
}

export default App;
