import axios from "axios";
import AuthService from "../Services/AuthService";
import Store from "../Store/Store"; 
export const API_URL = process.env.REACT_APP_SERVER_URL //'https://10.36.0.13:8443/'

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL,
    //sameSite: true, 
    headers: {
        'Content-Type': 'application/json'
    },
    secure: true,
    httpOnly: true
});

const $apiMultipartData = axios.create({
    /* withCredentials: true, */
    baseURL: API_URL,
    //sameSite: true, 
    headers: {
        "Content-Type":"multipart/form-data" 
    }
    //secure: true,
    /* httpOnly: true */
});

$api.interceptors.request.use((config) => {
    
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
        //config.headers.Co
    return config;
});

$apiMultipartData.interceptors.request.use((config) => {
    
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
        //config.headers.Co
    return config;
});


$api.interceptors.response.use(function (config) {
    // Любой код состояния, находящийся в диапазоне 2xx, вызывает срабатывание этой функции
    // Здесь можете сделать что-нибудь с ответом
    return config;
  }, async function (error) {
    const originalRequest = error.config
        if (error.response.status == 401 && !error.config._isRetry && error.config) {
            originalRequest._isRetry = true;
            try {
                const response = await Store.checkAuth()
                console.log(response.data.accessToken)
                localStorage.setItem('token', response.data.accessToken);
                return $api.request(originalRequest); 
            }
            catch (e) {
                console.log('Не авторизован');
            }
            
        }
        throw error
});

$apiMultipartData.interceptors.response.use(function (config) {
    // Любой код состояния, находящийся в диапазоне 2xx, вызывает срабатывание этой функции
    // Здесь можете сделать что-нибудь с ответом
    return config;
  }, async function (error) {
    const originalRequest = error.config
        if (error.response.status == 401 && !error.config._isRetry && error.config) {
            originalRequest._isRetry = true;
            try {
                const response = await Store.checkAuth()
                console.log(response.data.accessToken)
                localStorage.setItem('token', response.data.accessToken);
                return $api.request(originalRequest); 
            }
            catch (e) {
                console.log('Не авторизован');
            }
            
        }
        throw error
});
export {$api, $apiMultipartData};