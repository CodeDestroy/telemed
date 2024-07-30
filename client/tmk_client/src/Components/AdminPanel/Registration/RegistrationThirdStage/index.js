import React, { useEffect, useState, useContext } from 'react'
import styles from '../../../../Assets/css/Main.module.css'
import authLocations from '../../../../Locations/AuthLocations'
import AuthService from '../../../../Services/AuthService'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Context } from '../../../..';
import adminLocations from '../../../../Locations/AdminLocations';

const RegistratinStep3 = () => {

    const { store } = useContext(Context);
    const [searchParams, setSearchParams] = useSearchParams();
    const phone = searchParams.get("phone")
    const [code, setCode] = useState('')

    useEffect(() => {
        const html = document.querySelector('html')
        html.style.fontSize = '10px'
        const preCode = searchParams.get("code")
        if (preCode && preCode?.length == 4) {
            register(phone, preCode)
        }
    }, [])

    const handleChangeCode = (event) => {
        setCode(event.target.value)
        if (event.target.value.length == 4) {
            register(phone, event.target.value)
        }
    }

    const handleNext = async (event) => {
        event.preventDefault()
        /* console.log(phone) */
        register(phone, code)

    }
    const register = async (phone, code) => {
        try {
            const response = await store.registrationByCode(phone, code)
            if (response.data === null) {
                /* window.location.href = authLocations.registrationStep2 + `?phone=${(phone).trim()}` */

            }
            console.log(response) 
        }
        catch (e) {
            console.log(e)
        }
        
    }

  return (
    <main>
        <div className={styles.fullScreen}>
            <div className={`${styles.container} ${styles.flexRow}`}>
                <div className={styles.fullScreenContent} style={{margin: '0 auto'}}>
                    <form className={`${styles.registerForm} step-2`} style={{paddingTop: '50%important'}}>
                        <p className={styles.formTitle}>
                          Регистрация
                        </p>
                        <p className={styles.formDescription}>
                            На Вашу электронную почту, указанную ранее, поступит сообщение с кодом подтверждения - введите цифры в поле ниже:
                        </p>
                        <div className={styles.formGroup}>
                            <div className={styles.formRow}>
                                <div className={styles.col}>
                                    <input id="code" name="code" className={`${styles.formInput} code-mask`} type="text" placeholder="Введите" value={code} onChange={handleChangeCode}/>
                                    <label for="code" className={styles.formLabel}>Введите код</label>
                                </div>
                                <div className={styles.col}>
                                    <button type="button" className={styles.recall}>Отправить еще раз (не работает)</button>
                                </div>
                            </div>
                            {/* <p className={styles.formGroupDescription}>Повторный звонок через 0:35</p> */}
                        </div>
                        <input type="submit" onClick={handleNext} className={styles.buttonPrimary} value="Далее"/>
                    </form>
                    <p>
                        <a href={adminLocations.index}>Вернуться ко входу в личный кабинет</a>
                    </p>
                </div>
                {/* <span className={styles.fullScreenImage} style={{backgroundImage: 'url(/assets/img/auth-image.jpg)'}} ></span> */}
            </div>
        </div>
    </main>
  )
}

export default RegistratinStep3