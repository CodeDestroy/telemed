import React, { useEffect, useState, useContext } from 'react'
import styles from '../../../../Assets/css/Main.module.css'
import authLocations from '../../../../Locations/AuthLocations'
import { useSearchParams } from 'react-router-dom';
import { Context } from '../../../..';
import AuthService from '../../../../Services/AuthService'

function RestoreSecondStep() {
    const { store } = useContext(Context);
    const [searchParams] = useSearchParams();
    const phone = searchParams.get("phone")

    const [code, setCode] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        const html = document.querySelector('html')
        html.style.fontSize = '10px'
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!code || !password || !password2) {
            alert("Заполните все поля")
            return
        }
        if (password !== password2) {
            alert("Пароли не совпадают")
            return
        }

        try {
            const response = await AuthService.resetPassword(phone, code, password)
            if (response.status === 200) {
                alert("Пароль успешно изменён")
                window.location.href = authLocations.login
            } else {
                console.log(response.data)
            }
        } catch (e) {
            setError(e.response?.data?.error)
        }
    }

    return (
        <main>
            <div className={styles.fullScreen}>
                <div className={`${styles.container} ${styles.flexRow}`}>
                    <div className={styles.fullScreenContent} style={{margin: '0 auto', paddingRight: 0}}>
                        <form className={`${styles.registerForm} step-2`} onSubmit={handleSubmit}>
                            <p className={styles.formTitle}>
                                Восстановление доступа
                            </p>
                            <p className={styles.formDescription}>
                                На Ваш телефон или почту отправлен код подтверждения. Введите его и новый пароль:
                            </p>
                            <div className={styles.formGroup}>
                                <input 
                                    id="code" 
                                    name="code" 
                                    className={styles.formInput} 
                                    type="text" 
                                    placeholder="Введите код" 
                                    value={code} 
                                    onChange={(e) => setCode(e.target.value)}
                                />
                                <label htmlFor="code" className={styles.formLabel}>Код подтверждения</label>
                            </div>
                            <div className={styles.formGroup}>
                                <input 
                                    type="password" 
                                    className={styles.formInput} 
                                    placeholder="Введите новый пароль" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <label className={styles.formLabel}>Новый пароль</label>
                            </div>
                            <div className={styles.formGroup}>
                                <input 
                                    type="password" 
                                    className={styles.formInput} 
                                    placeholder="Повторите пароль" 
                                    value={password2} 
                                    onChange={(e) => setPassword2(e.target.value)}
                                />
                                <label className={styles.formLabel}>Повторите пароль</label>
                            </div>
                            <input type="submit" className={styles.buttonPrimary} value="Сохранить пароль"/>
                        </form>
                        <p>
                            <a href={authLocations.login}>Вернуться ко входу в личный кабинет</a>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default RestoreSecondStep
