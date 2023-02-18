
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
        this._active = true

        this._tour_category = '[]'
        this._tour_type = '[]'
        this._duration = '1 h'
        this._activity_level = 1
        this._languages = '[]'
        this._map_points = '[]'
        // this._includes = '[]'
        this._data = '{}'
        this._guide_can_add = '{}'
        this._selected_guides = '[]'
        this._price_usd = 0
    }


    get price_usd() {
        return this._price_usd;
    }

    set price_usd(value) {
        this._price_usd = value;
    }

    get selected_guides() {
        return this._selected_guides;
    }

    set selected_guides(value) {
        this._selected_guides = value;
    }

    get guide_can_add() {
        return this._guide_can_add;
    }

    set guide_can_add(value) {
        this._guide_can_add = value;
    }

    get data() {
        return this._data;
    }

    set data(value) {
        this._data = value;
    }

    get tourIncludes() {
        return JSON.parse(this._data)['includes']
    }

    set tourIncludes(value) {
        let dataJson = JSON.parse(this._data)
        dataJson['includes'] = value
        this._data = JSON.stringify(dataJson)
    }

    get tourImages() {
        // const dataJSON = JSON.parse(this._data)
        // if(dataJSON.hasOwnProperty('images')) {
        //     return dataJSON['images']
        // }else{
        //     return '[]'
        // }

        return JSON.parse(this._data)['images'] || '[]'
    }

    set tourImages(value) {
        let dataJson = JSON.parse(this._data)
        dataJson['images'] = value
        this._data = JSON.stringify(dataJson)
    }

    get tourNotIncludes() {
        return JSON.parse(this._data)['notincludes']
    }

    set tourNotIncludes(value) {
        let dataJson = JSON.parse(this._data)
        dataJson['notincludes'] = value
        this._data = JSON.stringify(dataJson)
    }

    get tour_categoryJSON() {
        return JSON.parse(this._tour_category)
    }

    get tour_typeJSON() {
        return JSON.parse(this._tour_type)
    }

    set isSaved(value) {
        this._isSaved = value
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
        if (itemObj.hasOwnProperty('active')) {
            this._active = itemObj.active
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
        if (itemObj.hasOwnProperty('tour_type')) {
            this._tour_type = itemObj.tour_type
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
        if (itemObj.hasOwnProperty('map_points')) {
            this._map_points = itemObj.map_points
        }
        if (itemObj.hasOwnProperty('data')) {
            this._data = itemObj.data
        }
        if (itemObj.hasOwnProperty('guide_can_add')) {
            this._guide_can_add = itemObj.guide_can_add
        }
        if (itemObj.hasOwnProperty('selected_guides')) {
            this._selected_guides = itemObj.selected_guides
        }
        if (itemObj.hasOwnProperty('price_usd')) {
            this._price_usd = itemObj.price_usd
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
                "active": this._active,
                "tour_category": this._tour_category,
                "tour_type": this._tour_type,
                "duration": this._duration,
                "activity_level": this._activity_level,
                "languages": this._languages,
                "map_points": this._map_points,
                "data": this._data,
                "guide_can_add": this._guide_can_add,
                "price_usd": this._price_usd,
            }

            if (this.hasOwnProperty('newId')) {
                itemObj.newId = this['newId']
            }

            return itemObj
        } catch (e) {
        }

        return null
    }


    get map_points() {
        return this._map_points;
    }

    set map_points(value) {
        this._map_points = value;
    }

    get active() {
        return this._active;
    }

    set active(value) {
        this._active = value;
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