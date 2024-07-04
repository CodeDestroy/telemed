import React, { useEffect } from 'react'
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import mainUtil from '../Utils/mainUtil';
const Header = () => {
    const {store} = React.useContext(Context)
    
    useEffect(() => {
        /* console.log(store.user) */
    }, [store])
    const handleLogout = async () => {
        await store.logout()
        store.checkAuth()

    } 
    return (
        <header>
            <div className="container flex-row align-center">
                <a href="/" className="logo">
                    <img src="/assets/img/logo.png"/>
                </a>

                <div className="notifications new">
                    <div className="notifications-icon">
                        <svg width="19" height="21" viewBox="0 0 19 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.38314 15.2917H3.12903C1.92303 15.2917 1.32004 15.2917 1.19317 15.198C1.05063 15.0928 1.01581 15.0307 1.00037 14.8543C0.986636 14.6972 1.35621 14.0924 2.09537 12.883C2.85854 11.6342 3.50656 9.81594 3.50656 7.24167C3.50656 5.81834 4.11236 4.45331 5.19069 3.44686C6.26903 2.44042 7.73156 1.875 9.25655 1.875C10.7816 1.875 12.2441 2.44042 13.3224 3.44686C14.4008 4.45331 15.0066 5.81834 15.0066 7.24167C15.0066 9.81594 15.6546 11.6342 16.4178 12.883C17.1569 14.0924 17.5265 14.6972 17.5128 14.8543C17.4974 15.0307 17.4625 15.0928 17.32 15.198C17.1931 15.2917 16.5901 15.2917 15.3841 15.2917H12.1316M6.38314 15.2917L6.38156 16.25C6.38156 17.8379 7.66879 19.125 9.25655 19.125C10.8444 19.125 12.1316 17.8379 12.1316 16.25V15.2917M6.38314 15.2917H12.1316" stroke="#000" strokeWidth="1.91667" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="notifications--count">1</span>
                    </div>

                    <div className="notifications-content">
                        <div className="notifications-content--inner">
                            <div className="notifications-content--close">
                                <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.33105 10.0914L10.6045 1.09137M1.33105 1L10.6045 9.99999" stroke="#D30D15" strokeWidth="0.909137" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <div className="scroll">
                                <div className="notifications-content--item">
                                    <p>
                                        <b>Готов:</b> Анализ крови на тиреотропный гормон (ТТГ), свободный тироксин (Т4) и свободный трийодтиронин (Т3 св.)<br></br>
                                        <b>от 25.09.2023</b>
                                    </p>
                                    <a href="#">Перейти к результатам</a>
                                </div>
                                <div className="notifications-content--item">
                                    <p>
                                        <b>Готов:</b> Анализ крови на тиреотропный гормон (ТТГ), свободный тироксин (Т4) и свободный трийодтиронин (Т3 св.)<br></br>
                                        <b>от 25.09.2023</b>
                                    </p>
                                    <a href="#">Перейти к результатам</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="person">
                    <a href="#" className="person--photo" style={{backgroundImage: mainUtil.isUrl(store.user.avatar) ? `url(${store.user.avatar})` : store.user.avatar}}></a>
                    <a href="#" className="person--name">
                        {store?.user?.admin ? 
                            store.user.admin.secondName + ' ' + store.user.admin.firstName + ' ' + store.user.admin.patronomicName
                            :
                            ''
                        }
                        {store?.user?.doctor ? 
                            store.user.doctor.secondName + ' ' + store.user.doctor.firstName + ' ' + store.user.doctor.patronomicName
                            :
                            ''
                        }
                        {store?.user?.patient ? 
                            store.user.patient.secondName + ' ' + store.user.patient.firstName + ' ' + store.user.patient.patronomicName
                            :
                            ''
                        }
                        {/* Иванова  Екатерина Александровна  */}
                    </a>
                    <a onClick={handleLogout} className="person--logout">
                        Выход
                    </a>
                </div>
                {/* <a href="#" className="button-primary">Записаться на приём</a> */}
                <div className="mobile-menu-icon">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M0 14.0007C0 13.3563 0.696445 12.834 1.55555 12.834L26.4444 12.834C27.3036 12.834 28 13.3563 28 14.0007C28 14.645 27.3036 15.1673 26.4444 15.1673L1.55555 15.1673C0.696445 15.1673 0 14.645 0 14.0007Z" fill="#D30D15"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M0 4.66667C0 4.02233 0.696445 3.5 1.55555 3.5L26.4444 3.5C27.3036 3.5 28 4.02233 28 4.66667C28 5.311 27.3036 5.83333 26.4444 5.83333L1.55555 5.83333C0.696445 5.83333 0 5.311 0 4.66667Z" fill="#D30D15"/>
                        <path d="M0 23.3327C0 22.6884 0.696445 22.166 1.55555 22.166H26.4444C27.3036 22.166 28 22.6884 28 23.3327C28 23.977 27.3036 24.4993 26.4444 24.4993H1.55555C0.696445 24.4993 0 23.977 0 23.3327Z" fill="#D30D15"/>
                    </svg>
                </div>
            </div>
        </header>
    )
}

export default observer(Header)