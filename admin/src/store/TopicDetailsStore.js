import {makeAutoObservable} from "mobx";
import TopicCL from "../classes/topicCL";

export default class TopicDetailsStore {

    constructor() {
        this._name = ""
        this._description = ""
        this._items = '[]'
        this._topic = new TopicCL()
        makeAutoObservable(this)
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get description() {
        return this._description;
    }

    set description(value) {
        this._description = value;
    }

    get items() {
        return this._items;
    }

    get itemsJSON() {
        return JSON.parse(this._items);
    }

    setItemsJSON(itemsObj){
        this._items = JSON.stringify(itemsObj)
    }

    addNewItem() {
        try {
            let newItemsArr = this.itemsJSON
            let newItem = {type: 'text', name: '', text: ''}

            newItemsArr.push(newItem)
            this._items = JSON.stringify(newItemsArr)
            return true
        }catch (e) {}
        return false

    }

    addNewItemJSON(obj) {

        try {
            let newItemsArr = this.itemsJSON
            newItemsArr.push(obj)
            this._items = JSON.stringify(newItemsArr)
            return true
        }catch (e) {}
        return false

    }


    set items(value) {
        this._items = value;
    }
}