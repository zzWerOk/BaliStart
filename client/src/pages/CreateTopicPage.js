import React, {useCallback, useContext, useEffect, useState} from 'react';
import FeedTopBar from "../components/mainpage/FeedTopBar";
import {Button, Col, Row} from "react-bootstrap";
import BaliInput from "../components/balicreatetopic/BaliInput";
import BaliTextArea from "../components/balicreatetopic/BaliTextArea";
import {Context} from "../index";
import {getAll} from "../http/topicsCategoryAPI";
import BaliSelect from "../components/balicreatetopic/BaliSelect";
import BaliFileUpload from "../components/balicreatetopic/BaliFileUpload";
import BaliAddNewElementBtn from "../components/balicreatetopic/BaliAddNewElementBtn";
import {addNewElementItems, getNewTopicElement, getNewTopicElementTitleByType} from "../utils/consts";
import BaliNewTopicElement from "../components/balicreatetopic/BaliNewTopicElement";
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import BaliTextComponents from "../components/balicreatetopic/elements/BaliTextComponents";
import BaliCommentComponent from "../components/balicreatetopic/elements/BaliCommentComponent";
import BaliListComponent from "../components/balicreatetopic/elements/BaliListComponent";
import BaliLinksComponent from "../components/balicreatetopic/elements/BaliLinksComponent";
import BaliPhoneComponent from "../components/balicreatetopic/elements/BaliPhoneComponent";
import BaliEmailComponent from "../components/balicreatetopic/elements/BaliEmailComponent";
import BaliImagesComponent from "../components/balicreatetopic/elements/BaliImagesComponent";
import BaliGoogleMapUrlComponent from "../components/balicreatetopic/elements/BaliGoogleMapUrlComponent";
import BaliLineComponent from "../components/balicreatetopic/elements/BaliLineComponent";
import TopicDetails from "./TopicDetails";
import {changeTopicAPI, getTopicData, saveTopicAPI} from "../http/topicsAPI";

class NewTopicCl {
    constructor() {

        this._id = -1
        this._name = ''
        this._description = ''
        this._tag = '[]'
        this._image_logo = ''
        this._created_date = ''
        this._data = []
        this._isSaved = true
        this._created_by_user_name = ''

    }

    clearData() {
        localStorage.setItem('createNewTopic', '')
    }

    loadFromCache(topicID = '') {
        let dataJson
        let dataText
        try {
            dataText = localStorage.getItem("createNewTopic" + topicID)
            dataJson = JSON.parse(dataText)
        } catch (e) {
        }
        this._id = dataJson._id || -1
        this._name = dataJson._name || ''
        this._description = dataJson._description || ''
        this._tag = dataJson._tag || '[]'
        this._image_logo = dataJson._image_logo || ''
        this._created_date = dataJson._created_date || ''
        if (dataJson._data !== '') {
            this._data = dataJson._data || []
        } else {
            this._data = []
        }
        this._isSaved = dataJson._isSaved || true
        this._created_by_user_name = dataJson._created_by_user_name || ''
        return dataText
    }

    isCache(topicID = '') {
        const localCache = localStorage.getItem("createNewTopic" + topicID)
        return !!(localCache && localCache !== '');
    }

    get id() {
        return this._id;
    }

    _setLocalStorage() {
        localStorage.setItem('createNewTopic' + (this._id === -1 ? '' : this._id), JSON.stringify(this))
    }

    set id(value) {
        this._id = value;
        this._setLocalStorage()
        // localStorage.setItem('createNewTopic' + (this._id === -1 ? '' : this._id), JSON.stringify(this))
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
        this._setLocalStorage()
        // localStorage.setItem('createNewTopic' + (this._id === -1 ? '' : this._id), JSON.stringify(this))
    }


    get description() {
        return this._description;
    }

    set description(value) {
        this._description = value;
        this._setLocalStorage()
        // localStorage.setItem('createNewTopic' + (this._id === -1 ? '' : this._id), JSON.stringify(this))
    }

    get categories() {
        return this._tag;
    }

    set categories(value) {
        try {
            const valueJson = JSON.parse(value)
            if (value !== null && value !== undefined && valueJson.length > 0 && valueJson[0] !== 'undefined') {
                this._tag = JSON.stringify(valueJson)
            }
        } catch (e) {
        }
        this._setLocalStorage()
        // localStorage.setItem('createNewTopic' + (this._id === -1 ? '' : this._id), JSON.stringify(this))
    }

    get image() {
        return this._image_logo;
    }

    set image(value) {
        this._image_logo = value;
        this._setLocalStorage()
        // localStorage.setItem('createNewTopic' + (this._id === -1 ? '' : this._id), JSON.stringify(this))
    }

    get created_date() {
        return this._created_date;
    }

    set created_date(value) {
        this._created_date = value;
        this._setLocalStorage()
        // localStorage.setItem('createNewTopic' + (this._id === -1 ? '' : this._id), JSON.stringify(this))
    }

    get data() {
        return this._data;
    }

    set data(value) {
        this._data = value;
        this._setLocalStorage()
        // localStorage.setItem('createNewTopic' + (this._id === -1 ? '' : this._id), JSON.stringify(this))
    }

    get isSaved() {
        return this._isSaved;
    }

    set isSaved(value) {
        this._isSaved = value;
        this._setLocalStorage()
        // localStorage.setItem('createNewTopic' + (this._id === -1 ? '' : this._id), JSON.stringify(this))
    }

    get created_by_user_name() {
        return this._created_by_user_name;
    }

    set created_by_user_name(value) {
        this._created_by_user_name = value;
        this._setLocalStorage()
        // localStorage.setItem('createNewTopic' + (this._id === -1 ? '' : this._id), JSON.stringify(this))
    }
}

let newTopic = new NewTopicCl()
let savedTopicToCheck = ''
const CreateTopicPage = (props) => {
    // const {categoryId, topicID} = props

    const {topicsCategoryStore, rightSideBarStore, user} = useContext(Context)

    // const [newTopic, setNewTopic] = useState({id: -1, data: []})

    const [isSaving, setIsSaving] = useState(false)
    const [saveError, setSaveError] = useState(false)
    const [saveAlert, setSaveAlert] = useState(false)

    const [loading, setLoading] = useState(true)
    const [loadingData, setLoadingData] = useState(false)
    const [loadingCat, setLoadingCat] = useState(true)
    const [categoriesItems, setCategoriesItems] = useState([])

    const [newTopicId, setNewTopicId] = useState(-1)
    const [newTopicName, setNewTopicName] = useState('')
    const [newTopicDescription, setNewTopicDescription] = useState('')
    const [newTopicSelectedCategoryId, setNewTopicSelectedCategoryId] = useState('')
    const [newTopicSelectedCategoryLabelText, setNewTopicSelectedCategoryLabelText] = useState('Select topic category')
    const [newTopicImage, setNewTopicImage] = useState('')
    const [imagesAdd, setImagesAdd] = useState({})

    const [savedTopic, setSavedTopic] = useState('')
    const [isTopicChanged, setIsTopicChanged] = useState(false)

    const [newTopicNameError, setNewTopicNameError] = useState(false)
    const [newTopicDescriptionError, setNewTopicDescriptionError] = useState(false)
    const [newTopicSelectedCategoryIdError, setNewTopicSelectedCategoryIdError] = useState(false)

    const [newTopicDataElements, setNewTopicDataElements] = useState([])

    const [isDragDisables, setIsDragDisables] = useState(false)

    const [isPreview, setIsPreview] = useState(false)

    const [isHasCache_doLoading, setIsHasCache_doLoading] = useState(false)

    useEffect(() => {

        rightSideBarStore.clear()
        // rightSideBarStore.barTitle = 'Side bar'
        rightSideBarStore.addBR()
        rightSideBarStore.addBtn('Preview', `btn btn-info ${(isPreview || isSaving) ? 'disabled' : ''}`, openPreview)
        rightSideBarStore.addBtn('Save', `btn ${saveError ? 'btn-danger' : (isTopicChanged ? 'btn-primary' : 'btn-secondary')}  ${(!isPreview || isSaving) ? 'disabled' : ''}`, saveHandler)
        rightSideBarStore.addSnippet('Saved!', ``, `alert-success ${saveAlert ? '' : 'd-none'}`)
        // rightSideBarStore.addBR()
        // rightSideBarStore.addBtn('Delete', `btn btn-danger ${(isSaving) ? 'disabled' : ''} btn-rounded`, logAction)

    }, [isPreview, saveError, saveAlert, isTopicChanged])

    useEffect(() => {
        setLoading(true)

        // console.log(props.location.state)

        let topicId = ''
        /** Проверить, был ли передан ID топика **/
        if (props.location.state.hasOwnProperty('topicID')) {
            topicId = props.location.state.topicID
        }
        /** Проверить, был ли передан ID категории **/
        if (props.location.state.hasOwnProperty('categoryId')) {
            applyTopicSelectedCategoryIdChangeHandler(props.location.state.categoryId)
        }

        /** Если есть значения topicId, то загружаем данные топика **/
        if (topicId !== '' && parseInt(topicId) !== -1) {
            setLoadingData(true)
            getTopicDataHandler(topicId).then()// start
        }
        /** **/
        else
            /** Если есть кэш топика по ID, то предложить загрузить данные **/
        if (newTopic.isCache(topicId)) {
            if (newTopicName === '' && newTopicDescription === '' && newTopicDataElements.length === 0) {
                setIsHasCache_doLoading(true)
            } else {
                loadFromCache(topicId)
                // setIsHasCache_doLoading(false)
            }
        }
        /** **/

        /** Если список категорий не загружен, загрузить его.. **/
        if (!topicsCategoryStore.loaded) {
            const sortCode = localStorage.getItem("sort_code_Categories") || 'alpha'
            getCategoriesData(sortCode, '')
            setLoading(false)
        } else {
            setCatItems()// start
            setLoading(false)
        }
        /** **/

    }, [])

    const setCatItems = () => {
        // setLoadingCat(true)
        const currCatArr = topicsCategoryStore.getSavedCategoriesList()
        const newCatItems = [{name: '', code: ''}]
        if (currCatArr) {
            if (currCatArr.length > 0) {
                currCatArr.map(function (item) {

                    newCatItems.push({name: item.category_name, code: item.id})

                })
            }
        }

        setCategoriesItems(JSON.parse(JSON.stringify(newCatItems)))
        setLoadingCat(false)
    }

    const getCategoriesData = (sortCode, search) => {
        getAll(sortCode, search).then(data => {
            topicsCategoryStore.saveCategoriesList(JSON.parse(JSON.stringify(data.rows)))
        }).catch(() => {
            topicsCategoryStore.saveCategoriesList([])
        }).finally(() => {
            setCatItems()// getAll
            // setLoading(false)
        })

    }

    const newTopicNameChangeHandler = (text) => {
        setNewTopicName(text)
        setNewTopicNameError(false)
        newTopic.name = text
        setIsHasCache_doLoading(false)

        checkIfChanged(JSON.stringify(newTopic))
    }

    const newTopicDescriptionChangeHandler = (text) => {

        setNewTopicDescription(text)
        setNewTopicDescriptionError(false)
        newTopic.description = text
        setIsHasCache_doLoading(false)

        checkIfChanged(JSON.stringify(newTopic))
    }

    const newTopicSelectedCategoryIdChangeHandler = (catId) => {

        // console.log(catId)

        // if (catId !== '-1' || catId !== '') {
        //     setNewTopicSelectedCategoryLabelText('Topic category')
        // } else {
        //     setNewTopicSelectedCategoryLabelText('Select topic category')
        // }
        // setNewTopicSelectedCategoryId(catId)
        // setNewTopicSelectedCategoryIdError(false)
        applyTopicSelectedCategoryIdChangeHandler(catId)
        newTopic.categories = JSON.stringify([catId])
        setIsHasCache_doLoading(false)
        checkIfChanged(JSON.stringify(newTopic))
    }

    const applyTopicSelectedCategoryIdChangeHandler = (catId) => {
        if (catId !== '-1' || catId !== '') {
            setNewTopicSelectedCategoryLabelText('Topic category')
        } else {
            setNewTopicSelectedCategoryLabelText('Select topic category')
        }
        setNewTopicSelectedCategoryId(catId)
        setNewTopicSelectedCategoryIdError(false)

        // newTopic.categories = JSON.stringify([catId])
        // setIsHasCache_doLoading(false)
        // checkIfChanged(JSON.stringify(newTopic))
    }

    const newTopicImageChangeHandler = (imageFile, imageUrl) => {
        newTopic.image = imageUrl
        newTopic.imageFile = imageFile
        setIsHasCache_doLoading(false)

        checkIfChanged(JSON.stringify(newTopic))
    }

    const baliAddNewElementHandler = (elementCode) => {
        const currElementsArr = JSON.parse(JSON.stringify(newTopicDataElements))

        for (let i = 0; i < addNewElementItems.length; i++) {
            const currElement = addNewElementItems[i]
            if (elementCode === currElement.type) {
                const newElementByCode = getNewTopicElement(currElement.type)
                if (newElementByCode) {
                    currElementsArr.push(newElementByCode)
                }
            }
        }

        setNewTopicDataElements(currElementsArr)
        newTopic.data = currElementsArr
        setIsHasCache_doLoading(false)

        checkIfChanged(JSON.stringify(newTopic))
    }

    const dataItemEditHandler = (item) => {
        if (item.hasOwnProperty('index')) {
            let dataArr = JSON.parse(JSON.stringify(newTopicDataElements))
            const itemIndex = item.index
            // if ((dataArr.length - 1) < itemIndex) {
            //     dataArr.push({})
            // }
            dataArr[itemIndex] = item

            setNewTopicDataElements(dataArr)

            newTopic.data = dataArr
            setIsHasCache_doLoading(false)

            checkIfChanged(JSON.stringify(newTopic))
        }
    }

    const onFilesAddHandler = (fileName, imageListIndex) => {

        if (fileName) {
            let currImagesList = imagesAdd
            if (!currImagesList.hasOwnProperty(imageListIndex)) {
                currImagesList[imageListIndex] = {}
            }
            let currList = currImagesList[imageListIndex]

            // let isThere = false
            // Object.keys(currList).forEach(function (key) {
            //     let currFile = currList[key]
            //     if (currFile.name === fileName.name &&
            //         currFile.lastModified === fileName.lastModified &&
            //         currFile.size === fileName.size &&
            //         currFile.type === fileName.type) {
            //         isThere = true
            //     }
            // });

            // if (!isThere) {
            currList[Object.keys(currList).length] = fileName
            currImagesList[imageListIndex] = currList
            setImagesAdd(currImagesList)


            const objectUrl = URL.createObjectURL(fileName)

            const images = JSON.parse(newTopic.data[imageListIndex].items)
            images.push(objectUrl)
            let topicData = newTopic.data
            topicData[imageListIndex].items = JSON.stringify(images)
            // newTopic.data[imageListIndex].items = JSON.stringify(images)
            newTopic.data = topicData

            setIsHasCache_doLoading(false)
            // }
            // return !isThere

            checkIfChanged(JSON.stringify(newTopic))

            return true
        }
    }

    const onFilesDeleteHandler = (imageListIndex, imageIndex) => {
        let currImagesList = imagesAdd
        if (!currImagesList.hasOwnProperty(imageListIndex)) {
            currImagesList[imageListIndex] = {}
        }
        let currList = currImagesList[imageListIndex]
        delete currList[imageIndex]

        let newCurrList = {}
        Object.keys(currList).forEach(function (key) {
            newCurrList[Object.keys(newCurrList).length] = currList[key]
        });


        let topicData = newTopic.data
        const images = JSON.parse(topicData[imageListIndex].items)

        delete images[imageIndex]

        topicData[imageListIndex].items = JSON.stringify(images)
        newTopic.data = topicData


        currImagesList[imageListIndex] = newCurrList
        setImagesAdd(currImagesList)

        checkIfChanged(JSON.stringify(newTopic))
    }

    const onDragEnd = useCallback((params) => {
        const srcIndex = params.source.index
        const dstIndex = params.destination?.index

        if (dstIndex !== null) {
            if (dstIndex !== undefined) {
                let elementsArr = JSON.parse(JSON.stringify(newTopicDataElements))
                elementsArr.splice(dstIndex, 0, elementsArr.splice(srcIndex, 1)[0])

                setNewTopicDataElements(elementsArr)
                newTopic.data = elementsArr
                checkIfChanged(JSON.stringify(newTopic))
            }
        }
    }, [newTopicDataElements]);

    const deleteDataItemByIndex = (index) => {
        const currElementsArr = JSON.parse(JSON.stringify(newTopicDataElements))

        const currItem = currElementsArr[index]

        const filtered = currElementsArr.filter(function (value) {
            return value !== currItem;
        })

        setNewTopicDataElements(filtered)
        newTopic.data = filtered
        setIsHasCache_doLoading(false)

        checkIfChanged(JSON.stringify(newTopic))
    }

    const changeItemTypeByIndex = (newType, index) => {

        const currElementsArr = JSON.parse(JSON.stringify(newTopicDataElements))

        let newElement = null

        for (let i = 0; i < addNewElementItems.length; i++) {
            const currElement = addNewElementItems[i]
            if (newType === currElement.type) {
                newElement = getNewTopicElement(currElement.type)
                break
            }
        }

        if (newElement !== null) {
            const prevElement = JSON.parse(JSON.stringify(currElementsArr[index]))
            if (prevElement.hasOwnProperty('name') && newElement.hasOwnProperty('name')) {
                newElement.name = prevElement.name
            }
            currElementsArr[index] = newElement

            setNewTopicDataElements(currElementsArr)
            newTopic.data = currElementsArr
            setIsHasCache_doLoading(false)
        }

        checkIfChanged(JSON.stringify(newTopic))

    }

    const isDragDisableHandler = (value) => {
        setIsDragDisables(value)
    }

    const closePreview = () => {
        setIsPreview(false)
        setSavedTopic(null)

        setNewTopicNameError(false)
        setNewTopicSelectedCategoryIdError(false)
        setNewTopicDescriptionError(false)

        setSaveError(false)
        setSaveAlert(false)

    }

    const openPreview = () => {
        let isError = false

        if (!newTopic.name && !newTopic.description && !newTopic.categories) {
            newTopic.name = newTopicName
            newTopic.categories = JSON.stringify([newTopicSelectedCategoryId])
            newTopic.description = newTopicDescription
            newTopic.image = newTopicImage
            newTopic.id = newTopicId
            newTopic.data = newTopicDataElements
        }

        if (!newTopic.name || newTopic.name.length === 0) {
            setNewTopicNameError(true)
            isError = true
        }
        if (!newTopic.categories || newTopic.categories === '[""]') {
            setNewTopicSelectedCategoryIdError(true)
            isError = true
        }
        if (!newTopic.description || newTopic.description.length === 0) {
            setNewTopicDescriptionError(true)
            isError = true
        }

        if (isError) {
            return
        }

        const newTopicJson = {}

        newTopicJson.name = newTopic.name
        newTopicJson.categories = newTopic.categories
        newTopicJson.commentsCount = 0
        newTopicJson.created_date = Date.now()
        newTopicJson.description = newTopic.description
        newTopicJson.image = newTopic.image
        newTopicJson.imageFile = newTopic.imageFile

        newTopicJson.userName = user.name
        newTopicJson.data = newTopic.data

        setSavedTopic(JSON.stringify(newTopicJson))
        setIsPreview(true)

    }


    const checkIfChanged = (currTopicToCheck) => {
        if (currTopicToCheck !== savedTopicToCheck) {
            setIsTopicChanged(true)
        } else {
            setIsTopicChanged(false)
        }

    }

    const getTopicDataHandler = async (id) => {
        setIsSaving(true)
        if (id > -1) {
            await getTopicData(id).then(data => {

                newTopic.id = id

                newTopicNameChangeHandler(JSON.parse(data).name)
                newTopicDescriptionChangeHandler(JSON.parse(data).description)
                newTopicSelectedCategoryIdChangeHandler(JSON.parse(JSON.parse(data).categories)[0] + '')
                newTopicImageChangeHandler('', JSON.parse(data).image)
                setNewTopicImage(JSON.parse(data).image + '?' + Date.now())

                newTopic.userName = JSON.parse(data).userName
                setNewTopicId(id)

                setNewTopicDataElements(JSON.parse(data).data)
                newTopic.data = JSON.parse(data).data

                // JSON.parse(data).data.map(item => {
                //     console.log(item)
                //     dataItemEditHandler(item)
                // })

            }).finally(() => {
                savedTopicToCheck = JSON.stringify(newTopic)
                checkIfChanged(JSON.stringify(newTopic))

                setIsSaving(false)
                setLoadingData(false)
            })
        } else {
            setIsSaving(false)
        }
    }

    const setSaveOkAlert = () => {
        setSaveAlert(true)

        setTimeout(() => {
            setSaveAlert(false)
        }, 3000)

    }

    const saveHandler = () => {

        setIsSaving(true)
        setSaveError(false)

        if (newTopic.id < 0) {
            saveTopicAPI(
                newTopic.name,
                newTopic.description,
                newTopic.categories,
                newTopic.image,
                user.id, //newTopic.created_by_user_id,
                Date.now(), //newTopic.created_date,
                JSON.stringify(newTopic.data), //newTopic.data,
                newTopic.imageFile,
                imagesAdd,
            ).then(data => {
                if (data.hasOwnProperty('status')) {
                    if (data.status === 'ok') {
                        newTopic.id = data.id
                        setNewTopicId(data.id)
                        setSaveError(false)
                        setSaveOkAlert()

                        newTopic.imageFile = null

                        // if (data.hasOwnProperty('image_logo')) {
                        //     newTopic.image = data.image_logo
                        //     newTopic.imageFile = null
                        //     setNewTopicImage(data.image_logo + '?' + Date.now())
                        // }
                        getTopicDataHandler(data.id).then()// save
                    } else {
                        setSaveError(true)
                        setSaveAlert(false)
                    }
                } else {
                    setSaveError(true)
                    setSaveAlert(false)
                }
            }).catch(() => {
                setSaveError(true)
                setSaveAlert(false)
            }).finally(() => {
                // setIsSaving(false)
            })
        } else {
            changeTopicAPI(
                newTopic.id,
                newTopic.name,
                newTopic.description,
                newTopic.categories,
                newTopic.image,
                user.id, //newTopic.created_by_user_id,
                Date.now(), //newTopic.created_date,
                JSON.stringify(newTopic.data), //newTopic.data,
                newTopic.imageFile,
                imagesAdd,
            ).then(data => {
                if (data.hasOwnProperty('status')) {
                    if (data.status === 'ok') {
                        setSaveError(false)
                        setSaveOkAlert()

                        newTopic.imageFile = null

                        // if (data.hasOwnProperty('image_logo')) {
                        //     newTopic.image = data.image_logo
                        //     newTopic.imageFile = null
                        //     setNewTopicImage(data.image_logo + '?' + Date.now())
                        // }
                        getTopicDataHandler(newTopic.id).then()// change
                    } else {
                        setSaveError(true)
                        setSaveAlert(false)
                    }
                } else {
                    setSaveError(true)
                    setSaveAlert(false)
                }
            }).catch(() => {
                setSaveError(true)
                setSaveAlert(false)
            }).finally(() => {
                // setIsSaving(false)
            })
        }
    }

    const loadFromCache = (topicID = '') => {

        savedTopicToCheck = newTopic.loadFromCache(topicID)
        setNewTopicId(newTopic.id)
        setNewTopicName(newTopic.name)

        setNewTopicDescription(newTopic.description)
        try {
            const catsArr = JSON.parse(newTopic.categories)
            if (catsArr.length > 0) {
                newTopicSelectedCategoryIdChangeHandler(JSON.parse(newTopic.categories)[0] + "")
            }
        } catch (e) {
        }

        setNewTopicImage(newTopic.image)

        newTopic.data.map(item => {
            dataItemEditHandler(item)
        })
        setIsHasCache_doLoading(false)
    }

    if (loading || loadingCat || loadingData) {
    } else {

        return (

            <>
                {
                    isPreview
                        ?
                        <TopicDetails
                            savedTopic={savedTopic}
                            closePreview={closePreview}
                        />
                        :
                        null
                }
                <div style={{display: isPreview ? 'none' : ''}}
                >
                    <div
                        style={{marginTop: '20px', flex: '1'}}
                    >
                        <FeedTopBar
                            isBackBtn={true}
                            backBtnTitle={'Back'}
                        />

                        {
                            isHasCache_doLoading
                                ?
                                <Row className={'px-5 py-3'}>
                                    <Button
                                        onClick={() => {
                                            loadFromCache(newTopic.id === -1 ? '' : newTopic.id)
                                        }}
                                    >
                                        Load cache?
                                    </Button>
                                </Row>
                                :
                                null
                        }

                        <div className={'d-flex'}
                             style={{height: 'calc(100vh - 129px'}}
                        >

                            <Col
                                style={{overflowX: 'hidden', overflowY: 'auto'}}
                            >
                                <Row className={`d-flex flex-column align-items-center`}>
                                    <div className={'col-10'}>
                                        {/*<BaliInput key={newTopicName}*/}
                                        <BaliInput key={'name' + isHasCache_doLoading}
                                                   text={newTopicName}
                                                   labelText={'Topic name'}
                                                   onTextChangeHandler={newTopicNameChangeHandler}
                                                   required={true}
                                                   isError={newTopicNameError}
                                        />
                                    </div>
                                    <div className={'col-10'}>
                                        {/*<BaliTextArea key={newTopicDescription}*/}
                                        <BaliTextArea key={'description' + isHasCache_doLoading}
                                                      text={newTopicDescription}
                                                      labelText={'Topic description'}
                                                      onTextChangeHandler={newTopicDescriptionChangeHandler}
                                                      isError={newTopicDescriptionError}
                                        />
                                    </div>
                                    <div className={'col-10'}>
                                        <div className={'col-6'}>
                                            {/*<BaliSelect key={categoriesItems + "" + newTopicSelectedCategoryId}*/}
                                            <BaliSelect key={'cat' + isHasCache_doLoading}
                                                        items={categoriesItems}
                                                        selectedItemCode={newTopicSelectedCategoryId}
                                                        labelText={newTopicSelectedCategoryLabelText}
                                                        onItemSelectHandler={newTopicSelectedCategoryIdChangeHandler}
                                                        isError={newTopicSelectedCategoryIdError}
                                            />
                                        </div>
                                    </div>
                                    <div className={'col-10'}>
                                        {/*<BaliFileUpload key={newTopicImage}*/}
                                        <BaliFileUpload key={'image' + isHasCache_doLoading}
                                                        image={newTopicImage}
                                                        onFileChooseHandler={newTopicImageChangeHandler}
                                        />
                                    </div>

                                </Row>
                                <hr/>
                                <Row>
                                    <DragDropContext
                                        onDragEnd={onDragEnd}
                                    >
                                        <Droppable droppableId="droppable-elements" type="ELEMENTS">
                                            {(provided, _) => (
                                                <div className={`d-flex flex-column align-items-center`}
                                                     ref={provided.innerRef}
                                                     {...provided.droppableProps}
                                                >

                                                    {
                                                        newTopicDataElements.map(function (item, index) {
                                                            if (item.hasOwnProperty('type')) {
                                                                const itemKey = item.type + index + "" + isSaving

                                                                let child = null
                                                                item.index = index
                                                                switch (item.type) {
                                                                    case 'text': {
                                                                        child = <BaliTextComponents
                                                                            item={item}
                                                                            isSaving={isSaving}
                                                                            dataItemEditHandler={dataItemEditHandler}
                                                                        />
                                                                        break
                                                                    }
                                                                    case 'comment': {
                                                                        child = <BaliCommentComponent
                                                                            item={item}
                                                                            isSaving={isSaving}
                                                                            dataItemEditHandler={dataItemEditHandler}
                                                                        />
                                                                        break
                                                                    }
                                                                    case 'list': {
                                                                        child = <BaliListComponent
                                                                            item={item}
                                                                            isSaving={isSaving}
                                                                            dataItemEditHandler={dataItemEditHandler}
                                                                        />
                                                                        break
                                                                    }
                                                                    case 'link': {
                                                                        child = <BaliLinksComponent
                                                                            item={item}
                                                                            isSaving={isSaving}
                                                                            dataItemEditHandler={dataItemEditHandler}
                                                                        />
                                                                        break
                                                                    }
                                                                    case 'email': {
                                                                        child = <BaliEmailComponent
                                                                            item={item}
                                                                            isSaving={isSaving}
                                                                            dataItemEditHandler={dataItemEditHandler}
                                                                        />
                                                                        break
                                                                    }
                                                                    case 'phone': {
                                                                        child = <BaliPhoneComponent
                                                                            item={item}
                                                                            isSaving={isSaving}
                                                                            dataItemEditHandler={dataItemEditHandler}
                                                                        />
                                                                        break
                                                                    }
                                                                    case 'images': {
                                                                        child = <BaliImagesComponent
                                                                            key={isSaving}
                                                                            item={item}
                                                                            index={index}
                                                                            isSaving={isSaving}
                                                                            dataItemEditHandler={dataItemEditHandler}
                                                                            onFilesAddHandler={onFilesAddHandler}
                                                                            onFilesDeleteHandler={onFilesDeleteHandler}
                                                                        />
                                                                        break
                                                                    }
                                                                    case 'googleMapUrl': {
                                                                        child = <BaliGoogleMapUrlComponent
                                                                            item={item}
                                                                            isSaving={isSaving}
                                                                            dataItemEditHandler={dataItemEditHandler}
                                                                        />
                                                                        break
                                                                    }
                                                                    case 'line': {
                                                                        child = <BaliLineComponent
                                                                            item={item}
                                                                            isSaving={isSaving}
                                                                            dataItemEditHandler={dataItemEditHandler}
                                                                        />
                                                                        break
                                                                    }
                                                                }

                                                                return (
                                                                    <Draggable draggableId={"draggable-" + index}
                                                                               index={index}
                                                                               isDragDisabled={!!isDragDisables}
                                                                               key={itemKey}

                                                                    >
                                                                        {(provided) => (
                                                                            <div
                                                                                className={'col-10'}
                                                                                ref={provided.innerRef}
                                                                                {...provided.draggableProps}
                                                                                {...provided.dragHandleProps}
                                                                                style={{
                                                                                    ...provided.draggableProps.style,
                                                                                }}

                                                                            >

                                                                                <div className={''}>
                                                                                    <BaliNewTopicElement
                                                                                        index={index}
                                                                                        title={getNewTopicElementTitleByType(item.type)}
                                                                                        dropDownItems={addNewElementItems}
                                                                                        child={child}
                                                                                        isDragDisableHandler={isDragDisableHandler}
                                                                                        itemDeleteHandler={deleteDataItemByIndex}
                                                                                        changeItemTypeByIndex={changeItemTypeByIndex}
                                                                                    />
                                                                                </div>

                                                                            </div>
                                                                        )}
                                                                    </Draggable>

                                                                )
                                                            }
                                                        })
                                                    }
                                                    {provided.placeholder}

                                                </div>
                                            )}
                                        </Droppable>
                                    </DragDropContext>

                                    <BaliAddNewElementBtn items={addNewElementItems}
                                                          onItemSelectHandler={baliAddNewElementHandler}
                                    />

                                </Row>

                            </Col>
                        </div>
                    </div>
                </div>
            </>
        )
        // }
    }
};

export default CreateTopicPage;