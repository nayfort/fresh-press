import './styles.css';
import {useNavigate} from "react-router-dom";

const SignUp = () => {
    const navigate = useNavigate();

    return (
        <div className="login-page">
            <p className='login-title'>Акаунт</p>

            <div className="registration-form">
                <div className="registration-form-input">
                    <p>Email</p>
                    <input type="text" className='login-page-input' placeholder='example@gmail.com'/>
                </div>
                <div className="registration-form-input">
                    <p>Пароль</p>
                    <input type="text" className='login-page-input' placeholder='password'/>
                </div>
                <div className="registration-form-input">
                    <p>Підтвердьте пароль</p>
                    <input type="text" className='login-page-input' placeholder='password'/>
                </div>
                <button className='registration-btn' onClick={() => navigate('/account')}>Зареєструватися</button>
            </div>
        </div>
    );
};

export default SignUp;
