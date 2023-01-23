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

    saveMapPointsListRows(rows) {
        let textForSave = ''
        rows.map(item => {
            item.isSaved = true
        })
        textForSave = JSON.stringify(rows)
        this._mapPoints = textForSave
        localStorage.setItem('mapPointsPage_listItems', textForSave)
    }

    loadMapPointsList(){
        this._mapPoints = localStorage.getItem("mapPointsPage_listItems")
    }

}