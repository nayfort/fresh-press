import './styles.css';
import Logo from '../../assets/imgs/png/logo.png';
import { useNavigate } from 'react-router-dom';
import {Favorite, OrangeCart, User} from "../../assets/imgs/svg/index.js";

const Header = () => {
    const navigate = useNavigate();

    return (
        <div className="header-container">
            <img
                src={Logo}
                className='logo-pic'
                alt="Fresh Press"
                onClick={() => navigate('/')}
            />
            <div className='contacts-block'>
                {/*<div className='contact-btn' onClick={() => navigate('/about-us')}>Про нас</div>*/}
                {/*<div className='contact-btn' onClick={() => navigate('/delivery')}>Доставка</div>*/}
                {/*<div className='contact-btn' onClick={() => navigate('/contacts')}>Контакти</div>*/}
                <div className='connect-btn' onClick={() => navigate('/login')}>
                    <User/>
                    Акаунт
                </div>
                <div className='connect-btn' onClick={() => navigate('/favorite')}>
                    <Favorite/>
                    Обране
                </div>
                <div className='connect-btn' onClick={() => navigate('/cart')}>
                    <OrangeCart/>
                    Кошик
                </div>
            </div>
        </div>
    );
};

export default Header;
