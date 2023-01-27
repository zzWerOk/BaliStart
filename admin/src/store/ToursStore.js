import {makeAutoObservable} from "mobx";

export default class ToursStore {

    constructor() {
        this._toursList = "[]"
        makeAutoObservable(this)
    }

    get tag_search() {
        return localStorage.getItem("tag_search_Tours")
    }

    set tag_search(value) {
        localStorage.setItem('tag_search_Tours', value)
    }

    get sort_code() {
        let sortCode = localStorage.getItem("sort_code_Tours")
        if(!sortCode){
            sortCode = 'id'
            this.sort_code = sortCode
        }
        if(sortCode === ''){
            sortCode = 'id'
            this.sort_code = sortCode
        }

        return sortCode
    }

    set sort_code(value) {
        localStorage.setItem('sort_code_Tours', value)
    }

    saveLastDateTableTours(newDate) {
        this._lastDateTableUser = newDate
        localStorage.setItem('lastDateTableTours', newDate)
    }

    getSavedLastDateTableTours() {
        return localStorage.getItem("lastDateTableTours")
    }

    saveToursListRows(rows) {
        let textForSave = ''
        rows.map(item => {
            item.isSaved = true
        })
        textForSave = JSON.stringify(rows)
        this._toursList = textForSave
        localStorage.setItem('toursPage_listItems', textForSave)
    }

    loadToursList() {
        this._toursList = localStorage.getItem("toursPage_listItems")
    }

    saveToursList() {
        localStorage.setItem('toursPage_listItems', this._toursList)
    }

    setListFromArr(newArr) {
        this._toursList = JSON.stringify(newArr)
        this.saveToursList()
    }

    get getTopicsList() {
        let rows = JSON.parse(this._toursList)
        try {
            return rows
        } catch (e) {
        }
        return null
    }

    get getSavedTopics_List() {
        const savedToursList = localStorage.getItem("toursPage_listItems")

        let rows = JSON.parse(savedToursList)

        rows.map(item => {
            item.isSaved = true
        })

        try {
            return rows
        } catch (e) {
        }
        return null
    }

    addNewTourJson(newTourObj) {
        try {
            let toursArr = JSON.parse(this._toursList)
            toursArr = [...toursArr, newTourObj]
            this._toursList = JSON.stringify(toursArr)
            return true
        } catch (e) {
        }
        return false
    }

    deleteTopicById(id) {
        try {

            let toursArr = JSON.parse(this._toursList)
            const found = toursArr.find(element => element.id === id)
            if (found) {
                const filtered = toursArr.filter(function (value, index, arr) {
                    return value !== found;
                })
                this._toursList = JSON.stringify(filtered)
                return true
            }
        } catch (e) {
        }
        return false
    }

    createAndAddNewTopicJson(userId) {
        try {
            let newItem = {
                id: (Date.now() / 1000) * -1,
                name: 'New tour',
                description: 'Please fill in the data',
                image_logo: '',
                active: false,
                created_by_user_id: userId,
                created_date: Date.now(),
                isSaved: false,

                tour_category: '[]',
                tour_type: '[]',
                duration: '1 h',
                activity_level: 1,
                languages: '[]',
            }

            let toursArr = JSON.parse(this._toursList)
            toursArr = [...toursArr, newItem]
            this._toursList = JSON.stringify(toursArr)
            return true
        } catch (e) {
        }
        return false
    }

}