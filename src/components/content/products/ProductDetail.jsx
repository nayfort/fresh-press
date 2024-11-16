import { useState } from 'react';
import { useParams } from 'react-router-dom';
import './styles.css';
import { Download, Cart, Heart, FullHeart } from "../../../assets/imgs/svg/index.js";
import SizeChart from "../../../assets/imgs/png/tshirt/tshirt-size.png";

import {tshirtFront, tshirtBack} from "../../../assets/imgs/png/tshirt/index.jsx";
import {hoodieFront, hoodieLeft, hoodieRight, hoodieBack} from "../../../assets/imgs/png/hoodie/index.jsx";
import {hatFront, hatBack, hatRight, hatLeft} from "../../../assets/imgs/png/hat/index.jsx";
import {capFront, capBack} from "../../../assets/imgs/png/cap/index.jsx";
import {bagFront, bagBack} from "../../../assets/imgs/png/bag/index.jsx";
import {cupFront, cupBack} from "../../../assets/imgs/png/cup/index.jsx";
import {stickerFront} from "../../../assets/imgs/png/sticker/index.jsx";
import {bottleFront} from "../../../assets/imgs/png/bottle/index.jsx";

const productsData = [
    { id: 1, name: 'Футболка', price: 50, type: 'apparel' },
    { id: 2, name: 'Худі', price: 60, type: 'apparel' },
    { id: 3, name: 'Шапка', price: 25, type: 'accessory' },
    { id: 4, name: 'Кепка', price: 20, type: 'accessory' },
    { id: 5, name: 'Шопер', price: 15, type: 'accessory' },
    { id: 6, name: 'Стакан', price: 10, type: 'accessory' },
    { id: 7, name: 'Стікер', price: 5, type: 'accessory' },
    { id: 8, name: 'Пляшка', price: 12, type: 'accessory' }
];

const productImages = {
    1: {
        front: tshirtFront,
        back: tshirtBack,
    },
    2: {
        front: hoodieFront,
        back: hoodieBack,
        left_sleeve: hoodieLeft,
        right_sleeve: hoodieRight,
    },
    3: {
        front: hatFront,
        back: hatBack,
        left_sleeve: hatLeft,
        right_sleeve: hatRight,
    },
    4: {
        front: capFront,
        back: capBack,
    },
    5: {
        front: bagFront,
        back: bagBack,
    },
    6: {
        front: cupFront,
        back: cupBack,
    },
    7: {
        front: stickerFront,
    },
    8: {
        front: bottleFront,
    },
};

const ProductDetail = () => {
    const { id } = useParams();
    const product = productsData.find((item) => item.id === parseInt(id));

    const [selectedSize, setSelectedSize] = useState('XS');
    const [selectedView, setSelectedView] = useState('front');
    const [isFavorite, setIsFavorite] = useState(false);
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

    const views = product.name === 'Худі'
        ? [
            { name: 'Вид спереду', value: 'front' },
            { name: 'Вид ззаду', value: 'back' },
            { name: 'Лівий рукав', value: 'left_sleeve' },
            { name: 'Правий рукав', value: 'right_sleeve' }
        ]
        : product.name === 'Шапка'
            ? [
                { name: 'Вид спереду', value: 'front' },
                { name: 'Вид ззаду', value: 'back' },
                { name: 'Вид зліва', value: 'left_sleeve' },
                { name: 'Вид справа', value: 'right_sleeve' },
            ]
            : product.name === 'Футболка' || product.name === 'Кепка' || product.name === 'Шопер' || product.name === 'Стакан'
                ? [
                    { name: 'Вид спереду', value: 'front' },
                    { name: 'Вид ззаду', value: 'back' },
                ]
                    : product.name === 'Пляшка' || product.name === 'Стікер'
                        ? [
                            { name: 'Вид спереду', value: 'front' }
                            ]
                            : [];

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
                        <div className='product-favorite' onClick={() => setIsFavorite(!isFavorite)}>
                            {isFavorite ? <FullHeart /> : <Heart />}
                        </div>
                        <img
                            src={productImages[product.id][selectedView]}
                            alt={`${product.name} - ${selectedView}`}
                            className="product-image-view"
                        />
                    </div>
                    <button className='download-pic-btn'>Завантажити фото<Download /></button>
                    <div className='download-description'>
                        Щоб нанести фото по всій ширині області друку, потрібен розмір не менше 1000x1000 px, бажано у форматі .png з прозорим фоном.
                        Мінімальна роздільна здатність 200 dpi, розмір зображення 1:1.
                    </div>
                </div>
                <div className="product-detail-info">
                    <div className="product-detail-info-title">
                        <div className='product-name'>{product.name}</div>
                        <div className='product-price'>${product.price}</div>
                        <div className='product-description'>
                            Ваше замовлення буде виготовлено і передано в службу доставки після уточнень деталей замовлення з менеджером або автоматичної обробки
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
                    <div className='product-size'>Розмірна сітка:</div>
                    <img src={SizeChart} alt="SizeChart" className='size-chart-pic' />
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
