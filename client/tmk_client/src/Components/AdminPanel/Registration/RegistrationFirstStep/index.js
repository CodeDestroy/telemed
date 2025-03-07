import React, { useEffect,useState } from 'react'
import styles from '../../../../Assets/css/Main.module.css'
import authLocations from '../../../../Locations/AuthLocations'
import AuthService from '../../../../Services/AuthService'
function RegistratinStep1() {
    useEffect(() => {
        const html = document.querySelector('html')
        html.style.fontSize = '10px'
    }, [])

    const [phone, setPhone] = useState('')

    const handlePhone = (event) => {
        setPhone(event.target.value)
    }

    const clearPhone = () => {
        setPhone('')
    }

    const handleNext = async (event) => {
        event.preventDefault()
        /* console.log(phone) */
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
                                <input id="phone" name="phone" value={phone} className={`${styles.formInput} ${styles.phoneMask}`} type="text" placeholder="Введите" onChange={handlePhone}/>
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
                    {/* <span className={styles.fullScreenImage} style={{backgroundImage: 'url(/assets/img/auth-image.jpg)'}} ></span> */}
                </div>
            </div>
        </main>
    )
}

export default RegistratinStep1