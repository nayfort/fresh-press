import './styles.css';

const AccPage = () => {
    return (
        <div className="login-page">
            <p className='login-title'>Акаунт</p>
            <p className='acc-info-title'>Мої дані</p>
            <div className="acc-info-full">
                <div className="acc-info-container">
                    <div className='account-form-info'>
                        <div className='account-form-info-input'>
                            <p>Імʼя*</p>
                            <input type="text" className='login-page-input' placeholder='Name'/>
                        </div>
                        <div className='account-form-info-input'>
                            <p>Прізвище*</p>
                            <input type="text" className='login-page-input' placeholder='Surname'/>
                        </div>
                        <div className='account-form-info-input'>
                            <p>Email</p>
                            <input type="text" className='login-page-input' placeholder='example@gmail.com'/>
                        </div>
                        <div className='account-form-info-input'>
                            <p>Номер телефону</p>
                            <input type="text" className='login-page-input' placeholder='+380 ** *** ** **'/>
                        </div>
                    </div>
                    <div className='acc-info-line'></div>
                    <div className="account-form-reset-password">
                        <div className='account-form-info-input'>
                            <p>Новий пароль</p>
                            <input type="text" className='login-page-input' placeholder='password'/>
                        </div>
                        <div className='account-form-info-input'>
                            <p>Підтвердьте пароль</p>
                            <input type="text" className='login-page-input' placeholder='password'/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccPage;
