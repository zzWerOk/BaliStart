import {makeAutoObservable} from "mobx";

export default class NavBarStore{

    constructor() {
        this._navBarTitle = ""
        this._navBarLink = ""
        makeAutoObservable(this)
    }

    set navBarTitle(title){
        this._navBarTitle = title
    }

    get navBarTitle(){
        return this._navBarTitle
    }

    set navBarLink(title){
        this._navBarLink = title
    }

    get navBarLink(){
        return this._navBarLink
    }

}