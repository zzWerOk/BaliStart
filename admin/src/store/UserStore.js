import {makeAutoObservable} from "mobx";

export default class UserStore {

    constructor() {
        this._isAdmin = false
        this._isGuide = false
        this._isAuthUser = false
        this._user = {}
        makeAutoObservable(this)
    }

    setIsAuthUser(isAuthUser) {
        this._isAuthUser = isAuthUser
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

    setUser(user) {

        if (user.hasOwnProperty('id') && user.hasOwnProperty('email')) {

            this._user = user
            if (user.hasOwnProperty('isAdmin')) {
                this.setIsAdmin(user.isAdmin)
            }

            if (user.hasOwnProperty('isGuide')) {
                this.isGuide = user.isGuide
            }

            this.setIsAuthUser(true)

        }
    }

    get isAuthUser() {
        return this._isAuthUser
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
        this._isAuthUser = false
        this._isAdmin = false
        this._user = {}
        localStorage.setItem("token", '')
    }

}