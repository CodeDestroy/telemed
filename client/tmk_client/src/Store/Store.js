import { makeAutoObservable } from "mobx";

import AuthService from "../Services/AuthService";
/* import UserDto from "../dtos/user-dto"; */
//import { AuthResponse } from "../models/response/AuthResponse";

export default class Store {
    user = {};
    profiles = [];
    selectedProfile = {};
    isSelected = false;
    mustSelect = true;
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
    setSelectedProfile (worker) {
        this.user.medOrgId = worker.medOrgId
        this.user.MedicalOrg = worker.MedicalOrg
        this.user.Post = worker.Post
        this.user.info = worker.info
        this.user.postId = worker.postId
        this.user.personId = worker.id
        this.selectedProfile = worker
        localStorage.setItem('profile', worker.id);
    }
    setProfiles(profiles) {
        this.profiles = profiles
    }
    async login (login, password){
        this.setLoading(true)
        try {
            const response = await AuthService.login(login, password);   
            if (response.status === 200) {
                let tempUser = response.data.user;
                if (tempUser.accessLevel === 1) {
                    this.setLoading(false)
                    const res = {
                        data: 'Запрещён вход для пациентов',
                        redirect: process.env.REACT_APP_PATIENT_CLIENT_URL,
                    }
                    
                    //window.location.href = process.env.REACT_APP_PATIENT_CLIENT_URL
                    this.setError('Запрещён вход для пациентов')
                    return res
                }
                if (tempUser.persons.length === 0 ) {
                    this.setLoading(false)
                    const res = {response: {
                        data: 'Нет профиля'
                    }}
                    this.setError('Нет профиля')
                    return res
                }
                else if (tempUser.persons.length === 1) {
                    tempUser.medOrgId = tempUser.persons[0].medOrgId
                    tempUser.info = tempUser.persons[0].info
                    tempUser.postId = tempUser.persons[0].postId
                    tempUser.personId = tempUser.persons[0].id
                    this.setProfiles(tempUser.persons)
                    this.setSelectedProfile(tempUser.persons[0])
                    this.isSelected = true;
                    this.mustSelect = false;
                    localStorage.setItem('profile', tempUser.persons[0].id);
                    localStorage.setItem('token', response.data.accessToken);
                }
                else {
                    this.setProfiles(tempUser.persons)
                    this.mustSelect = true
                    localStorage.setItem('token', response.data.accessToken);
                }

                this.setUser(tempUser);

                //console.log(response.data.accessToken)
                
                //console.log(localStorage.getItem('token'))
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
            console.log(e)
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
            
            localStorage.removeItem('token');
            localStorage.removeItem('profile');
            this.setAuth(false);
            this.setLoading(false)
            this.setSelectedProfile({})
            this.mustSelect = true
            this.isSelected = false
            
            this.setProfiles([])

            this.setError('')
            this.setUser({});
            await AuthService.logout();
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
            if (response.status === 200) {
                let tempUser = response.data.user;
                if (localStorage.getItem('profile')) {
                    tempUser.persons.forEach((profile) => {
                        if (profile.id === Number(localStorage.getItem('profile'))) {
                            this.setSelectedProfile(profile)
                            tempUser.medOrgId = profile.medOrgId
                            tempUser.MedicalOrg = profile.MedicalOrg
                            tempUser.Post = profile.Post
                            tempUser.info = profile.info
                            tempUser.postId = profile.postId
                            tempUser.personId = profile.id
                            this.mustSelect = false
                            this.isSelected = true
                            
                        }
                    })
                }
                else {
                    if (tempUser.accessLevel === 1) {
                        this.setLoading(false)
                        const res = {
                            data: 'Запрещён вход для пациентов',
                            redirect: process.env.REACT_APP_PATIENT_CLIENT_URL
                        }
                        //window.location.href = process.env.REACT_APP_PATIENT_CLIENT_URL
                        this.setError('Запрещён вход для пациентов')
                        return res
                    }
                    if (tempUser.persons.length === 0 ) {
                        this.setLoading(false)
                        const res = {response: {
                            data: 'Нет профиля'
                        }}
                        this.setError('Нет профиля')
                        return res
                    }
                    else if (tempUser.persons.length === 1) {
                        tempUser.medOrgId = this.user.persons[0].medOrgId
                        tempUser.info = this.user.persons[0].info
                        tempUser.postId = this.user.persons[0].postId
                        tempUser.personId = this.user.persons[0].id
                        this.setProfiles(tempUser.persons)
                        this.setSelectedProfile(tempUser.persons[0])
                        this.isSelected = true;
                        this.mustSelect = false
                        
                    }
                    else {
                        this.setProfiles(tempUser.persons)
                        this.mustSelect = true;
                    }
                }
                this.setUser(tempUser);
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
        catch (e){
            this.setUser({});
            this.setAuth(false);
            this.setError(e.response.data)
            //localStorage.removeItem('token');
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