import {makeAutoObservable} from "mobx";

export default class UserStore {

    constructor() {
        this._isAdmin = false
        this._isGuide = false
        this._isAuth = false
        this._email = ''
        this._name = ''
        this._user = {}
        makeAutoObservable(this)
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

    setUser(user) {

        if (user.hasOwnProperty('id') && user.hasOwnProperty('email')) {

            this._user = user
            if (user.hasOwnProperty('isAdmin')) {
                this.setIsAdmin(user.isAdmin)
            }

            if (user.hasOwnProperty('isGuide')) {
                this.isGuide = user.isGuide
            }

            if (user.hasOwnProperty('email')) {
                this.email = user.email
            }

            if (user.hasOwnProperty('name')) {
                this.name = user.name
            }

            this.setIsAuthUser(true)

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

    logout() {
        this._isAuth = false
        this._isAdmin = false
        this._isAuth = false
        this._user = {}
        localStorage.setItem("token", '')
    }

};