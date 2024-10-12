import React from 'react';
import { useParams } from 'react-router-dom';
import './styles.css'
import {Download, Cart} from "../../assets/imgs/svg/index.js";
import SizeChart from "../../assets/imgs/png/tshirt-size.png";

const ProductDetail = () => {
    const { id } = useParams();

    return (
        <div className="product-detail">
            <div className="product-view">
                <div>Вид спереду</div>
                <div>Вид ззаду</div>
                <div>Лівий рукав</div>
                <div>Правий рукав</div>
            </div>
            <div className="product-detail-content">
                <div>
                    <div className="product-detail-picture">
                        <img src="" alt=""/>
                    </div>
                    <button>Завантажити фото<Download/></button>
                    <div>
                        Щоб нанести фото по всій ширині області друку, потрібен розмір не менше 1000x1000 px, бажано у форматі .png з прозорим фоном.
                        Мінімальна роздільна здатність 200 dpi, розмір зображення 1:1.
                    </div>
                </div>
                <div>
                    <div>
                        <div>Футболка</div>
                        <div>$50</div>
                        <div>Ваше замовлення буде виготовлено і передано в службу доставки після уточнень деталей замовлення з менеджером або автоматичної обробки</div>
                        <div>Вкажіть розмір:</div>
                        <div>
                            <button>XS</button>
                            <button>S</button>
                            <button>M</button>
                            <button>L</button>
                            <button>XL</button>
                            <button>XXL</button>
                            <button>XXXL</button>
                        </div>
                    </div>
                    <button>Купити<Cart/></button>
                    <div>Розмірна сітка:</div>
                    <img src={SizeChart} alt="" className='size-chart-pic'/>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
