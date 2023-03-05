import {makeAutoObservable} from "mobx";

export default class RightSideBarStore {

    constructor() {
        this._barTitle = ''
        this._itemsArr = []
        makeAutoObservable(this)
    }


    get barTitle() {
        return this._barTitle;
    }

    set barTitle(value) {
        this._barTitle = value;
    }

    get items() {
        return this._itemsArr;
    }

    clear() {
        this._itemsArr = []
        this._barTitle = ''
    }

    addBtn(name, type, handler){
        const newBtn = {
            id: this._itemsArr.length,
            name: name,
            type: 'btn ' + type,
            handler: handler,
        }
        this._itemsArr.push(newBtn)
    }

    addSnippet(name, text, type, handler){
        const newBtn = {
            id: this._itemsArr.length,
            name: name,
            type: 'snippet ' + type,
            text: text,
            handler: handler,
        }
        this._itemsArr.push(newBtn)
    }

    addBR(){
        const newBR = {
            id: this._itemsArr.length,
            name: '',
            type: 'br ',
            handler: null,
        }
        this._itemsArr.push(newBR)
    }

}