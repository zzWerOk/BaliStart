import {makeAutoObservable} from "mobx";

export default class TopicsCategoryStore {

    constructor() {
        this._loaded = false

        this._newItemsName = ''
        this._newItemsDescription = ''
        this._newItemsIsEdited = false
        this._newItemsArr = ''
        this._itemsArr = ''
        this._lastDateTableTopicsCategory = -1

        makeAutoObservable(this)
    }


    get loaded() {
        return this._loaded;
    }

    set setName(name) {
        this._newItemsName = name
    }

    get name() {
        return this._newItemsName
    }

    set setDescription(description) {
        this._newItemsDescription = description
    }

    get description() {
        return this._newItemsDescription
    }

    set isEdited(edited) {
        this._newItemsIsEdited = edited
    }

    get isEdited() {
        return this._newItemsIsEdited
    }

    get itemsArr() {

        if (this._itemsArr === '') {
            return []
        }

        return JSON.parse(this._itemsArr)
    }

    addItem(name, description, is_for_tour=false) {
        if (name) {
            const newItem = {
                category_name: name,
                description: description,
                is_for_tour: is_for_tour
            }

            let newItemsArr = this.itemsArr

            let isThere = false
            newItemsArr.map(currItem => {
                if (currItem.category_name.localeCompare(name) === 0) {
                    isThere = true
                }
            })

            if (isThere) {
                return false
            }

            newItemsArr.push(newItem)
            this._itemsArr = JSON.stringify(newItemsArr)

            return true
        }
    }

    get newItemsArr() {
        if (this._newItemsArr === '') {
            return []
        }

        return JSON.parse(this._newItemsArr)
    }

    checkIfNewItemExists(name) {
        let newItemsArr = this.newItemsArr
        let itemsArr = this.itemsArr

        let isThere = false
        newItemsArr.map(currItem => {
            if (currItem.category_name.localeCompare(name) === 0) {
                isThere = true
            }
        })
        if (!isThere) {
            itemsArr.map(currItem => {
                if (currItem.category_name.localeCompare(name) === 0) {
                    isThere = true
                }
            })
        }
        return isThere
    }

    findPositionNewItem_byName(name) {
        for(let i = 0;i < this.newItemsArr.length;i++){
            const currItem = this.newItemsArr[i]
            if(currItem.category_name === name){
                return i
            }
        }
        return -1
    }

    getItemName_byId(id) {

        for(let i = 0;i < this.itemsArr.length;i++){
            const currItem = this.itemsArr[i]
            if(currItem.id + "" === id + ""){
                return currItem.category_name
            }
        }
        return ''
    }
    findPositionItem_byName(name) {
        for(let i = 0;i < this.itemsArr.length;i++){
            const currItem = this.itemsArr[i]
            if(currItem.category_name === name){
                return i
            }
        }
        return -1
    }

    addNewItem(name, description='', is_for_tour=false, id) {
        if (name) {
            if(!this.checkIfNewItemExists(name)) {

                let newItemsArr = this.newItemsArr
                const newItem = {
                    category_name: name,
                    description: description,
                    is_for_tour: is_for_tour,
                    id: id
                }

                if (this.checkIfNewItemExists(name)) {
                    return false
                } else {
                    newItemsArr.push(newItem)
                    this._newItemsArr = JSON.stringify(newItemsArr)
                    return true
                }
            }
            return false
        }
    }

    saveCategoriesList(data) {
        let newList = []
        if (data) {
            newList = data
            this._newItemsArr = ''
            this._itemsArr = JSON.stringify(newList)
            this._loaded = true
        }else{
            newList.push.apply(newList, this.itemsArr)
        }

        if (this.newItemsArr.length > 0) {
            newList.push.apply(newList, this.itemsArr)
            newList.push.apply(newList, this.newItemsArr)
        }


        let textForSave = JSON.stringify(newList)

        localStorage.setItem('topicsCategoryPage_listItems', textForSave)
    }

    getSavedCategoriesList() {
        this._itemsArr = localStorage.getItem("topicsCategoryPage_listItems") || '[]'
        this._newItemsArr = ''

        // console.log(localStorage.getItem("topicsCategoryPage_listItems"))

        try {
            // return JSON.parse(this.itemsArr)
            return this.itemsArr
        } catch (e) {
        }
        return '[]'
    }


    getSavedLastDateTableTopicsCategory() {
        if (this._lastDateTableTopicsCategory === -1) {
            this._lastDateTableTopicsCategory = localStorage.getItem("lastDateTableTopicsCategory") || '0'
        }
        return this._lastDateTableTopicsCategory
    }

    saveLastDateTableTopicsCategory(newDate) {
        this._lastDateTableTopicsCategory = newDate
        localStorage.setItem('lastDateTableTopicsCategory', newDate)
    }


}