import { useState } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import { Search, Check } from "../../assets/imgs/svg/index.js";
import { Bag, Bottle, Cap, Cups, Hat, Hoodie, Stickers, Tshirt } from "../../assets/imgs/png/index.js";

const Content = () => {
    const conditions = ['Новинки', 'Одяг', 'Аксесуари', 'За рейтингом'];
    const [selectedCondition, setSelectedCondition] = useState(conditions[0]);

    const products = [
        { id: 1, name: 'Футболки', img: Tshirt, price: 50 },
        { id: 2, name: 'Худі', img: Hoodie, price: 60 },
        { id: 3, name: 'Шапки', img: Hat, price: 25 },
        { id: 4, name: 'Кепки', img: Cap, price: 20 },
        { id: 5, name: 'Шопери', img: Bag, price: 15 },
        { id: 6, name: 'Стакани', img: Cups, price: 10 },
        { id: 7, name: 'Стікери', img: Stickers, price: 5 },
        { id: 8, name: 'Пляшки', img: Bottle, price: 12 }
    ];

    const handleConditionClick = (condition) => {
        setSelectedCondition(condition);
    };

    return (
        <div className="content-container">
            <div className="search-block">
                <div className="search">
                    <input type="text" placeholder="Пошук по каталогу..." className="search-input" />
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
                {products.map((product) => (
                    <Link to={`/product/${product.id}`} key={product.id} className="content-card">
                        <div className='content-card'>
                            <img src={product.img} alt={product.name} className="product-image" />
                            <p>{product.name}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Content;
