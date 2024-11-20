import { useCart } from "../../../context/CartContext";
import "./styles.css";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity} = useCart();
    const navigate = useNavigate();

    const handleQuantityChange = (productId, event) => {
        const newQuantity = event.target.value;
        updateQuantity(productId, newQuantity);
    };

    return (
        <div className="cart-page">
            <div className="cart-title">Кошик</div>
            <div className="cart-content">
                {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                        <div key={item.id} className="cart-item">
                            <img src={item.img} alt={item.name} className="cart-item-image"/>
                            <div className='cart-item-info'>
                                <div className='cart-item-title'>
                                    <p className='cart-item-bold'>{item.name}</p>
                                    <p className='cart-item-bold'>${item.price * item.quantity}</p>
                                </div>
                                <div className='cart-item-size'>
                                    <p>Розмір: {item.selectedSize}</p>
                                </div>
                                <div className='cart-item-quantity'>
                                    <p>
                                        Кількість:{" "}
                                        <select
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityChange(item.id, e)}
                                            className="quantity-selector"
                                        >
                                            {Array.from({length: 99}, (_, i) => i + 1).map((value) => (
                                                <option key={value} value={value}>
                                                    {value}
                                                </option>
                                            ))}
                                        </select>
                                    </p>
                                    <button className='delete-from-cart-btn'
                                            onClick={() => removeFromCart(item.id)}>Видалити
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Кошик порожній</p>
                )}
            </div>
            {cartItems.length > 0 && (
                <button className="order-button" onClick={() => navigate("/order")}>
                    Замовити
                </button>
            )}
        </div>
    );
};

export default CartPage;
