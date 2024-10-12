import './styles.css';
import Logo from '../../assets/imgs/png/logo.png';

const Header = () => {
    return (
        <div className="header-container">
            <img src={Logo} className='logo-pic' alt="Fresh Press"/>
            <div className='contacts-block'>
                <div className='contact-btn'>Про нас</div>
                <div className='contact-btn'>Доставка</div>
                <div className='contact-btn'>Контакти</div>
            </div>
        </div>
    );
};

export default Header;
