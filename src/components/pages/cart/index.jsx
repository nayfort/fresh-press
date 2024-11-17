import './styles.css';
import {useNavigate} from "react-router-dom";

const CartPage = () => {
    const navigate = useNavigate();

    return (
        <div className="cart-page">
            <div className='cart-title'>Кошик</div>
            <div className="cart-content">
                content
                <button className='order-button' onClick={() => navigate('/order')}>Замовити</button>
            </div>
            <div>pagination...</div>
        </div>
    );
};

export default CartPage;
