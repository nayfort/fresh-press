import './styles.css';

const AccPage = () => {
    return (
        <div className="login-page">
            <p className='login-title'>Акаунт</p>

            <div className="acc-info-full">
                <p>Мої дані</p>
                <div>
                    <p>*обовʼязкові поля</p>
                    <div>
                        <div>
                            <p>Імʼя*</p>
                            <input type="text" className='login-page-input'/>
                        </div>
                        <div>
                            <p>Прізвище*</p>
                            <input type="text" className='login-page-input'/>
                        </div>
                        <div>
                            <p>Email</p>
                            <input type="text" className='login-page-input'/>
                        </div>
                        <div>
                            <p>Номер телефону</p>
                            <input type="text" className='login-page-input'/>
                        </div>
                    </div>
                    <div>
                        <div>
                            <p>Новий пароль</p>
                            <input type="text" className='login-page-input'/>
                        </div>
                        <div>
                            <p>Підтвердьте пароль</p>
                            <input type="text" className='login-page-input'/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccPage;
