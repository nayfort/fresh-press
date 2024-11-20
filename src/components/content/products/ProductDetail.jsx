import { useState } from "react";
import { useParams } from "react-router-dom";
import { useFavorites } from "../../../context/FavoriteContext";
import { useCart } from "../../../context/CartContext";
import { productsData, productImages } from "../../../staticData/productData.js";
import { Download, Cart, Heart, FullHeart } from "../../../assets/imgs/svg/index.js";
import SizeChart from "../../../assets/imgs/png/tshirt/tshirt-size.png";
import "./styles.css";

const ProductDetail = () => {
    const { id } = useParams();
    const product = productsData.find((item) => item.id === parseInt(id));

    const [selectedSize, setSelectedSize] = useState("XS");
    const [selectedView, setSelectedView] = useState("front");

    const { favorites, addFavorite, removeFavorite } = useFavorites();
    const { addToCart } = useCart();

    const isFavorite = favorites.some((item) => item.id === product.id);

    const toggleFavorite = () => {
        if (isFavorite) {
            removeFavorite(product.id);
        } else {
            addFavorite(product);
        }
    };

    const handleBuy = () => {
        const productWithSize = { ...product, selectedSize };
        addToCart(productWithSize);
        alert("Товар добавлено в кошик!");
    };

    const views = product.name === "Худі"
        ? [
            { name: "Вид спереду", value: "front" },
            { name: "Вид ззаду", value: "back" },
            { name: "Лівий рукав", value: "left_sleeve" },
            { name: "Правий рукав", value: "right_sleeve" },
        ]
        : product.name === "Шапка"
            ? [
                { name: "Вид спереду", value: "front" },
                { name: "Вид ззаду", value: "back" },
                { name: "Вид зліва", value: "left_sleeve" },
                { name: "Вид справа", value: "right_sleeve" },
            ]
            : ["Футболка", "Кепка", "Шопер", "Стакан"].includes(product.name)
                ? [
                    { name: "Вид спереду", value: "front" },
                    { name: "Вид ззаду", value: "back" },
                ]
                : ["Пляшка", "Стікер"].includes(product.name)
                    ? [{ name: "Вид спереду", value: "front" }]
                    : [];

    return (
        <div className="product-detail">
            <div className="product-view">
                {views.map((view) => (
                    <div
                        key={view.value}
                        className={`view-item ${selectedView === view.value ? "selected-view" : ""}`}
                        onClick={() => setSelectedView(view.value)}
                    >
                        {view.name}
                    </div>
                ))}
            </div>
            <div className="product-detail-content">
                <div className="product-detail-pic">
                    <div className="product-detail-picture">
                        <div className="product-favorite" onClick={toggleFavorite}>
                            {isFavorite ? <FullHeart /> : <Heart />}
                        </div>
                        <img
                            src={productImages[product.id][selectedView]}
                            alt={`${product.name} - ${selectedView}`}
                            className="product-image-view"
                        />
                    </div>
                    <button className="download-pic-btn">Завантажити фото<Download /></button>
                    <div className="download-description">
                        Щоб нанести фото по всій ширині області друку, потрібен розмір не менше 1000x1000 px, бажано у форматі .png з прозорим фоном.
                        Мінімальна роздільна здатність 200 dpi, розмір зображення 1:1.
                    </div>
                </div>
                <div className="product-detail-info">
                    <div className="product-detail-info-title">
                        <div className="product-name">{product.name}</div>
                        <div className="product-price">${product.price}</div>
                        <div className="product-description">
                            Ваше замовлення буде виготовлено і передано в службу доставки після уточнень деталей замовлення з менеджером або автоматичної обробки
                        </div>
                        <div>Вкажіть розмір:</div>
                    </div>
                    <div>
                        {["XS", "S", "M", "L", "XL", "XXL", "XXXL"].map((size) => (
                            <button
                                key={size}
                                className={`size-btn ${selectedSize === size ? "selected" : ""}`}
                                onClick={() => setSelectedSize(size)}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                    <button className="buy-el-btn" onClick={handleBuy}>
                        Купити<Cart />
                    </button>
                    <div className="product-size">Розмірна сітка:</div>
                    <img src={SizeChart} alt="SizeChart" className="size-chart-pic" />
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
