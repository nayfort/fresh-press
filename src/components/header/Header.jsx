import './styles.css';
import Logo from '../../assets/imgs/png/logo.png';
import { useNavigate } from 'react-router-dom';

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
                <div className='contact-btn' onClick={() => navigate('/about-us')}>Про нас</div>
                <div className='contact-btn' onClick={() => navigate('/delivery')}>Доставка</div>
                <div className='contact-btn' onClick={() => navigate('/contacts')}>Контакти</div>
            </div>
        </div>
    );
};

export default Header;
