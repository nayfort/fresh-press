import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import { Search, Check } from "../../assets/imgs/svg/index.js";

const Content = () => {
    const conditions = ['Новинки', 'Одяг', 'Аксесуари', 'За рейтингом'];
    const [selectedCondition, setSelectedCondition] = useState(conditions[0]);

    const products = ['Футболки', 'Худі', 'Шапки', 'Кепки', 'Шопери', 'Стакани', 'Стікери', 'Пляшки'];

    const handleConditionClick = (condition) => {
        setSelectedCondition(condition);
    };

    return (
        <div className="content-container">
            <div className="search-block">
                <div className="search">
                    <input type="text" placeholder="Пошук по каталогу..." className="search-input"/>
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
                {products.map((product, index) => (
                    <Link to={`/product/${index + 1}`} key={index} className="content-card">
                        <div className='content-card'>
                            <p>{product}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Content;
