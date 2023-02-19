import {makeAutoObservable} from "mobx";

export default class ToursTypeStore {

    constructor() {
        this._loaded = false
        this._itemsArr = ''

        makeAutoObservable(this)
    }


    get loaded() {
        return this._loaded;
    }

    set itemsArr(value) {
        try {
            this._itemsArr = JSON.stringify(value)
            this._loaded = true
        }catch (e) {

        }
    }

    getTypeNameById(id) {

        for(let i = 0;i < this.itemsArr.length;i++){
            const item = this.itemsArr[i]
            if(item.id === id){
                return item.name
            }
        }
    }

    get itemsArr() {

        if (this._itemsArr === '') {
            return []
        }

        return JSON.parse(this._itemsArr)
    }


}