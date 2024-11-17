import { useNavigate } from 'react-router-dom';
import './styles.css';

const OrderPage = () => {
    const navigate = useNavigate();

    return (
        <div className="order-page">
            <p className='order-title'>Інформація про доставку</p>

            <div className="order-form">
                <div className="order-input-el">
                    <p>Імʼя та прізвище</p>
                    <input type="text" placeholder='Fullname' className='order-input' />
                </div>
                <div className="order-input-el">
                    <p>Адреса</p>
                    <input type="text" placeholder='Adress' className='order-input' />
                </div>
                <div className="order-input-el">
                    <p>Коментар до замовлення</p>
                    <input type="text" placeholder='Comment' className='order-input' />
                </div>
                <div className="order-check">
                    <input type="checkbox"/>
                    <p>Я погоджуюся з умовами</p>
                </div>
                <button
                    className='order-btn'
                    onClick={() => navigate('/thanks-for-order-page-bla-bla-bla')}
                >
                    Оформити замовлення
                </button>
            </div>
        </div>
    );
};

export default OrderPage;
