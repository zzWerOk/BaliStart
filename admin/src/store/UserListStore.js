import {makeAutoObservable} from "mobx";
import React from "react";

export default class UserListStore {

    constructor() {
        this._lastDateTableUser = -1
        this._userList = ''
        makeAutoObservable(this)
    }

    saveLastDateTableUser(newDate) {
        this._lastDateTableUser = newDate
        localStorage.setItem('lastDateTableUser', newDate)
    }

    getSavedLastDateTableUser() {
        if (this._lastDateTableUser === -1) {
            this._lastDateTableUser = localStorage.getItem("lastDateTableUser")
        }
        return this._lastDateTableUser
    }

    saveUserList(newList) {

        let textForSave

        textForSave = JSON.stringify(newList)

        this._userList = textForSave
        localStorage.setItem('userPage_listItems', textForSave)

    }

    get getSavedUserList() {
        if (this._userList === '') {
            this._userList = localStorage.getItem("userPage_listItems")
        }

        try {
            return JSON.parse(this._userList)
        } catch (e) {

        }
        return null
    }

    editUserById(id, newUserData) {
        let userList = this.getSavedUserList
        for(let i = 0;i < userList.length;i++){
            if(userList[i].id === newUserData.id){
                userList[i] = newUserData
                this.saveUserList(userList)
                break
            }
        }

    }
    setUserActiveById(id, isActive) {
        let userList = this.getSavedUserList

        userList.map(currUser => {
                if (currUser.id === id) {
                    currUser.is_active = isActive
                }
            }
        )

        this.saveUserList(userList)

    }

    setUserRoleById(id, role) {
        let userList = this.getSavedUserList

        userList.map(function(currUser) {
            if (currUser.id === id) {

                switch (role) {
                    case 'Admin':
                        currUser.is_admin = true
                        currUser.is_guide = false
                        break
                    case 'Guide':
                        currUser.is_admin = false
                        currUser.is_guide = true
                        break
                    default:
                        currUser.is_admin = false
                        currUser.is_guide = false
                        break
                }
            }
        });

        this.saveUserList(userList)
    }

}