
export default class TopicCL {

    constructor() {
        this._id = -1
        this._name = ''
        this._description = ''
        this._tag = '[]'
        this._image_logo = ''
        this._images = ''
        this._videos = ''
        this._google_map_url = ''
        this._active = true
        this._created_by_user_id = -1
        this._created_date = ''
        this._deleted_by_user_id = -1
        this._deleted_date = ''
        this._data = '[]'
        this._isSaved = true
        this._created_by_user_name = ''
    }

    set isSaved(value){
        this._isSaved = value
    }

    setFromText(text) {
        const itemObj = JSON.parse(text)
        this.setFromJson(itemObj)
    }

    getDescriptionData() {
        let descriptionDataText = null
        const currDataJSONArr = this.dataJSON
        for (let i = 0; i < currDataJSONArr.length; i++) {
            let currDataItem = currDataJSONArr[i]
            if (currDataItem.hasOwnProperty('description')) {
                descriptionDataText = currDataItem.description
                break
            }
        }
        if (!descriptionDataText) {
            this.addNewItemJSON({description: this._description})
            descriptionDataText = this._description
        }
        return descriptionDataText

        // let currDataJSONArr = JSON.parse(this._data)
        // return currDataJSONArr['description'] || ''
    }

    setDescriptionData(newDescriptionDataText) {
        let descriptionDataText = null
        let currDataJSONArr = this.dataJSON
        for (let i = 0; i < currDataJSONArr.length; i++) {
            let currDataItem = currDataJSONArr[i]
            if (currDataItem.hasOwnProperty('description')) {
                currDataItem.description = newDescriptionDataText
                descriptionDataText = currDataItem.description
                break
            }
        }

        if (!descriptionDataText) {
            this.addNewItemJSON({description: newDescriptionDataText})
        }else{
            this._data = JSON.stringify(currDataJSONArr)
        }

        // let currDataJSONArr = JSON.parse(this._data)
        // currDataJSONArr['description'] = newDescriptionDataText
        // this._data = JSON.stringify(currDataJSONArr)
    }


    setFromJson(itemObj) {

        if (itemObj.hasOwnProperty('id')) {
            this._id = itemObj.id
        }
        if (itemObj.hasOwnProperty('name')) {
            this._name = itemObj.name
        }
        if (itemObj.hasOwnProperty('description')) {
            this._description = itemObj.description
        }
        if (itemObj.hasOwnProperty('tag')) {
            this._tag = itemObj.tag
        }
        if (itemObj.hasOwnProperty('image_logo')) {
            this._image_logo = itemObj.image_logo
        }
        if (itemObj.hasOwnProperty('images')) {
            this._images = itemObj.images
        }
        if (itemObj.hasOwnProperty('videos')) {
            this._videos = itemObj.videos
        }
        if (itemObj.hasOwnProperty('google_map_url')) {
            this._google_map_url = itemObj.google_map_url
        }
        if (itemObj.hasOwnProperty('active')) {
            this._active = itemObj.active
        }
        if (itemObj.hasOwnProperty('created_by_user_id')) {
            this._created_by_user_id = itemObj.created_by_user_id
        }
        if (itemObj.hasOwnProperty('created_date')) {
            this._created_date = itemObj.created_date
        }
        if (itemObj.hasOwnProperty('deleted_by_user_id')) {
            this._deleted_by_user_id = itemObj.deleted_by_user_id
        }
        if (itemObj.hasOwnProperty('deleted_date')) {
            this._deleted_date = itemObj.deleted_date
        }
        if (itemObj.hasOwnProperty('data')) {
            this._data = itemObj.data
        }
        if (itemObj.hasOwnProperty('isSaved')) {
            this.isSaved = itemObj.isSaved
        }
        if (itemObj.hasOwnProperty('created_by_user_name')) {
            this._created_by_user_name = itemObj.created_by_user_name
        }
    }

    getAsJson() {
        try {

            let itemObj = {
                "id": this._id,
                "name": this._name,
                "description": this._description,
                "tag": this._tag,
                "image_logo": this._image_logo,
                "images": this._images,
                "videos": this._videos,
                "google_map_url": this._google_map_url,
                "active": this._active,
                "created_by_user_id": this._created_by_user_id,
                "created_date": this._created_date,
                "deleted_by_user_id": this._deleted_by_user_id,
                "deleted_date": this._deleted_date,
                "data": this._data,
                "isSaved": this._isSaved,
                "created_by_user_name": this._created_by_user_name,
            }

            if(this.hasOwnProperty('newId')){
                itemObj.newId = this['newId']
            }

            return itemObj
        } catch (e) {
        }

        return null
    }


    set id(value) {
        this._id = value;
    }

    set name(value) {
        this._name = value;
    }

    set description(value) {
        this._description = value;
    }

    set tag(value) {
        this._tag = value;
    }

    set image_logo(value) {
        this._image_logo = value;
    }

    set images(value) {
        this._images = value;
    }

    set videos(value) {
        this._videos = value;
    }

    set google_map_url(value) {
        this._google_map_url = value;
    }

    set active(value) {
        this._active = value;
    }

    set created_by_user_id(value) {
        this._created_by_user_id = value;
    }

    set created_date(value) {
        this._created_date = value;
    }

    set deleted_by_user_id(value) {
        this._deleted_by_user_id = value;
    }

    set deleted_date(value) {
        this._deleted_date = value;
    }

    set data(value) {
        this._data = value;
    }


    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    get description() {
        return this._description;
    }

    get tag() {
        return this._tag;
    }

    get tagJSON() {
        if(this._tag !== null && this._tag !== undefined) {
            try {
                return JSON.parse(this._tag)
            }catch (e) {}
        }
        return []
    }

    get image_logo() {
        return this._image_logo;
    }

    get images() {
        return this._images;
    }

    get videos() {
        return this._videos;
    }

    get google_map_url() {
        return this._google_map_url;
    }

    get active() {
        return this._active;
    }

    get created_by_user_id() {
        return this._created_by_user_id;
    }

    get created_date() {
        return this._created_date;
    }

    get deleted_by_user_id() {
        return this._deleted_by_user_id;
    }

    get deleted_date() {
        return this._deleted_date;
    }

    get data() {
        return this._data;
    }

    get dataJSON() {
        return JSON.parse(this._data);
    }

    addNewItemJSON(obj) {

        try {
            let newItemsArr = JSON.parse(this._data)
            newItemsArr.push(obj)
            this._data = JSON.stringify(newItemsArr)
            return true
        } catch (e) {
        }
        return false

    }

}