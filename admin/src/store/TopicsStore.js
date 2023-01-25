import {makeAutoObservable} from "mobx";

export default class TopicsStore {

    constructor() {
        this._topicsList = "[]"
        // this._tag_search = "[]"
        // this._sort_code = "[]"
        makeAutoObservable(this)
    }


    get tag_search() {
        return localStorage.getItem("tag_search_Topics")

        // return this._tag_search;
    }

    set tag_search(value) {
        localStorage.setItem('tag_search_Topics', value)

        // this._tag_search = value;
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

    sortTopicsBy(code) {

        let newArr = JSON.parse(this._topicsList)

        switch (code) {
            case 'user':
                newArr.sort((a, b) => (a.created_by_user_id > b.created_by_user_id) ? 1 : ((b.created_by_user_id > a.created_by_user_id) ? -1 : 0))
                break
            case 'date':
                newArr.sort((a, b) => (a.created_date > b.created_date) ? 1 : ((b.created_date > a.created_date) ? -1 : 0))
                break
            case 'id':
                newArr.sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0))
                break
        }

        this._topicsList = JSON.stringify(newArr)
    }

    filterTopicsByTag(tagId) {

        const newArr = JSON.parse(this._topicsList).filter(function (value, index, arr) {
            return value.id !== tagId
        })


        this._topicsList = JSON.stringify(newArr)
    }

    saveLastDateTableTopics(newDate) {
        this._lastDateTableUser = newDate
        localStorage.setItem('lastDateTableTopics', newDate)
    }

    getSavedLastDateTableTopics() {
        // if (this._lastDateTableUser === -1) {
        //     this._lastDateTableUser = localStorage.getItem("lastDateTableTopics")
        // }
        // return this._lastDateTableUser
        return localStorage.getItem("lastDateTableTopics")
    }

    saveTopicsListRows(rows) {
        let textForSave = ''
        rows.map(item => {
            item.isSaved = true
        })
        textForSave = JSON.stringify(rows)
        this._topicsList = textForSave
        localStorage.setItem('topicsPage_listItems', textForSave)
    }

    loadTopicsList() {
        this._topicsList = localStorage.getItem("topicsPage_listItems")
    }

    saveTopicsList() {
        localStorage.setItem('topicsPage_listItems', this._topicsList)
    }

    setListFromArr(newArr) {
        this._topicsList = JSON.stringify(newArr)
        this.saveTopicsList()
    }

    get getTopicsList() {
        let rows = JSON.parse(this._topicsList)
        try {
            return rows
        } catch (e) {
        }
        return null
    }

    get getSavedTopics_List() {
        const savedTopicsList = localStorage.getItem("topicsPage_listItems")

        let rows = JSON.parse(savedTopicsList)

        rows.map(item => {
            item.isSaved = true
        })

        try {
            return rows
        } catch (e) {
        }
        return null
    }

    addNewTopicJson(newTopicObj) {
        try {
            let topicsArr = JSON.parse(this._topicsList)
            topicsArr = [...topicsArr, newTopicObj]
            this._topicsList = JSON.stringify(topicsArr)
            return true
        } catch (e) {
        }
        return false
    }

    deleteTopicById(id) {
        try {

            let topicsArr = JSON.parse(this._topicsList)
            const found = topicsArr.find(element => element.id === id)
            if (found) {
                const filtered = topicsArr.filter(function (value, index, arr) {
                    return value !== found;
                })
                this._topicsList = JSON.stringify(filtered)
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