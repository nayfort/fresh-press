import { useState } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import { Search, Check } from "../../assets/imgs/svg/index.js";
import {productsData} from "../../staticData/productData.js";

const Content = () => {
    const conditions = ['Новинки', 'Одяг', 'Аксесуари', 'За рейтингом'];
    const [selectedCondition, setSelectedCondition] = useState(conditions[0]);
    const [clickCounts, setClickCounts] = useState({});
    const [searchTerm, setSearchTerm] = useState('');

    const handleConditionClick = (condition) => {
        setSelectedCondition(condition);
    };

    const handleProductClick = (productId) => {
        setClickCounts((prevCounts) => ({
            ...prevCounts,
            [productId]: (prevCounts[productId] || 0) + 1
        }));
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const filteredProducts = productsData
        .filter((product) => {
            if (selectedCondition === 'Одяг') {
                return product.category === 'Одяг';
            } else if (selectedCondition === 'Аксесуари') {
                return product.category === 'Аксесуари';
            }
            return true;
        })
        .filter((product) => product.name.toLowerCase().includes(searchTerm))
        .sort((a, b) => {
            if (selectedCondition === 'За рейтингом') {
                const countA = clickCounts[a.id] || 0;
                const countB = clickCounts[b.id] || 0;
                return countB - countA;
            } else if (selectedCondition === 'Новинки') {
                return b.id - a.id;
            }
            return 0;
        });

    return (
        <div className="content-container">
            <div className="search-block">
                <div className="search">
                    <input
                        type="text"
                        placeholder="Пошук по каталогу..."
                        className="search-input"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <div className="search-icon">
                        <Search />
                    </div>
                </div>
                <div className="search-conditions">
                    {conditions.map((condition, index) => (
                        <div
                            key={index}
                            className={`s-condition ${selectedCondition === condition ? 'selected' : ''}`}
                            onClick={() => handleConditionClick(condition)}
                        >
                            {selectedCondition === condition && <Check />}
                            {condition}
                        </div>
                    ))}
                </div>
            </div>
            <div className="items-block">
                {filteredProducts.map((product) => (
                    <Link
                        to={`/product/${product.id}`}
                        key={product.id}
                        className="content-card"
                        onClick={() => handleProductClick(product.id)}
                    >
                        <div className='content-card-element'>
                            <img src={product.img} alt={product.name} className="product-image" />
                            <p className='content-product-name'>{product.name}</p>
                            <p className='content-product-price'>${product.price}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Content;
