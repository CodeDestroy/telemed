import React, { useEffect, useState, useRef } from 'react'
import styles from '../../../../Assets/css/Main.module.css'
import authLocations from '../../../../Locations/AuthLocations'
import AuthService from '../../../../Services/AuthService'

import { IMaskInput } from 'react-imask'
function RestoreFirstStep() {
    useEffect(() => {
        const html = document.querySelector('html')
        html.style.fontSize = '10px'
    }, [])

    const [phone, setPhone] = useState('')
    
    const [formattedPhone, setFormattedPhone] = useState('') 
    const [error, setError] = useState('')
    const phoneRef = useRef(null)
    
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])
    const handlePhone = (event) => {
        setPhone(event.target.value)
    }

    const clearPhone = () => {
        setPhone('')
    }

    const handleNext = async (event) => {
        event.preventDefault()
        try {
            const response = await AuthService.sendRecoveryCode(phone.trim())
            if (response.status === 200) {
                window.location.href = authLocations.doctorRestorePasswordStep2 + `?phone=${(phone).trim()}`
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
                        <form className={`${styles.registerForm} step-1`}>
                            <p className={styles.formTitle}>
                                Восстановление доступа
                            </p>

                            {error.length > 0 ? 
                                <p className={styles.formDescription} style={{color: 'red'}}>
                                    {error}
                                </p>
                                :
                                ''
                            }
                            <p className={styles.formDescription}>
                                Укажите Ваш мобильный телефон для отправки кода подтверждения
                            </p>
                            <div className={styles.formGroup}>
                                {/* <input id="phone" name="phone" value={phone} className={`${styles.formInput} ${styles.phoneMask}`} type="text" placeholder="Введите" onChange={handlePhone}/> */}
                                {mounted && (
                                    <IMaskInput
                                        mask="+7 (000) 000-00-00"
                                        value={formattedPhone}
                                        onAccept={(value) => {
                                            const digits = value.replace(/\D/g, '')
                                            const normalized = digits.startsWith('8') ? digits.slice(1) : digits
                                            setPhone(normalized)
                                            setFormattedPhone(value)
                                        }}
                                        overwrite
                                        unmask={false} // сохраняем отображаемое значение
                                        // Для ref если нужно
                                        inputRef={phoneRef}
                                        // обычные пропсы input
                                        className={`${styles.formInput}`}
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        placeholder="+7 (___) ___-__-__"
                                    />
                                    
                                )}
                                <label htmlFor="phone" className={styles.formLabel}>Мобильный телефон</label>
                                <span className={styles.formClear} onClick={clearPhone}>
                                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 10.0914L10 1.09137M1 1L10 9.99999" stroke="#7E7E7E" strokeWidth="0.909137" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </span>
                            </div>
                            <input type="button" onClick={handleNext} className={styles.buttonPrimary} value="Далее"/>
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

export default RestoreFirstStep