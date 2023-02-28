import {makeAutoObservable} from "mobx";

export default class TopicsStore {

    constructor() {
        this._isLoaded = false
        this._topicsList = "[]"
        makeAutoObservable(this)
    }


    get tag_search() {
        return localStorage.getItem("tag_search_Topics")

    }

    set tag_search(value) {
        localStorage.setItem('tag_search_Topics', value)

    }

    get sort_code() {
        let sortCode = localStorage.getItem("sort_code_Topics")
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
        localStorage.setItem('sort_code_Topics', value)
    }



    filterAgentsByTag(tagId) {

        const newArr = JSON.parse(this._topicsList).filter(function (value) {
            return value.id !== tagId
        })


        this._topicsList = JSON.stringify(newArr)
    }

    saveLastDateTableAgents(newDate) {
        this._lastDateTableUser = newDate
        localStorage.setItem('lastDateTableAgents', newDate)
    }

    getSavedLastDateTableAgents() {
        // if (this._lastDateTableUser === -1) {
        //     this._lastDateTableUser = localStorage.getItem("lastDateTableAgents")
        // }
        // return this._lastDateTableUser
        return localStorage.getItem("lastDateTableAgents")
    }

    saveAgentsListRows(rows) {
        let textForSave
        rows.map(item => {
            item.isSaved = true
        })
        textForSave = JSON.stringify(rows)
        this._topicsList = textForSave
        localStorage.setItem('agentsPage_listItems', textForSave)
        this._isLoaded = true
    }

    loadAgentsList() {
        this._topicsList = localStorage.getItem("agentsPage_listItems")
    }

    saveAgentsList() {
        localStorage.setItem('agentsPage_listItems', this._topicsList)
        this._isLoaded = true
    }

    setListFromArr(newArr) {
        this._topicsList = JSON.stringify(newArr)
        this.saveAgentsList()
    }

    get getAgentsList() {
        let rows = JSON.parse(this._topicsList)
        try {
            return rows
        } catch (e) {
        }
        return []
    }

    get getSavedAgents_List() {
        const savedTopicsList = localStorage.getItem("agentsPage_listItems")

        let rows = JSON.parse(savedTopicsList)

        rows.map(item => {
            item.isSaved = true
        })

        try {
            return rows
        } catch (e) {
        }
        return '[]'
    }

    addNewAgentJson(newTopicObj) {
        try {
            let topicsArr = JSON.parse(this._topicsList)
            topicsArr = [...topicsArr, newTopicObj]
            this._topicsList = JSON.stringify(topicsArr)
            return true
        } catch (e) {
        }
        return false
    }

    deleteAgentById(id) {
        try {

            let topicsArr = JSON.parse(this._topicsList)
            const found = topicsArr.find(element => element.id === id)
            if (found) {
                const filtered = topicsArr.filter(function (value) {
                    return value !== found;
                })
                this._topicsList = JSON.stringify(filtered)
                return true
            }
        } catch (e) {
        }
        return false
    }

    createAndAddNewAgentJson(userId) {
        try {
            let newItem = {
                id: (Date.now() / 1000) * -1,
                name: 'New topic',
                description: 'Please fill in the data',
                tag: '[]',
                image_logo: '',
                images: '[]',
                videos: '[]',
                google_map_url: '',
                active: true,
                created_by_user_id: userId,
                created_date: Date.now(),
                deleted_by_user_id: -1,
                deleted_date: 0,
                data: '[]',
                isSaved: false,
            }

            let topicsArr = JSON.parse(this._topicsList)
            topicsArr = [...topicsArr, newItem]
            this._topicsList = JSON.stringify(topicsArr)
            return true
        } catch (e) {
        }
        return false
    }

}