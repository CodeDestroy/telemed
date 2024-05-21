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
            localStorage.setItem('token', response.data.accessToken);
            /* const user = await UserDto.deserialize(response.data.user) */
            this.setUser(response.data.user);
            this.setAuth(true);
            return response
        }
        catch (e) {
            this.setError(e)
            return (e)
        }
        finally {
            this.setLoading(false)
        }
    }


   /*  async registration (login, password, User_name, User_surname, User_patronomic, Doctor_id){
        try {
            const response = await AuthService.registrarion(login, password, User_name, User_surname, User_patronomic, Doctor_id);
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(await userDto.deserialize(response.data.user));
        }
        catch (e) {
            console.log(e)
        }
    } */

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
            this.setError(e)
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
            this.setError(e)
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