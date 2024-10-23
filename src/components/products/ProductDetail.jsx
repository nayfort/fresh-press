import { useState } from 'react';
import { useParams } from 'react-router-dom';
import './styles.css';
import { Download, Cart } from "../../assets/imgs/svg/index.js";
import SizeChart from "../../assets/imgs/png/tshirt-size.png";

const productsData = [
    { id: 1, name: 'Футболка', price: 50 },
    { id: 2, name: 'Худі', price: 60 },
    { id: 3, name: 'Шапка', price: 25 },
    { id: 4, name: 'Кепка', price: 20 },
    { id: 5, name: 'Шопер', price: 15 },
    { id: 6, name: 'Стакан', price: 10 },
    { id: 7, name: 'Стікер', price: 5 },
    { id: 8, name: 'Пляшка', price: 12 }
];

const ProductDetail = () => {
    const { id } = useParams();
    const product = productsData.find((item) => item.id === parseInt(id));

    const [selectedSize, setSelectedSize] = useState('XS');
    const [selectedView, setSelectedView] = useState('front');

    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    const views = [
        { name: 'Вид спереду', value: 'front' },
        { name: 'Вид ззаду', value: 'back' },
        { name: 'Лівий рукав', value: 'left_sleeve' },
        { name: 'Правий рукав', value: 'right_sleeve' }
    ];

    const handleSizeClick = (size) => {
        setSelectedSize(size);
    };

    const handleViewClick = (view) => {
        setSelectedView(view);
    };

    return (
        <div className="product-detail">
            <div className="product-view">
                {views.map((view) => (
                    <div
                        key={view.value}
                        className={`view-item ${selectedView === view.value ? 'selected-view' : ''}`}
                        onClick={() => handleViewClick(view.value)}
                    >
                        {view.name}
                    </div>
                ))}
            </div>
            <div className="product-detail-content">
                <div className="product-detail-pic">
                    <div className="product-detail-picture">
                        <img src="" alt={product.name} />
                    </div>
                    <button className='download-pic-btn'>Завантажити фото<Download /></button>
                    <div className='download-description'>
                        Щоб нанести фото по всій ширині області друку, потрібен розмір не менше 1000x1000 px, бажано у форматі .png з прозорим фоном.
                        Мінімальна роздільна здатність 200 dpi, розмір зображення 1:1.
                    </div>
                </div>
                <div className="product-detail-info">
                    <div className="product-detail-info-title">
                        <div>{product.name}</div>
                        <div>${product.price}</div>
                        <div>
                            Ваше замовлення буде виготовлено і передано в службу доставки після уточнень деталей
                            замовлення з менеджером або автоматичної обробки
                        </div>
                        <div>Вкажіть розмір:</div>
                    </div>
                    <div>
                        {sizes.map((size) => (
                            <button
                                key={size}
                                className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                                onClick={() => handleSizeClick(size)}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                    <button className='buy-el-btn'>Купити<Cart /></button>
                    <div>Розмірна сітка:</div>
                    <img src={SizeChart} alt="" className='size-chart-pic' />
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
