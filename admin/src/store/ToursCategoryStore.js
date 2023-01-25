import {makeAutoObservable} from "mobx";

export default class ToursCategoryStore {

    constructor() {
        this._newItemsName = ''
        this._newItemsDescription = ''
        this._newItemsIsEdited = false
        this._newItemsArr = ''
        this._itemsArr = ''
        this._lastDateTableTopicsCategory = -1

        makeAutoObservable(this)
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

    deleteItem(id) {
        if (id) {

            const newItemPos = this.findPositionNewItem_byId(id)
            const itemPos = this.findPositionItem_byId(id)

            if(newItemPos > -1) {
                this.newItemsArr.splice(newItemPos, 1)
            }

            if(itemPos > -1) {
                this.itemsArr.splice(itemPos, 1)
            }

            return true
        }
    }

    editItem(name, description='', is_for_tour=false, id) {
        if (name) {

            // const newItemPos = this.findPositionNewItem_byName(name)
            const newItemPos = this.findPositionNewItem_byId(id)
            // const itemPos = this.findPositionItem_byName(name)
            const itemPos = this.findPositionItem_byId(id)

            if(newItemPos > -1) {
                let newItemsArr = this.newItemsArr
                newItemsArr[newItemPos].category_name = name
                newItemsArr[newItemPos].description = description
                newItemsArr[newItemPos].is_for_tour = is_for_tour
            }

            if(itemPos > -1) {
                let itemsArr = this.itemsArr
                itemsArr[itemPos].category_name = name
                itemsArr[itemPos].description = description
                itemsArr[itemPos].is_for_tour = is_for_tour
            }

            return true
        }
        return false
    }

    get newItemsArr() {
        if (this._newItemsArr === '') {
            return []
        }

        const itm = JSON.parse(this._newItemsArr)

        return itm
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

    findPositionNewItem_byId(id) {
        for(let i = 0;i < this.newItemsArr.length;i++){
            const currItem = this.newItemsArr[i]
            if(currItem.id === id){
                return i
            }
        }
        return -1
    }
    findPositionItem_byId(id) {
        for(let i = 0;i < this.itemsArr.length;i++){
            const currItem = this.itemsArr[i]
            if(currItem.id === id){
                return i
            }
        }
        return -1
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

    saveTopicsCategoryList(data) {
        let newList = []
        if (data) {
            newList = data
            this._newItemsArr = ''
            this._itemsArr = JSON.stringify(newList)
        }else{
            newList.push.apply(newList, this.itemsArr)
        }

        if (this.newItemsArr.length > 0) {
            newList.push.apply(newList, this.itemsArr)
            newList.push.apply(newList, this.newItemsArr)
        }


        let textForSave = ''

        textForSave = JSON.stringify(newList)

        localStorage.setItem('topicsCategoryPage_listItems', textForSave)
    }

    getSavedTopicsCategoryList() {
        this._itemsArr = localStorage.getItem("topicsCategoryPage_listItems")
        this._newItemsArr = ''

        // console.log(localStorage.getItem("topicsCategoryPage_listItems"))

        try {
            // return JSON.parse(this.itemsArr)
            return this.itemsArr
        } catch (e) {
        }
        return null
    }


    getSavedLastDateTableTopicsCategory() {
        if (this._lastDateTableTopicsCategory === -1) {
            this._lastDateTableTopicsCategory = localStorage.getItem("lastDateTableTopicsCategory")
        }
        return this._lastDateTableTopicsCategory
    }

    saveLastDateTableTopicsCategory(newDate) {
        this._lastDateTableTopicsCategory = newDate
        localStorage.setItem('lastDateTableTopicsCategory', newDate)
    }


}