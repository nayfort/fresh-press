import './styles.css';
import {useNavigate} from "react-router-dom";

const SignUp = () => {
    const navigate = useNavigate();

    return (
        <div className="login-page">
            <p className='login-title'>Акаунт</p>

            <div className="registration-form">
                <div>
                    <p>Email</p>
                    <input type="text" className='login-page-input'/>
                </div>
                <div>
                    <p>Пароль</p>
                    <input type="text" className='login-page-input'/>
                </div>
                <div>
                    <p>Підтвердьте пароль</p>
                    <input type="text" className='login-page-input'/>
                </div>
                <button onClick={() => navigate('/account')}>Зареєструватися</button>
            </div>
        </div>
    );
};

export default SignUp;
