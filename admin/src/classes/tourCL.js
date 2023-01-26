import {makeAutoObservable} from "mobx";

export default class TourCL {

    constructor() {
        this._id = -1
        this._name = ''
        this._description = ''
        this._image_logo = ''
        this._created_by_user_id = -1
        this._created_date = ''
        this._isSaved = true
        this._created_by_user_name = ''

        this._tour_category = '[]'
        this._tour_type = '[]'
        this._duration = ''
        this._activity_level = '[]'
        this._languages = '[]'
    }

    get tag() {
        return this._tour_category;
    }

    get tagJSON() {
        return JSON.parse(this._tour_category)
    }

    set isSaved(value) {
        this._isSaved = value
    }

    setFromText(text) {
        const itemObj = JSON.parse(text)
        this.setFromJson(itemObj)
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
        if (itemObj.hasOwnProperty('image_logo')) {
            this._image_logo = itemObj.image_logo
        }
        if (itemObj.hasOwnProperty('created_by_user_id')) {
            this._created_by_user_id = itemObj.created_by_user_id
        }
        if (itemObj.hasOwnProperty('created_date')) {
            this._created_date = itemObj.created_date
        }
        if (itemObj.hasOwnProperty('isSaved')) {
            this.isSaved = itemObj.isSaved
        }
        if (itemObj.hasOwnProperty('created_by_user_name')) {
            this._created_by_user_name = itemObj.created_by_user_name
        }
        if (itemObj.hasOwnProperty('tour_category')) {
            this._tour_category = itemObj.tour_category
        }
        if (itemObj.hasOwnProperty('duration')) {
            this._duration = itemObj.duration
        }
        if (itemObj.hasOwnProperty('activity_level')) {
            this._activity_level = itemObj.activity_level
        }
        if (itemObj.hasOwnProperty('languages')) {
            this._languages = itemObj.languages
        }
    }

    getAsJson() {
        try {

            let itemObj = {
                "id": this._id,
                "name": this._name,
                "description": this._description,
                "image_logo": this._image_logo,
                "created_by_user_id": this._created_by_user_id,
                "created_date": this._created_date,
                "isSaved": this._isSaved,
                "created_by_user_name": this._created_by_user_name,

                "tour_category": this._tour_category,
                "tour_type": this._tour_type,
                "duration": this._duration,
                "activity_level": this._activity_level,
                "languages": this._languages,
            }

            if (this.hasOwnProperty('newId')) {
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

    set image_logo(value) {
        this._image_logo = value;
    }

    set created_by_user_id(value) {
        this._created_by_user_id = value;
    }

    set created_date(value) {
        this._created_date = value;
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

    get image_logo() {
        return this._image_logo;
    }

    get created_by_user_id() {
        return this._created_by_user_id;
    }

    get created_date() {
        return this._created_date;
    }


    get tour_category() {
        return this._tour_category;
    }

    set tour_category(value) {
        this._tour_category = value;
    }

    get tour_type() {
        return this._tour_type;
    }

    set tour_type(value) {
        this._tour_type = value;
    }

    get duration() {
        return this._duration;
    }

    set duration(value) {
        this._duration = value;
    }

    get activity_level() {
        return this._activity_level;
    }

    set activity_level(value) {
        this._activity_level = value;
    }

    get languages() {
        return this._languages;
    }

    set languages(value) {
        this._languages = value;
    }
}