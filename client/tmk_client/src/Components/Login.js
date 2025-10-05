import React, {useState, useContext, useLayoutEffect, useEffect} from 'react'
import { observer } from 'mobx-react-lite';
import { Context } from '..';
import styles from '../Assets/css/Main.module.css'
import authLocations from '../Locations/AuthLocations';
const Login = () => {

    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('')

    const {store} = useContext(Context)

    useLayoutEffect(() => {
        const html = document.querySelector('html')
        html.style.fontSize = '10px'
    }, [])

    const handleChangePhone = async (e) => {
        setPhone(e.target.value)
    }
    const handleChangePassword = async (e) => {
        setPassword(e.target.value)
    }
    
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await store.login(phone, password)
            if (response.status !== 200) {
                /* alert(response.response.data) */
                console.log(store.error)
            }
        }
        catch (e) {
            console.log('catch 2', e)
        }
        
    }

    const clearPhone = async () => {
        setPhone('')
    }

    useEffect(() => {
        if (store.mustSelect && store.isAuth && !store.isSelected) {
            console.log('Выберите профиль')
        }
    }, [store.mustSelect])

    if (!store.isAuth) 
        return (
            <>
                {/* <header className={styles.transparent}>
                    <div className={`${styles.container} ${styles.flexRow}`}>
                        <a href="#" className="logo">
                            <img src="/assets/img/logo.png"/>
                        </a>
                    </div>
                </header> */}
                <main >
                    <div className={styles.fullScreen}>
                        <div className={`${styles.container} ${styles.flexRow}`}>
                            <div className={styles.fullScreenContent} style={{margin: '0 auto', paddingRight: 0}}>
                                <form className={styles.authForm} onSubmit={handleLoginSubmit} style={{marginTop: '0'}}>
                                    <p className={styles.formTitle}>
                                        Вход в личный кабинет
                                    </p>
                                    {store.error != '' ?
                                        <p style={{color: 'red'}}>
                                            {store.error}
                                        </p>
                                        :
                                        ''
                                    }
                                    <div className={styles.formGroup}>
                                        <input id="phone" name="phone" className={`${styles.formInput}`} type="text" placeholder="Введите" value={phone} onChange={handleChangePhone}/>
                                        <label htmlFor="phone" className={styles.formLabel}>Мобильный телефон</label>
                                        <span className={styles.formClear} onClick={clearPhone}>
                                            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1 10.0914L10 1.09137M1 1L10 9.99999" stroke="#7E7E7E" strokeWidth="0.909137" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </span>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <input id="password" name="password" className={styles.formInput} type="password" placeholder="Введите"  value={password} onChange={handleChangePassword}/>
                                        <label htmlFor="password" className={styles.formLabel}>Пароль</label>
                                        <button className={styles.formClear}>
                                            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1 10.0914L10 1.09137M1 1L10 9.99999" stroke="#7E7E7E" strokeWidth="0.909137" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </button>
                                    </div>
                                    <input type="submit" className={styles.buttonPrimary} value="Войти"/>
                                </form>
                                <p>
                                    Забыли пароль? Перейдите на страницу<br></br> <a href={authLocations.doctorRestorePasswordStep1}>восстановления доступа</a>
                                </p>
                                <p>
                                    Если Вы никогда не пользовались личным<br></br>кабинетом, то <a href={authLocations.doctorRegistration}>зарегистрируйтесь</a>
                                </p>
                            </div>
                            {/* <span className={styles.fullScreenImage} style={{backgroundImage: "url(/assets/img/auth-image.jpg)"}}  ></span> */}
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

export default observer(Login)