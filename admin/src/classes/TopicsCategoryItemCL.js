export default class TopicsCategoryItemCL {

    constructor(name, description, isEdited) {
        this._name = name
        this._description = description
        this._isEdited = isEdited
    }

    get name(){
        return this._name
    }

    get description(){
        return this._description
    }

    set isEdited(edited){
        this._isEdited = edited
    }

    get isEdited(){
        return this._isEdited
    }

}