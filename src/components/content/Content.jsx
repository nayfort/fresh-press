import { useState } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import { Search, Check } from "../../assets/imgs/svg/index.js";
import { Bag, Bottle, Cap, Cups, Hat, Hoodie, Stickers, Tshirt } from "../../assets/imgs/png/index.js";

const Content = () => {
    const conditions = ['Новинки', 'Одяг', 'Аксесуари', 'За рейтингом'];
    const [selectedCondition, setSelectedCondition] = useState(conditions[0]);
    const [clickCounts, setClickCounts] = useState({});
    const [searchTerm, setSearchTerm] = useState(''); // Состояние для текста поиска

    const products = [
        { id: 1, name: 'Футболки', img: Tshirt, price: 50, category: 'Одяг' },
        { id: 2, name: 'Худі', img: Hoodie, price: 60, category: 'Одяг' },
        { id: 3, name: 'Шапки', img: Hat, price: 25, category: 'Одяг' },
        { id: 4, name: 'Кепки', img: Cap, price: 20, category: 'Одяг' },
        { id: 5, name: 'Шопери', img: Bag, price: 15, category: 'Аксесуари' },
        { id: 6, name: 'Стакани', img: Cups, price: 10, category: 'Аксесуари' },
        { id: 7, name: 'Стікери', img: Stickers, price: 5, category: 'Аксесуари' },
        { id: 8, name: 'Пляшки', img: Bottle, price: 12, category: 'Аксесуари' }
    ];

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
        setSearchTerm(event.target.value.toLowerCase()); // Обновляем состояние текста поиска
    };

    const filteredProducts = products
        .filter((product) => {
            if (selectedCondition === 'Одяг') {
                return product.category === 'Одяг';
            } else if (selectedCondition === 'Аксесуари') {
                return product.category === 'Аксесуари';
            }
            return true;
        })
        .filter((product) => product.name.toLowerCase().includes(searchTerm)) // Фильтруем по тексту поиска
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
                        value={searchTerm} // Привязка значения к состоянию поиска
                        onChange={handleSearchChange} // Обработка изменений в инпуте
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
