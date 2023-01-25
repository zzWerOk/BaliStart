import {makeAutoObservable} from "mobx";

export default class MapPointsStore {

    constructor() {
        this._mapPoints = "[]"
        makeAutoObservable(this)
    }


    saveLastDateTableMapPoints(newDate) {
        localStorage.setItem('lastDateTableMapPoints', newDate)
    }

    getSavedLastDateTableMapPoints() {
        return localStorage.getItem("lastDateTableMapPoints")
    }

    get getMapPointList() {
        let rows = JSON.parse(this._mapPoints)
        try {
            return rows
        } catch (e) {
        }
        return null
    }

    setMapPointsListFromArr(newArr) {
        this._mapPoints = JSON.stringify(newArr)
        this.saveMapPointsList()
    }

    saveMapPointsListRows(rows) {
        let textForSave = ''
        rows.map(item => {
            item.isSaved = true
        })
        textForSave = JSON.stringify(rows)
        this._mapPoints = textForSave
        localStorage.setItem('mapPointsPage_listItems', textForSave)
    }

    saveMapPointsList() {
        localStorage.setItem('mapPointsPage_listItems', this._mapPoints)
    }


    loadMapPointsList(){
        this._mapPoints = localStorage.getItem("mapPointsPage_listItems")
    }


    deleteMapPointById(id) {
        try {

            let mapPointsArr = JSON.parse(this._mapPoints)
            const found = mapPointsArr.find(element => element.id === id)
            if (found) {
                const filtered = mapPointsArr.filter(function (value, index, arr) {
                    return value !== found;
                })
                this._mapPoints = JSON.stringify(filtered)
                return true
            }
        } catch (e) {
        }
        return false
    }

    createAndAddMapPointsJson(userId) {
        try {

            let newItem = {
                id: (Date.now() / 1000) * -1,
                name: 'New Map point',
                description: 'Please fill in description',
                topics: '',
                image_logo: '',
                google_map_url: '',
                active: true,
                created_by_user_id: userId,
                created_date: Date.now(),
                file_name: '',
                data: '[]',
                isSaved: false,
            }

            let mapPointsArr = JSON.parse(this._mapPoints)
            mapPointsArr = [...mapPointsArr, newItem]
            this._mapPoints = JSON.stringify(mapPointsArr)
            return true
        } catch (e) {
        }
        return false
    }

    get sort_code() {
        let sortCode = localStorage.getItem("sort_code_MapPoints")
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
        localStorage.setItem('sort_code_MapPoints', value)
    }

}