import {makeAutoObservable} from "mobx";

export default class UserStore {

    constructor() {
        this._isAdmin = false
        this._isGuide = false
        this._isAgent = false
        this._isAuth = false
        this._email = ''
        this._name = ''
        this._avatar_img = ''
        this._user = {}
        this._guide = {}
        this._agent = {}

        this._onLogoutHandler = null
        this._onLoginHandler = null

        makeAutoObservable(this)
    }


    get avatar_img() {
        return this._avatar_img;
    }

    set avatar_img(value) {
        this._avatar_img = value;
    }

    setIsAuthUser(isAuthUser) {
        this._isAuth = isAuthUser
    }

    setIsAdmin(isAdmin) {
        this._isAdmin = isAdmin
    }


    get isGuide() {
        return this._isGuide;
    }

    set isGuide(value) {
        this._isGuide = value;
    }

    get isAgent() {
        return this._isAgent;
    }

    set isAgent(value) {
        this._isAgent = value;
    }

    get email() {
        return this._email;
    }

    set email(value) {
        this._email = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    setUserData(userData) {
        if (userData.hasOwnProperty('name')) {
            this.name = userData.name
        }
        if (userData.hasOwnProperty('avatar_img')) {
            this.avatar_img = userData.avatar_img
        }

        this.setIsAuthUser(true)

        if(this._onLoginHandler){
            this._onLoginHandler()
        }

    }

    setUser(user) {

        if (user.hasOwnProperty('id') && user.hasOwnProperty('email')) {

            this._user = user
            if (user.hasOwnProperty('isAdmin')) {
                this.setIsAdmin(user.isAdmin)
            }

            if (user.hasOwnProperty('isGuide')) {
                this.isGuide = user.isGuide
            }

            if (user.hasOwnProperty('isAgent')) {
                this.isAgent = user.isAgent
            }

            if (user.hasOwnProperty('email')) {
                this.email = user.email
            }

            if (user.hasOwnProperty('name')) {
                this.name = user.name
            }

            // this.setIsAuthUser(true)
            //
            // if(this._onLoginHandler){
            //     this._onLoginHandler()
            // }
        }
    }

    get isAuth() {
        return this._isAuth
    }

    get isAdmin() {
        return this._isAdmin
    }

    get currUserId() {
        if (this._user) {
            return this._user.id
        }
        return null
    }

    get user() {
        return this._user
    }


    get guide() {
        return this._guide;
    }

    set guide(value) {
        this._guide = value;
    }

    get agent() {
        return this._agent;
    }

    set agent(value) {
        this._agent = value;
    }

    logout() {
        this._isAuth = false
        this._isAdmin = false
        this._isAuth = false
        this._user = {}
        localStorage.setItem("token", '')

        if(this._onLogoutHandler){
            this._onLogoutHandler()
        }

    }


    // get onLogoutHandler() {
    //     return this._onLogoutHandler;
    // }

    set onLogoutHandler(value) {
        this._onLogoutHandler = value;
    }


    // get onLoginHandler() {
    //     return this._onLoginHandler;
    // }

    set onLoginHandler(value) {
        this._onLoginHandler = value;
    }
};