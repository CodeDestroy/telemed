import { makeAutoObservable } from "mobx";

import AuthService from "../Services/AuthService";

/* import UserDto from "../dtos/user-dto"; */
//import { AuthResponse } from "../models/response/AuthResponse";

export default class Store {
    user = {};
    isAuth = false;
    isLoading = false;
    error = '';

    constructor () {
        makeAutoObservable(this);
    }

    setAuth (bool) {
        this.isAuth = bool;
    }

    setLoading (bool) {
        this.isLoading = bool
    }

    setUser (user) {
        this.user = user;
    }
    setError (error) {
        this.error = error
    }
    
    async login (login, password){
        this.setLoading(true)
        try {
            const response = await AuthService.login(login, password);   
            if (response.status === 200) {

                this.setUser(response.data.user);
                localStorage.setItem('token', response.data.accessToken);
                this.setAuth(true);
                this.setLoading(false)
                return response
            }
            else {
                this.setLoading(false)
                const res = {response: {
                    data: 'Неизвестная ошибка'
                }}
                this.setError('Неизвестная ошибка')
                return res
            }
            
        }
        catch (e) {
            this.setError(e.response.data)
            
            return (e)
        }
        finally {
            this.setLoading(false)
        }
    }


    async registrationByCode (phone, code){
        this.setLoading(true)
        try {
            const response = await AuthService.confirmEmail(phone.trim(), code.trim())
            this.setUser(response.data.user);
            /* const response = await AuthService.registrarion(login, password, User_name, User_surname, User_patronomic, Doctor_id); */
            localStorage.setItem('token', response.data.accessToken);
            
            this.setAuth(true);
            this.setLoading(false)
            return response
        }
        catch (e) {
            console.log(e)
            this.setError(e.response.data)
            return (e)
        }
        finally {
            this.setLoading(false)
        }
    }

    async logout (){
        try {
            await AuthService.logout();
            localStorage.removeItem('token');
            this.setAuth(false);
            this.setLoading(false)
            this.setError('')
            this.setUser({});
        }
        catch (e) {
            console.log(e)
        }
    }

    async refreshStore() {
        this.setLoading(true)
        try {
            /* const user = await UserDto.deserialize(this.user) */
            this.setUser(this.user)
            this.setLoading(false)
        }
        catch(e) {
            this.setError(e.response.data)
            console.log(e)
        }
        finally {
            this.setLoading(false)
        }
    }

    async checkAuth () {
        this.setLoading(true)
        try {
            
            const response = await AuthService.refresh();
            localStorage.setItem('token', response.data.accessToken);
            /* const user = await UserDto.deserialize(response.data.user) */
            this.setUser(response.data.user);
            this.setAuth(true);
            return true;
        }
        catch (e){
            this.setUser({});
            this.setAuth(false);
            this.setError(e.response.data)
            localStorage.removeItem('token');
            console.log(e)
            return false
        }
        finally {
            this.setLoading(false)
        }
    }

}
/* const store = new Store();

export default store; */