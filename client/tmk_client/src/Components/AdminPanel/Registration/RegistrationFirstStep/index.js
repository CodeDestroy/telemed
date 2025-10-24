import React, { useEffect,useState, useRef } from 'react'
import styles from '../../../../Assets/css/Main.module.css'
import authLocations from '../../../../Locations/AuthLocations'
import AuthService from '../../../../Services/AuthService'
import { IMaskInput } from 'react-imask'
function RegistratinStep1() {
    useEffect(() => {
        const html = document.querySelector('html')
        html.style.fontSize = '10px'
    }, [])
    const [consent, setConsent] = useState(false);

    const [formattedPhone, setFormattedPhone] = useState('') 
    const [phone, setPhone] = useState('')

    const phoneRef = useRef(null)
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])
    const handlePhone = (event) => {
        setPhone(event.target.value)
    }

    const clearPhone = () => {
        setPhone('')
        setFormattedPhone('')
    }
    const handleConsentChange = (event) => {
        setConsent(event.target.checked);
    }


    const handleNext = async (event) => {
        event.preventDefault()
        /* console.log(phone) */
        if (!consent) {
            alert('Вы должны согласиться на обработку персональных данных');
            return;
        }
        try {
            const response = await AuthService.checkPhone(phone.trim())
            if (response.status === 200) {
                window.location.href = authLocations.registrationStep2 + `?phone=${(phone).trim()}`
            }
            else {
                alert(response.data)
            }
            console.log(response)
        }
        catch (e) {
            alert(e.response.data)
        }
        
        
    }
    return (
        <main>
            <div className={styles.fullScreen}>
                <div className={`${styles.container} ${styles.flexRow}`}>
                    <div className={styles.fullScreenContent} style={{margin: '0 auto'}}>
                        <form className={`${styles.registerForm} step-1`} style={{paddingTop: '50%important'}}>
                            <p className={styles.formTitle}>
                                Регистрация
                            </p>
                            <p className={styles.formDescription}>
                                Пожалуйста, укажите Ваш мобильный телефон для проверки его наличия в нашей системе
                            </p>
                            <div className={styles.formGroup}>
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
                                {/* <input id="phone" name="phone" value={phone} className={`${styles.formInput} ${styles.phoneMask}`} type="text" placeholder="Введите" onChange={handlePhone}/> */}
                                <label htmlFor="phone" className={styles.formLabel}>Мобильный телефон</label>
                                <span className={styles.formClear} onClick={clearPhone}>
                                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 10.0914L10 1.09137M1 1L10 9.99999" stroke="#7E7E7E" strokeWidth="0.909137" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </span>
                            </div>
                            <div className={styles.formGroup} style={{ display: 'flex', alignItems: 'center' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                                    <input 
                                        type="checkbox" 
                                        checked={consent} 
                                        onChange={handleConsentChange} 
                                        style={{ margin: 0, verticalAlign: 'middle', accentColor: 'red' }}
                                    />
                                    <span>
                                    Я ознакомлен(а) и согласен(а) с{' '} <a href={`${process.env.REACT_APP_SERVER_URL}/license/Доктор_Рядом_Перечень_Обрабатываемых_Персональных_Данных.pdf`} target="_blank" >политикой обработки персональных данных</a>
                                    </span>
                                </label>
                            </div>


                            <input type="button" onClick={handleNext} className={styles.buttonPrimary} value="Далее"/>
                        </form>
                        <p>
                            <a href={authLocations.login}>Вернуться ко входу в личный кабинет</a>
                        </p>
                    </div>
                    {/* <span className={styles.fullScreenImage} style={{backgroundImage: 'url(/assets/img/auth-image.jpg)'}} ></span> */}
                </div>
            </div>
        </main>
    )
}

export default RegistratinStep1