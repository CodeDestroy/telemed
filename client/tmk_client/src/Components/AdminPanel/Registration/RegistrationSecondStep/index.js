import React, { useEffect,useState } from 'react'
import styles from '../../../../Assets/css/Main.module.css'
import authLocations from '../../../../Locations/AuthLocations'
import AuthService from '../../../../Services/AuthService'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { InputMask } from '@react-input/mask';

const RegistratinStep2 = () => {

    useEffect(() => {
        const html = document.querySelector('html')
        html.style.fontSize = '10px'
    }, [])
    
    const [searchParams, setSearchParams] = useSearchParams();
    const phone = searchParams.get("phone")
    const [secondName, setSecondName] = useState('')
    const [name, setName] = useState('')
    const [patronomicName, setPatronomicName] = useState('')
    const [birthDate, setBirthDate] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleChangeSecondName = (event) => {
        setSecondName(event.target.value)
    }

    const clearSecondName = () => {
        setSecondName('')
    }

    const handleChangeName = (event) => {
        setName(event.target.value)
    }

    const clearName = () => {
        setName('')
    }

    const handleChangePatronomicName = (event) => {
        setPatronomicName(event.target.value)
    }

    const clearPatronomicName = () => {
        setPatronomicName('')
    }

    const handleChangeBirthDate = (event) => {
        setBirthDate(event.target.value)
    }

    const clearBirthDate = () => {
        setBirthDate('')
    }

    const handleChangeEmail = (event) => {
        setEmail(event.target.value)
    }

    const clearEmail = () => {
        setEmail('')
    }

    const handleChangePassword = (event) => {
        setPassword(event.target.value)
    }

    const clearPassword = () => {
        setPassword('')
    }

    const handleNext = async (event) => {
        
        event.preventDefault()
        const checkBox = document.getElementById('agreement')
        if (checkBox.checked && secondName != '' && name != '' && birthDate.length == 10 && email != '') {
            const response = await AuthService.confirmRegistration(secondName, name, patronomicName, birthDate, email, phone, password)
            console.log(response)
            if (response.status == 200) {
                window.location.href = authLocations.registrationStep3 + `?phone=${(phone).trim()}`
            }
        }
        else {
            alert('Не все поля заполнены')
        }
        /* console.log(phone) */
        
        
    }
    const navigate = useNavigate();
    const handleBack = () => {
        navigate(-1)
    }

return (
    <main>
        <div className={styles.fullScreen}>
            <div className={`${styles.container} ${styles.flexRow}`}>
                <div className={styles.fullScreenContent} style={{margin: '0 auto'}}>
                    <form className={`${styles.registerForm} ${styles.step3}`} style={{paddingTop: '50%important'}}>
                        <p className={styles.formTitle}>
                            Регистрация
                        </p>
                        <div className={styles.formGroup}>
                            <input id="lastname" name="lastname" className={styles.formInput} type="text" placeholder="Введите вашу фамилию" value={secondName} onChange={handleChangeSecondName} required="required"/>
                            <label htmlFor="lastname" className={styles.formLabel} required>Фамилия</label>
                            <span className={styles.formClear} onClick={clearSecondName}>
                                <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 10.0914L10 1.09137M1 1L10 9.99999" stroke="#7E7E7E" strokeWidth="0.909137" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </span>
                        </div>
                        <div className={styles.formGroup}>
                            <input id="name" name="name" className={styles.formInput} type="text" placeholder="Введите ваше имя" value={name} onChange={handleChangeName} required="required"/>
                            <label htmlFor="name" className={styles.formLabel} required>Имя</label>
                            <span className={styles.formClear} onClick={clearName}>
                                <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 10.0914L10 1.09137M1 1L10 9.99999" stroke="#7E7E7E" strokeWidth="0.909137" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </span>
                        </div>
                        <div className={styles.formGroup}>
                            <input id="fathername" name="fathername" className={styles.formInput} type="text" placeholder="Введите ваше отчество" value={patronomicName} onChange={handleChangePatronomicName}/>
                            <label htmlFor="fathername" className={styles.formLabel}>Отчество</label>
                            <span className={styles.formClear} onClick={clearPatronomicName}>
                                <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 10.0914L10 1.09137M1 1L10 9.99999" stroke="#7E7E7E" strokeWidth="0.909137" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </span>
                        </div>
                        <div className={styles.formGroup}>
                            {/* <input /> */}
                            <InputMask 
                                mask="__.__.____" replacement="_"
                                showMask 
                                separate 
                                id="birthday" 
                                name="birthday" 
                                className={`${styles.formInput} date-mask`} 
                                type="text" placeholder="Введите" 
                                value={birthDate} 
                                onChange={handleChangeBirthDate}
                                required="required"
                            />
                            <label htmlFor="birthday" className={styles.formLabel}>Дата рождения</label>
                            <span className={styles.formClear} onClick={clearBirthDate}>
                                <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 10.0914L10 1.09137M1 1L10 9.99999" stroke="#7E7E7E" strokeWidth="0.909137" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </span>
                        </div>
                        <div className={styles.formGroup}>
                            <input id="email" name="email" className={styles.formInput} type="email" placeholder="Введите электронную почту" value={email} onChange={handleChangeEmail} required="required"/>
                            <label htmlFor="email" className={styles.formLabel}>Электронная почта</label>
                            <span className={styles.formClear} onClick={clearEmail}>
                                <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 10.0914L10 1.09137M1 1L10 9.99999" stroke="#7E7E7E" strokeWidth="0.909137" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </span>
                        </div>
                        <div className={styles.formGroup}>
                            <input id="password" name="password" className={styles.formInput} type="password" placeholder="Введите пароль" value={password} onChange={handleChangePassword} required="required"/>
                            <label htmlFor="password" className={styles.formLabel}>Пароль</label>
                            <span className={styles.formClear} onClick={clearPassword}>
                                <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 10.0914L10 1.09137M1 1L10 9.99999" stroke="#7E7E7E" strokeWidth="0.909137" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </span>
                        </div>
                        <div className={styles.formCheckbox}>
                            <input 
                                id="agreement" 
                                type="checkbox" 
                                name="agreement" 

                                required="required"
                            />
                            <label htmlFor="agreement" className={styles.formCheckboxLabel}>
                                Я даю согласие на обработку моих персональных данных и принимаю пользовательское соглашение
                            </label>
                        </div>
                        <div className={styles.buttonGroup}>
                            <a onClick={handleBack} className={styles.buttonLightgray}>Назад</a>
                            <input 
                                type="submit" 
                                onClick={handleNext} 
                                className={styles.buttonPrimary} 
                                value="Далее"
                            />
                        </div>
                    </form>
                    <p>
                        <a href={authLocations.login}>Вернуться ко входу в личный кабинет</a>
                    </p>
                </div>
                {/* <span className={styles.fullScreenImage} style={{backgroundImage: "url(/assets/img/auth-image.jpg)"}} ></span> */}
            </div>
        </div>
      </main>
    )
}

export default RegistratinStep2