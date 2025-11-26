import React, { useEffect, useState, useContext } from 'react'
import styles from '../../../../Assets/css/Main.module.css'
import authLocations from '../../../../Locations/AuthLocations'
import { useSearchParams } from 'react-router-dom';
import { Context } from '../../../..';

function RestoreThirdStep() {
    const { store } = useContext(Context);
    const [searchParams] = useSearchParams();
    const phone = searchParams.get("phone")
    const code = searchParams.get("code")

    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')

    useEffect(() => {
        const html = document.querySelector('html')
        html.style.fontSize = '10px'
    }, [])

    const handleNext = async (event) => {
        event.preventDefault()
        if (password !== password2) {
            alert("Пароли не совпадают")
            return
        }
        try {
            const response = await store.recoverySetPassword(phone, code, password)
            if (response.status === 200) {
                alert("Пароль успешно изменён")
                window.location.href = authLocations.login
            } else {
                alert(response.data)
            }
        } catch (e) {
            alert(e.response?.data || "Ошибка при сохранении пароля")
        }
    }

    return (
        <main>
            <div className={styles.fullScreen}>
                <div className={`${styles.container} ${styles.flexRow}`}>
                    <div className={styles.fullScreenContent} style={{margin: '0 auto'}}>
                        <form className={`${styles.registerForm} step-3`}>
                            <p className={styles.formTitle}>
                                Восстановление доступа
                            </p>
                            <p className={styles.formDescription}>
                                Придумайте новый пароль для входа:
                            </p>
                            <div className={styles.formGroup}>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={styles.formInput} placeholder="Введите пароль"/>
                                <label className={styles.formLabel}>Новый пароль</label>
                            </div>
                            <div className={styles.formGroup}>
                                <input type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} className={styles.formInput} placeholder="Повторите пароль"/>
                                <label className={styles.formLabel}>Повторите пароль</label>
                            </div>
                            <input type="submit" onClick={handleNext} className={styles.buttonPrimary} value="Сохранить"/>
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

export default RestoreThirdStep
