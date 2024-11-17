import { useNavigate } from 'react-router-dom';
import './styles.css';

const LoginPage = () => {
    const navigate = useNavigate();

    return (
        <div className="login-page">
            <p className='login-title'>Акаунт</p>

            <div className="login-form">
                <div className="login-input-el">
                    <p>Email</p>
                    <input type="text" placeholder='example@gmail.com' className='login-page-input' />
                </div>
                <div className="login-input-el">
                    <p>Пароль</p>
                    <input type="text" placeholder='password' className='login-page-input' />
                </div>
                <button className='log-in-btn' onClick={() => navigate('/account')}>Увійти</button>
                <div className="login-form-buttons">
                    <div className='login-form-button'>Забули пароль?</div>
                    <div
                        className='login-form-button'
                        onClick={() => navigate('/signup')}
                    >
                        Вперше на нашому сайті?
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
