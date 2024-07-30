import React, {useState, useContext, useLayoutEffect, useEffect} from 'react'
import { observer } from 'mobx-react-lite';
import { Context } from '../../..';

const Index = () => {

    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('')

    const {store} = useContext(Context)

    const handleChangePhone = async (e) => {
        setPhone(e.target.value)
    }
    const handleChangePassword = async (e) => {
        setPassword(e.target.value)
    }
    
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        const response = await store.login(phone, password)
    }

    const clearPhone = async () => {
        setPhone('')
    }

    if (!store.isAuth) 
        return (
            <>
                {/* <header className="transparent">
                    <div className="container flex-row">
                        <a href="#" className="logo">
                            <img src="/assets/img/logo.png"/>
                        </a>
                    </div>
                </header> */}
                <main>
                    <div className="full-screen">
                        <div className="container flex-row">
                            <div className="full-screen--content">
                                <form className="auth-form" onSubmit={handleLoginSubmit}>
                                    <p className="form-title">
                                        Вход в личный кабинет
                                    </p>
                                    <div className="form-group">
                                        <input id="phone" name="phone" className="form-input phone-mask" type="text" placeholder="Введите" value={phone} onChange={handleChangePhone}/>
                                        <label htmlFor="phone" className="form-label">Мобильный телефон</label>
                                        <span className="form-clear" onClick={clearPhone}>
                                            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1 10.0914L10 1.09137M1 1L10 9.99999" stroke="#7E7E7E" strokeWidth="0.909137" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </span>
                                    </div>
                                    <div className="form-group">
                                        <input id="password" name="password" className="form-input" type="password" placeholder="Введите"  value={password} onChange={handleChangePassword}/>
                                        <label htmlFor="password" className="form-label">Пароль</label>
                                        <button className="form-clear">
                                            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1 10.0914L10 1.09137M1 1L10 9.99999" stroke="#7E7E7E" strokeWidth="0.909137" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </button>
                                    </div>
                                    <input type="submit" className="button-primary" value="Войти"/>
                                </form>
                                <p>
                                    Забыли пароль? Перейдите на страницу<br></br> <a href="#">восстановления доступа</a>
                                </p>
                                <p>
                                    Если Вы никогда не пользовались личныму<br></br>кабинетом, то <a href="#">зарегистрируйтесь</a>
                                </p>
                            </div>
                            {/* <span className="full-screen--image" style={{backgroundImage: "url(/assets/img/auth-image.jpg)"}}  ></span> */}
                        </div>
                    </div>
                </main>
            </>
        )
    /* else
    {
        window.location.href = '/'
    } */
}

export default observer(Index)