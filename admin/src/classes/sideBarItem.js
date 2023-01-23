export default class SideBarItem {

    constructor(name, link) {
        this._name = name
        this._link = link
    }

    get name(){
        return this._name
    }

    get link(){
        return this._link
    }

}