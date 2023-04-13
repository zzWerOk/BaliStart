import React, {useContext, useEffect, useState} from 'react';
import {Button, Dropdown, Image, Row, ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import noImageLogo from '../../img/nophoto.jpg'
import {Context} from "../../index";
import {observer} from "mobx-react-lite";

import {ReactComponent as CircleIco} from "../../img/svg/circle.svg"
import {ReactComponent as CircleOkIco} from "../../img/svg/circle_ok.svg"
import {ReactComponent as CloseIco} from "../../img/svg/close.svg"
import SpinnerSM from "../SpinnerSM";
import {delay} from "../../utils/consts";
import {MDBContainer, MDBFile} from "mdb-react-ui-kit";
import {changeTourAPI, deleteTourAPI, getTourData, saveTourAPI, setTourGuideCanAdd} from "../../http/toursAPI";
import TourCL from "../../classes/tourCL";
import ModalPopUp from "../modal/ModalPopUp";
import MapPointsDetailsPage from "../mappoints/MapPointsDetailsPage";

import './TourDetailsPage.css';
import TourTimeLineCollapse from "./components/TourTimeLineCollapse";
import {getMapPointData} from "../../http/mapPointsAPI";
import TourIncludeComponent from "./components/TourIncludeComponent";
import TopicImagesComponent from "../topics/components/TopicImagesComponent";
import {getAll} from "../../http/userAPI";

let durationItems = []

let currTour = null

const TourDetailsPage = observer((props) => {

    const {mapPointsStore, user} = useContext(Context)
    const {item, onItemEditHandler, deleteTopic} = props

    const {toursCategoryStore, toursTypeStore} = useContext(Context)

    const [isSaving, setIsSaving] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [saveError, setSaveError] = useState(false)
    const [deleteError, setDeleteError] = useState(false)
    const [isActive, setIsActive] = useState(true)
    const [currName, setCurrName] = useState('')
    const [currDescription, setCurrDescription] = useState('')
    const [itemImageLogo, setItemImageLogo] = useState('')
    const [newImageLogo, setNewImageLogo] = useState(false)
    const [tourCategoriesItems, setTourCategoriesItems] = useState([])
    const [tourTypesItems, setTourTypesItems] = useState([])
    const [tourTags, setTourTags] = useState([])
    const [tourTypes, setTourTypes] = useState([])
    const [durationTime, setDurationTime] = useState(0)
    const [durationTimeType, setDurationTimeType] = useState('h')
    const [activityType, setActivityType] = useState(1)
    const [tourLanguage, setTourLanguage] = useState('[]')
    const [tourMapPoints, setTourMapPoints] = useState('[]')
    const [tourIncludes, setTourIncludes] = useState('[]')
    const [tourNotIncludes, setTourNotIncludes] = useState('[]')
    const [mapPointsArr, setMapPointsArr] = useState([])
    const [mapPointsArr_Loading, setMapPointsArr_Loading] = useState(false)

    const [showModal, setShowModal] = useState(false)
    const [tourCategoriesItems_load, setTourCategoriesItems_load] = useState(true)

    const [imagesAdd, setImagesAdd] = useState({})
    const [imagesItem, setImagesItem] = useState({name: '', items: '[]'})

    const [isGuideCanAdd, setIsGuideCanAdd] = useState(true)

    const [userList, setUserList] = useState([])
    const [userListFiltered, setUserListFiltered] = useState([])
    const [userListLoading, setUserListLoading] = useState(false)
    const [selectedUserList, setSelectedUserList] = useState([])

    const [tourPriceUsd, setTourPriceUsd] = useState(0)

    const getTourDataF = async () => {

        if (item.id > -1) {
            await getTourData(item.id).then(data => {
                if (data.hasOwnProperty('status')) {
                    if (data.status === 'ok') {
                        item.data = data.data.data
                    }
                }
            }).catch(() => {
                currTour.data = '{}'
            })
        }
    }

    const getUserListHandler = () => {
        if (!userListLoading) {
            setUserListLoading(true)
            getAll().then(data => {
                if (data.hasOwnProperty('count') && data.hasOwnProperty('rows')) {
                    let usersList = []
                    let usersListFiltered = []

                    data.rows.map(function (currUser) {
                        if (currUser.is_guide) {
                            usersList.push(currUser)
                            usersListFiltered.push(currUser.id)
                        }
                    })


                    setUserList(usersList)
                    setUserListFiltered(usersListFiltered)
                }
            }).catch(() => {

            }).finally(() => {
                setUserListLoading(false)
            })
        }
    }

    useEffect(() => {
        currTour = new TourCL()

        getTourDataF().finally(() => {//start
            durationItems = []
            for (let i = 1; i <= 21; i++) {
                durationItems.push({id: i})
            }

            try {

                // setTourCategoriesItems_load(true)
                currTour.setFromJson(item)

                setDurationTime(parseInt(currTour.duration.split(' ')[0]) || 1)
                setDurationTimeType(currTour.duration.split(' ')[1] || 'h')
                setActivityType(parseInt(currTour.activity_level) || 1)

                setTourLanguage(currTour.languages)

                setCurrName(currTour.name)
                setCurrDescription(currTour.description)
                setIsActive(currTour.active)
                setTourCategoriesItems(toursCategoryStore.getSavedCategoriesList())
                setTourTypesItems(toursTypeStore.getSavedCategoriesList())
                setTourTags(currTour.tour_categoryJSON)
                setTourTypes(currTour.tour_typeJSON)

                setIsGuideCanAdd(currTour.guide_can_add)
                setSelectedUserList(JSON.parse(currTour.selected_guides))

                mapPointsStore.loadMapPointsList()
                let storeMapointsItems = mapPointsStore.getMapPointList
                if (storeMapointsItems !== null) {
                    setMapPointsArr(storeMapointsItems)
                } else {
                    setMapPointsArr([])
                }

                setTourPriceUsd(currTour.price_usd)

                let newMapPointArr = []
                let lostMapPointsArr = []
                let currTourMapPointArr = JSON.parse(currTour.map_points)

                for (let i = 0; i < currTourMapPointArr.length; i++) {
                    mapPointsStore.getMapPointList.map(currMapPoint => {
                        if (currTourMapPointArr[i] === currMapPoint.id) {
                            if (!currMapPoint.data) {
                                lostMapPointsArr.push(i)
                            }

                            newMapPointArr.push(currTourMapPointArr[i])
                        }
                    })
                }

                setTourMapPoints(JSON.stringify(newMapPointArr))
                currTour.map_points = JSON.stringify(newMapPointArr)


                if (item.image_logo) {
                    if (item.id >= 0) {
                        setItemImageLogo(currTour.image_logo + '?' + Date.now())
                    }
                }

                setMapPointsArr_Loading(true)
                if (lostMapPointsArr.length > 0) {
                    lostMapPointsArr.map(async function (lostItem, index) {

                        getMapPointData(currTourMapPointArr[lostItem]).then(data => {
                            if (data.hasOwnProperty('status')) {
                                if (data.status === 'ok') {

                                    for (let j = 0; j < storeMapointsItems.length; j++) {
                                        let currStoreMapPointItem = storeMapointsItems[j]
                                        if (currStoreMapPointItem.id === currTourMapPointArr[lostItem]) {
                                            // storeMapointsItems[currTourMapPointArr[lostItem]].data = data.data
                                            currStoreMapPointItem.data = data.data

                                            mapPointsStore.addDataToMapPoint_byId(currStoreMapPointItem.id, data.data)

                                        }
                                    }

                                }
                            }
                        }).finally(() => {

                            if (lostMapPointsArr.length - 1 === index) {
                                setMapPointsArr_Loading(false)
                                setMapPointsArr(storeMapointsItems)
                            }
                        })
                    })
                } else {
                    setMapPointsArr(storeMapointsItems)
                    setMapPointsArr_Loading(false)

                }

                setTourIncludes(currTour.tourIncludes || '[]')
                setTourNotIncludes(currTour.tourNotIncludes || '[]')

                setImagesAdd({0: JSON.parse(currTour.tourImages)} || {})
                // imagesItem.items = currTour.tourImages

                setImagesItem({name: '', items: currTour.tourImages})
            } catch (e) {

            }

            setTourCategoriesItems_load(false)

            getUserListHandler()

        })


    }, [])

    const onNameHandler = (value) => {
        setCurrName(value)
        currTour.name = value
        currTour.isSaved = false
        onItemEditHandler(currTour.getAsJson())
    }

    const changeTopicId = (id) => {
        currTour.newId = id
        onItemEditHandler(currTour.getAsJson(), newImageLogo)
    }

    const onDescriptionHandler = (value) => {
        setCurrDescription(value)
        currTour.description = currDescription
        currTour.isSaved = false
        onItemEditHandler(currTour.getAsJson())
    }

    const addNewTagHandler = (value) => {
        let newCategory = null

        for (let i = 0; i < tourCategoriesItems.length; i++) {
            if (tourCategoriesItems[i].id === value) {
                newCategory = tourCategoriesItems[i]
            }
        }

        if (newCategory) {
            const found = tourTags.find(element => element === newCategory.id)
            if (!found) {
                setTourTags([...tourTags, newCategory.id])
                currTour.tour_category = JSON.stringify([...tourTags, newCategory.id])
                currTour.isSaved = false
                onItemEditHandler(currTour.getAsJson())
            }
        }
    }

    const addNewTypeHandler = (value) => {
        let newType = null

        for (let i = 0; i < tourTypesItems.length; i++) {
            if (tourTypesItems[i].id === value) {
                newType = tourTypesItems[i]
            }
        }

        if (newType) {
            const found = tourTypes.find(element => element === newType.id)
            if (!found) {
                setTourTypes([...tourTypes, newType.id])
                currTour.tour_type = JSON.stringify([...tourTypes, newType.id])
                currTour.isSaved = false
                onItemEditHandler(currTour.getAsJson())
            }
        }
    }

    const deleteNewTagHandler = (value) => {
        let newCategory = null

        for (let i = 0; i < tourCategoriesItems.length; i++) {
            if (tourCategoriesItems[i].id === value) {
                newCategory = tourCategoriesItems[i]
            }
        }

        if (newCategory) {
            const found = tourTags.find(element => element === newCategory.id)
            if (found) {
                const filtered = tourTags.filter(function (typeId) {
                    return typeId !== found;
                })
                setTourTags(filtered)
                currTour.tour_category = JSON.stringify(filtered)
                currTour.isSaved = false
                onItemEditHandler(currTour.getAsJson())
            }
        } else {
            const filtered = tourTags.filter(function (typeId) {
                return value !== typeId;
            })

            setTourTags(filtered)
            currTour.tour_category = JSON.stringify(filtered)
            currTour.isSaved = false
            onItemEditHandler(currTour.getAsJson())
        }
    }

    const deleteNewTypeHandler = (value) => {
        let newCategory = null

        for (let i = 0; i < tourTypesItems.length; i++) {
            if (tourTypesItems[i].id === value) {
                newCategory = tourTypesItems[i]
            }
        }

        if (newCategory) {
            const found = tourTypes.find(element => element === newCategory.id)
            if (found) {
                const filtered = tourTypes.filter(function (typeId) {
                    return typeId !== found;
                })
                setTourTypes(filtered)
                currTour.tour_type = JSON.stringify(filtered)
                currTour.isSaved = false
                onItemEditHandler(currTour.getAsJson())
            }
        } else {
            const filtered = tourTypes.filter(function (typeId) {
                return value !== typeId;
            })

            setTourTypes(filtered)
            currTour.tour_type = JSON.stringify(filtered)
            currTour.isSaved = false
            onItemEditHandler(currTour.getAsJson())
        }
    }

    const getTagNameById = (id) => {
        for (let i = 0; i < tourCategoriesItems.length; i++) {
            if (tourCategoriesItems[i].id === id) {
                return tourCategoriesItems[i].category_name
            }
        }
    }

    const getTypeNameById = (id) => {
        for (let i = 0; i < tourTypesItems.length; i++) {
            if (tourTypesItems[i].id === id) {
                return tourTypesItems[i].category_name
            }
        }
    }

    const onDeleteHandler = () => {
        setIsDeleting(true)
        setTimeout(() => {
            setIsDeleting(false)
        }, 3000)
    }


    const setActiveHandler = (value) => {
        setIsActive(value)
        currTour.active = value
        currTour.isSaved = false
        onItemEditHandler(currTour.getAsJson())
    }

    const setGuideCanAddHandler = (value) => {

        setTourGuideCanAdd(currTour.id).then(() => {

            setIsSaving(true)
            setIsGuideCanAdd(value)
            currTour.guide_can_add = value
            onItemEditHandler(currTour.getAsJson())

        }).finally(() => {
            setIsSaving(false)
        })

    }

    const deleteHandler = () => {
        setIsSaving(true)
        setDeleteError(false)

        delay(0).then(() => {

            if (currTour.id > 0) {
                deleteTourAPI(
                    currTour.id
                ).then(data => {
                    if (data.hasOwnProperty('status')) {
                        if (data.status === 'ok') {
                            deleteTopic(currTour.id)
                        }
                    }
                }).catch(() => {
                    setDeleteError(true)
                }).finally(() => {
                    setIsDeleting(false)
                    setIsSaving(false)
                })
            } else {
                deleteTopic(currTour.id)
                setIsDeleting(false)
                setIsSaving(false)
            }
        })
    }

    const addNewMapPointHandler = () => {
        setShowModal(true)
    }

    const saveHandler = () => {

        setIsSaving(true)
        setSaveError(false)
        delay(0).then(() => {

            if (currTour.id < 0) {
                saveTourAPI(
                    currTour.name,
                    currTour.description,
                    currTour.image_logo,
                    currTour.created_by_user_id,
                    currTour.created_date,
                    currTour.active,

                    currTour.tour_category,
                    currTour.tour_type,
                    currTour.duration,
                    currTour.activity_level,
                    currTour.languages,
                    currTour.map_points,
                    currTour.image_logo_file,
                    currTour.selected_guides,
                    currTour.guide_can_add,
                    currTour.data,
                    imagesAdd,
                    currTour.price_usd,
                ).then(data => {
                    if (data.hasOwnProperty('status')) {
                        if (data.status === 'ok') {
                            currTour.isSaved = true

                            if (data.hasOwnProperty('image_logo')) {

                                currTour.image_logo = data.image_logo
                                setItemImageLogo(data.image_logo + '?' + Date.now())
                            }

                            getTourDataF().finally(() => {//save
                                changeTopicId(data.id)
                            }).finally(() => {
                                setIsSaving(false)
                            })

                        }
                    }
                }).catch(() => {
                    setSaveError(true)
                }).finally(() => {
                    // setIsSaving(false)
                })
            } else {
                changeTourAPI(
                    currTour.id,
                    currTour.name,
                    currTour.description,
                    currTour.image_logo,
                    currTour.created_by_user_id,
                    currTour.created_date,
                    currTour.active,

                    currTour.tour_category,
                    currTour.tour_type,
                    currTour.duration,
                    currTour.activity_level,
                    currTour.languages,
                    currTour.map_points,
                    currTour.image_logo_file,
                    currTour.selected_guides,
                    currTour.guide_can_add,
                    currTour.data,
                    imagesAdd,
                    currTour.price_usd,
                ).then(data => {

                    if (data.hasOwnProperty('status')) {
                        if (data.status === 'ok') {
                            currTour.isSaved = true

                            if (data.hasOwnProperty('image_logo')) {
                                currTour.image_logo = data.image_logo
                                setItemImageLogo(data.image_logo + '?' + Date.now())
                            }

                            getTourDataF().finally(() => {//change
                                currTour.data = item.data

                                setTourIncludes(currTour.tourIncludes || '[]')
                                setTourNotIncludes(currTour.tourNotIncludes || '[]')

                                setImagesAdd({0: JSON.parse(currTour.tourImages)} || {})
                                // imagesItem.items = currTour.tourImages
                                setImagesItem({name: '', items: currTour.tourImages})

                                onItemEditHandler(currTour.getAsJson(), newImageLogo)
                            }).finally(() => {
                                setIsSaving(false)
                            })
                        }
                    }
                }).catch(() => {
                    currTour.isSaved = false
                    setSaveError(true)
                }).finally(() => {

                    setIsSaving(false)
                })
            }
        })
    }

    const onLanguageSelectHandler = (value) => {
        if (Array.isArray(JSON.parse(tourLanguage))) {
            const currLangArr = JSON.parse(tourLanguage)
            const found = currLangArr.find(element => element === value)
            if (found) {
                const filtered = currLangArr.filter(function (value) {
                    return value !== found;
                })
                currTour.languages = JSON.stringify(filtered)
                setTourLanguage(JSON.stringify(filtered))
            } else {
                currTour.languages = JSON.stringify([...currLangArr, value])
                setTourLanguage(JSON.stringify([...currLangArr, value]))
            }
            currTour.isSaved = false
            onItemEditHandler(currTour.getAsJson())
        }


    }

    const onActivitySelectHandler = (value) => {
        setActivityType(value)
        currTour.activity_level = value
        currTour.isSaved = false
        onItemEditHandler(currTour.getAsJson())

    }

    const onDurationTimeTypeSelectHandler = (value) => {
        if (value === 1) {
            setDurationTimeType('h')
        } else {
            setDurationTimeType('d')
        }
        onDurationChange(durationTime, value)
    }

    const onDurationTimeSelectHandler = (value) => {
        setDurationTime(value)
        onDurationChange(value, durationTimeType)
    }

    const onDurationChange = (time, type) => {
        currTour.duration = time + ' ' + type
        currTour.isSaved = false
        onItemEditHandler(currTour.getAsJson())
    }

    const onFileChooseHandler = (fileName) => {
        if (fileName) {
            setNewImageLogo(true)
        } else {
            setNewImageLogo(false)
        }
        currTour.image_logo_file = fileName
        currTour.isSaved = false
        onItemEditHandler(currTour.getAsJson())
    }

    const getMapPointDataItems = (selectedMapPoint) => {
        if (selectedMapPoint.hasOwnProperty('data')) {
            let newDataItems = []
            const mapPointData = JSON.parse(selectedMapPoint.data)
            for (let i = 0; i < mapPointData.length; i++) {
                if (!mapPointData[i].hasOwnProperty('description')) {
                    newDataItems.push(mapPointData[i])
                }
            }

            return newDataItems
        }
        return null
    }

    const getMapPointDataDescription = (selectedMapPoint) => {
        try {
            if (selectedMapPoint.hasOwnProperty('data')) {
                const mapPointData = JSON.parse(selectedMapPoint.data)

                for (let i = 0; i < mapPointData.length; i++) {
                    if (mapPointData[i].hasOwnProperty('description')) {
                        return mapPointData[i].description
                    }
                }

                return selectedMapPoint.description
            }
        } catch (e) {
            console.log(selectedMapPoint)
            console.log(e)

        }
    }

    const getMapPoint_byId = (id) => {
        for (let i = 0; i < mapPointsArr.length; i++) {
            if (parseInt(mapPointsArr[i].id) === parseInt(id)) {
                return mapPointsArr[i]
            }
        }
    }

    const addToTourId = (id) => {

        const currMapPointsArr = JSON.parse(tourMapPoints)
        if (Array.isArray(currMapPointsArr)) {

            const found = currMapPointsArr.find(element => element === id)
            if (found) {
                const filtered = currMapPointsArr.filter(function (value) {
                    return value !== found;
                })

                currTour.map_points = JSON.stringify(filtered)
                setTourMapPoints(JSON.stringify(filtered))
            } else {
                currTour.map_points = JSON.stringify([...currMapPointsArr, id])
                setTourMapPoints(JSON.stringify([...currMapPointsArr, id]))
            }

            let storeMapointsItems = mapPointsStore.getMapPointList
            if (storeMapointsItems !== null) {
                setMapPointsArr(storeMapointsItems)
            } else {
                setMapPointsArr([])
            }

            currTour.isSaved = false
            onItemEditHandler(currTour.getAsJson())
        }
    }

    const deleteMapPoint = (id) => {
        mapPointsStore.deleteMapPointById(id)
    }

    const onMapPointEditHandler = (item) => {
        let currMapPointsArr = mapPointsStore.getMapPointList
        if (!currMapPointsArr) {
            currMapPointsArr = []
        }

        let newArr = currMapPointsArr
        for (let i = 0; i < newArr.length; i++) {
            if (newArr[i].id === item.id) {
                if (item.hasOwnProperty('newId')) {
                    item.id = item.newId
                    delete item.newId
                }
                newArr[i] = item
            }
        }
        mapPointsStore.setMapPointsListFromArr(newArr)

    }

    const onSetHideModal = () => {
        setShowModal(false)
        currTour.isSaved = false
        onItemEditHandler(currTour.getAsJson())

    }

    const mapPointPageCardComponent = () => {

        return <MapPointsDetailsPage
            onItemEditHandler={onMapPointEditHandler}
            deleteTopic={deleteMapPoint}
            addToTourId={addToTourId}
        />
    }

    const tourIncludesEditHandler = (newTourIncludes) => {
        currTour.tourIncludes = JSON.stringify(newTourIncludes)
        currTour.isSaved = false
        setTourIncludes(JSON.stringify(newTourIncludes))
        onItemEditHandler(currTour.getAsJson())
    }

    const tourNotIncludesEditHandler = (newTourIncludes) => {
        currTour.tourNotIncludes = JSON.stringify(newTourIncludes)
        currTour.isSaved = false
        setTourIncludes(JSON.stringify(newTourIncludes))
        onItemEditHandler(currTour.getAsJson())
    }

    const tourImagesEditHandler = () => {

    }

    const onImagesFilesDeleteHandler = (imageListIndex, imageIndex) => {
        let currImagesList = imagesAdd
        if (!currImagesList.hasOwnProperty(imageListIndex)) {
            currImagesList[imageListIndex] = {}
        }
        let currList = currImagesList[imageListIndex]
        delete currList[imageIndex]

        let newCurrList = {}
        let newDataImagesArr = []
        Object.keys(currList).forEach(function (key) {
            newCurrList[Object.keys(newCurrList).length] = currList[key]
            newDataImagesArr.push(currList[key])
        });

        currImagesList[imageListIndex] = newCurrList
        setImagesAdd(currImagesList)

        currTour.tourImages = JSON.stringify(newDataImagesArr)

        currTour.isSaved = false
        onItemEditHandler(currTour.getAsJson())

    }
    const onImagesFilesAddHandler = (fileName, imageListIndex) => {
        if (fileName) {
            let currImagesList = imagesAdd
            if (!currImagesList.hasOwnProperty(imageListIndex)) {
                currImagesList[imageListIndex] = {}
            }
            let currList = currImagesList[imageListIndex]

            let isThere = false
            Object.keys(currList).forEach(function (key) {
                let currFile = currList[key]
                if (currFile.name === fileName.name &&
                    currFile.lastModified === fileName.lastModified &&
                    currFile.size === fileName.size &&
                    currFile.type === fileName.type) {
                    isThere = true
                }
            });

            if (!isThere) {
                currList[Object.keys(currList).length] = fileName
                currImagesList[imageListIndex] = currList
                setImagesAdd(currImagesList)

                currTour.tourImages = JSON.stringify([...JSON.parse(currTour.tourImages), fileName.name])

            }

            currTour.isSaved = false
            onItemEditHandler(currTour.getAsJson())

            return !isThere
        }
    }

    const getMapPointsTimeLine = () => {
        return (
            mapPointsArr_Loading
                ?
                <SpinnerSM/>
                :
                <MDBContainer className="py-2">
                    <ul className="timeline-with-icons">
                        {
                            JSON.parse(tourMapPoints).map(function (currMapPoint, index) {
                                let selectedMapPoint = getMapPoint_byId(currMapPoint)
                                if (selectedMapPoint)
                                    return <TourTimeLineCollapse
                                        key={index}
                                        name={selectedMapPoint.name}
                                        description={getMapPointDataDescription(selectedMapPoint)}
                                        image_logo={selectedMapPoint.image_logo}
                                        index={index}
                                        dataItems={getMapPointDataItems(selectedMapPoint)}
                                    />
                            })
                        }
                    </ul>
                </MDBContainer>
        );
    }

    const getUserNameById = (userId) => {
        const selectedUser = userList.find(element => element.id === userId)
        return selectedUser.name
    }

    const addGuideToTourHandler = (userId) => {

        const selectedGuidesIds = JSON.parse(currTour.selected_guides)
        let filtered
        const userIdFinded = selectedGuidesIds.find(element => element === userId)
        if (userIdFinded) {
            filtered = selectedGuidesIds.filter(function (value) {
                return value !== userId;
            })
            currTour.selected_guides = JSON.stringify(filtered)
            setSelectedUserList(filtered)
        } else {
            selectedGuidesIds.push(userId)
            currTour.selected_guides = JSON.stringify(selectedGuidesIds)
            setSelectedUserList(selectedGuidesIds)
            // filtered = userListFiltered.filter(item => !selectedGuidesIds.includes(item));
        }
        // setUserListFiltered(filtered)
        currTour.isSaved = false
        onItemEditHandler(currTour.getAsJson())

    }

    const priceEditHandler = (value) => {
        if (value > -1) {
            setTourPriceUsd(value)
            currTour.price_usd = value
            currTour.isSaved = false
            onItemEditHandler(currTour.getAsJson())

        }

    }

    if (tourCategoriesItems_load) {
        return <SpinnerSM/>
    } else {

        return (
            <div>

                <Row className={'h-25 align-items-center justify-content-center '}
                     style={{
                         borderBottom: '1px solid rgba(40, 44, 52, 0.2)',
                         marginBottom: '15px'
                     }}>
                    <div className={'col-sm-2 justify-content-center '}>
                        0 views
                    </div>
                    <div className={'col-sm-2 justify-content-center'}>
                        0 clicks
                    </div>
                    <div className={'col-sm-2 justify-content-center'}>
                        0 favs
                    </div>
                </Row>
                {/***
                 ACTIVE BTN
                 ***/}
                <Row className={'topic-detail-row'}>
                    <div
                        className={'col-12 justify-content-between'}
                        style={{display: 'flex'}}
                    >
                        <div className={'col-10'}>
                            <input
                                type="categoryName"
                                id="formTopicName"
                                className="form-control"
                                placeholder='Category'
                                value={currName}
                                disabled={!!isSaving}
                                onChange={e => onNameHandler(e.target.value)}
                            />
                        </div>
                        <ToggleButton
                            id="toggle-active"
                            type="checkbox"
                            variant={"outline-primary"}
                            checked={isActive}
                            value={'1'}
                            disabled={!!isSaving}
                            onChange={(e) => setActiveHandler(e.currentTarget.checked)}
                            style={{display: 'flex'}}
                        >
                            {isActive
                                ?
                                <CircleOkIco
                                    fill='white'
                                    style={{
                                        width: '16px',
                                        height: '16px',
                                        marginBottom: '3px',
                                        marginRight: '5px',
                                    }}

                                />
                                :
                                <CircleIco
                                    fill='blue'
                                    style={{
                                        width: '16px',
                                        height: '16px',
                                        marginBottom: '3px',
                                        marginRight: '5px',
                                    }}
                                />
                            }
                            Active
                        </ToggleButton>
                    </div>
                </Row>

                {/***
                 DESCRIPTION
                 ***/}
                <Row className={'topic-detail-row'}>
                    <div className={'col-12 justify-content-center '}>
                    <textarea className={'col-12'}
                              name="topicDescription"
                              id="topicDescription"
                              rows="3"
                              onChange={e => onDescriptionHandler(e.target.value)}
                              value={currDescription}
                              disabled={!!isSaving}
                    />
                    </div>
                </Row>
                <hr/>
                {/***
                 CATEGORIES
                 ***/}
                <Row className={'topic-detail-row'}>

                    {tourCategoriesItems_load
                        ?
                        <SpinnerSM/>
                        :
                        <div className={'d-flex flex-wrap'}>
                            <Dropdown>
                                <Dropdown.Toggle
                                    variant="outline-secondary"
                                    size="sm"
                                    id="dropdown-tag"
                                    disabled={!!isSaving}
                                >
                                    Add tour category
                                </Dropdown.Toggle>

                                <Dropdown.Menu>

                                    {tourCategoriesItems.map(item => {
                                        return <Dropdown.Item
                                            key={item.id}
                                            name={item.category_name}
                                            id={item.id}
                                            onClick={() => {
                                                addNewTagHandler(item.id)
                                            }}
                                        >{item.category_name}</Dropdown.Item>
                                    })}
                                </Dropdown.Menu>
                            </Dropdown>

                            {
                                tourTags.map(item => {
                                    return <Button
                                        key={item}
                                        className="badge btn-secondary mb-2 mx-1"
                                        disabled={!!isSaving}
                                    >
                                        {getTagNameById(item)}
                                        <CloseIco
                                            onClick={() => {
                                                deleteNewTagHandler(item)
                                            }}
                                            fill='white'
                                            style={{
                                                width: '36px',
                                                height: '16px',
                                                marginBottom: '2px',
                                                marginTop: '2px',
                                                marginLeft: '-5px',
                                                marginRight: '-15px',
                                            }}
                                        />
                                    </Button>
                                })
                            }

                        </div>
                    }

                </Row>
                {/***
                 IMAGE
                 ***/}
                <Row className={'topic-detail-row'}>
                    <div
                        className={'d-flex align-items-center justify-content-center'}
                    >
                        <div
                            style={{
                                height: '250px',
                                overflow: 'hidden',
                                margin: 0,
                            }}>

                            <Image

                                style={{
                                    objectFit: 'cover',
                                    position: 'absolute',
                                    width: '100%',
                                    height: '200px',
                                    left: '50%',
                                    transform: 'translate(-50%, 10%)',
                                }}
                                src={itemImageLogo
                                    ?
                                    `${process.env.REACT_APP_API_URL}/static/${itemImageLogo}`
                                    :
                                    noImageLogo
                                }
                            />
                        </div>

                        <MDBFile
                            className={`btn w-50 ${newImageLogo ? 'btn-primary' : 'btn-secondary'} `}
                            id='topicLogo'
                            disabled={!!isSaving}
                            style={{
                                position: 'absolute',
                            }}
                            onChange={e => {
                                onFileChooseHandler(e.target.files[0])
                            }}
                        />
                    </div>
                </Row>
                {/***
                 TYPES
                 ***/}
                <Row className={'topic-detail-row'}>

                    {tourCategoriesItems_load
                        ?
                        <SpinnerSM/>
                        :
                        <div className={'d-flex flex-wrap '}>
                            <Dropdown>
                                <Dropdown.Toggle
                                    variant="outline-secondary"
                                    size="sm"
                                    id="dropdown-tag"
                                    disabled={!!isSaving}
                                >
                                    Add tour type
                                </Dropdown.Toggle>

                                <Dropdown.Menu>

                                    {tourTypesItems.map(item => {
                                        return <Dropdown.Item
                                            key={item.id}
                                            name={item.category_name}
                                            id={item.id}
                                            onClick={() => {
                                                addNewTypeHandler(item.id)
                                            }}
                                        >{item.category_name}</Dropdown.Item>
                                    })}
                                </Dropdown.Menu>
                            </Dropdown>

                            {
                                tourTypes.map(item => {
                                    return <Button
                                        key={item}
                                        className="badge btn-secondary mb-2 mx-1"
                                        disabled={!!isSaving}

                                    >
                                        {getTypeNameById(item)}
                                        <CloseIco
                                            onClick={() => {
                                                deleteNewTypeHandler(item)
                                            }}
                                            fill='white'
                                            style={{
                                                width: '36px',
                                                height: '16px',
                                                marginBottom: '2px',
                                                marginTop: '2px',
                                                marginLeft: '-5px',
                                                marginRight: '-15px',
                                            }}
                                        />
                                    </Button>
                                })
                            }

                        </div>
                    }

                </Row>
                <hr/>
                {/***
                 DURATION
                 ***/}
                <Row className={'topic-detail-row'}>
                    <span>Tour duration</span>
                    <div>
                        <ToggleButtonGroup
                            className={'col-7 py-2'}
                            type="radio"
                            name="hourday"
                            defaultValue={durationTimeType === 'h' ? 1 : 2}
                        >
                            <ToggleButton
                                variant={'outline-success'}
                                id={`days-radio-1`}
                                value={1}
                                onClick={() => {
                                    onDurationTimeTypeSelectHandler(1)
                                }}
                            >
                                Hours
                            </ToggleButton>
                            <ToggleButton
                                variant={'outline-success'}
                                id={`days-radio-2`}
                                value={2}
                                onClick={() => {
                                    onDurationTimeTypeSelectHandler(2)
                                }}
                            >
                                Days
                            </ToggleButton>
                        </ToggleButtonGroup>
                        <div style={{overflow: 'auto', paddingLeft: '1px', paddingRight: '1px',}}>
                            <ToggleButtonGroup type="radio" name="time" defaultValue={durationTime}>
                                {
                                    durationItems.map(durationItem => {
                                        return <ToggleButton
                                            key={durationItem.id}
                                            variant={durationTime === durationItem.id ? 'outline-success' : 'outline-secondary'}
                                            id={`tbg-radio-${durationItem.id}`}
                                            value={durationItem.id}

                                            onClick={() => {
                                                onDurationTimeSelectHandler(durationItem.id)
                                            }}
                                        >
                                            {durationItem.id > 20 ? '21+' : durationItem.id}
                                        </ToggleButton>

                                    })
                                }

                            </ToggleButtonGroup>
                        </div>
                    </div>
                </Row>
                <hr/>
                {/***
                 ACTIVITY LEVEL
                 ***/}
                <Row className={'topic-detail-row'}>
                    <span>Tour activity level</span>
                    <div>
                        <ToggleButtonGroup
                            className={'col-7 py-2'}
                            type="radio"
                            name="activity"
                            defaultValue={activityType}
                        >
                            <ToggleButton
                                variant={'outline-success'}
                                id={`activity-radio-1`}
                                value={1}
                                onClick={() => {
                                    onActivitySelectHandler(1)
                                }}
                            >
                                Easy
                            </ToggleButton>
                            <ToggleButton
                                variant={'outline-success'}
                                id={`activity-radio-2`}
                                value={2}
                                onClick={() => {
                                    onActivitySelectHandler(2)
                                }}
                            >
                                Standart
                            </ToggleButton>
                            <ToggleButton
                                variant={'outline-success'}
                                id={`activity-radio-3`}
                                value={3}
                                onClick={() => {
                                    onActivitySelectHandler(3)
                                }}
                            >
                                Medium
                            </ToggleButton>
                            <ToggleButton
                                variant={'outline-success'}
                                id={`activity-radio-4`}
                                value={4}
                                onClick={() => {
                                    onActivitySelectHandler(4)
                                }}
                            >
                                Hard
                            </ToggleButton>
                            <ToggleButton
                                variant={'outline-success'}
                                id={`activity-radio-5`}
                                value={5}
                                onClick={() => {
                                    onActivitySelectHandler(5)
                                }}
                            >
                                Expert
                            </ToggleButton>
                        </ToggleButtonGroup>

                    </div>
                </Row>
                <hr/>
                {/***
                 LANGUAGE
                 ***/}
                <Row className={'topic-detail-row'}>
                    <span>Tour languages</span>
                    <div>
                        <ToggleButtonGroup
                            className={'col-7 py-2'}
                            type="checkbox"
                            name="activity"
                            defaultValue={JSON.parse(tourLanguage)}
                        >
                            <ToggleButton
                                variant={'outline-success'}
                                id={`language-check-1`}
                                value={'en'}
                                onClick={() => {
                                    onLanguageSelectHandler('en')
                                }}
                            >
                                English
                            </ToggleButton>
                            <ToggleButton
                                variant={'outline-success'}
                                id={`language-check-2`}
                                value={'ru'}
                                onClick={() => {
                                    onLanguageSelectHandler('ru')
                                }}
                            >
                                Russian
                            </ToggleButton>
                            <ToggleButton
                                variant={'outline-success'}
                                id={`language-check-3`}
                                value={'id'}
                                onClick={() => {
                                    onLanguageSelectHandler('id')
                                }}
                            >
                                Indonesian
                            </ToggleButton>

                        </ToggleButtonGroup>

                    </div>
                </Row>
                <hr/>
                {/***
                 MAP POINT
                 ***/}
                <Row className={'topic-detail-row'}>
                    <span>Itinerary</span>

                    {getMapPointsTimeLine()}

                    <div>
                        <Dropdown>
                            <Dropdown.Toggle
                                variant="outline-secondary"
                                size="sm"
                                id="dropdown-tag"
                                disabled={!!isSaving}
                            >
                                Select Map Point
                            </Dropdown.Toggle>

                            <Dropdown.Menu>

                                {
                                    mapPointsArr !== null
                                        ?
                                        mapPointsArr.map(item => {
                                            return <Dropdown.Item
                                                key={item.id}
                                                name={item.name}
                                                id={item.id}
                                                onClick={() => {
                                                    addToTourId(item.id)
                                                }}
                                            >{item.name}
                                            </Dropdown.Item>
                                        })
                                        :
                                        null
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                        <Button
                            variant="outline-success"
                            className='btn btn-sm w-25'
                            disabled={!!isSaving}
                            onClick={addNewMapPointHandler}
                        >
                            Add new Map Point
                        </Button>

                        <br/>

                    </div>
                </Row>
                <hr/>
                {/***
                 WHAT INCLUDE
                 ***/}
                <Row className={'topic-detail-row'}
                     style={{backgroundColor: 'rgba(0,255,0,0.17)', paddingBottom: '30px', paddingTop: '15px'}}>
                    <span className={'py-2'}>Includes</span>
                    <TourIncludeComponent
                        includes={tourIncludes}
                        isSaving={isSaving}
                        tourIncludesEditHandler={tourIncludesEditHandler}
                    />
                </Row>
                {/***
                 WHAT NOT INCLUDE
                 ***/}
                <Row style={{backgroundColor: 'rgba(255,0,0,0.17)', paddingBottom: '30px', paddingTop: '15px'}}>
                    <span className={'py-2'}>Not includes</span>
                    <TourIncludeComponent
                        includes={tourNotIncludes}
                        isSaving={isSaving}
                        tourIncludesEditHandler={tourNotIncludesEditHandler}
                    />
                </Row>
                <hr/>
                {/***
                 IMAGES
                 ***/}
                <Row className={'topic-detail-row'}>
                    <span className={'py-2'}>Images</span>
                    <TopicImagesComponent
                        index={0}
                        item={imagesItem}
                        isSaving={isSaving}
                        dataItemEditHandler={tourImagesEditHandler}
                        onFilesAddHandler={onImagesFilesAddHandler}
                        onFilesDeleteHandler={onImagesFilesDeleteHandler}
                    />
                </Row>
                <hr/>
                {/***
                 GUIDES
                 ***/}
                <Row className={'topic-detail-row'}>
                    <span className={'py-2'}>Guides</span>
                    <div className={'d-flex'}>
                        {
                            user.isAdmin
                                ?
                                <div className={'d-flex flex-wrap '}>
                                    <Dropdown className={'mb-2'}>
                                        <Dropdown.Toggle
                                            variant="outline-secondary"
                                            size="sm"
                                            id="dropdown-tag"
                                            disabled={!!isSaving}
                                        >
                                            Add Guide
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>

                                            {
                                                !userListLoading === true
                                                    ?
                                                    userListFiltered.map(item => {
                                                        return <Dropdown.Item
                                                            key={item}
                                                            id={item}
                                                            onClick={() => {
                                                                addGuideToTourHandler(item)
                                                            }}
                                                        >{getUserNameById(item)}</Dropdown.Item>
                                                    })
                                                    :
                                                    <Dropdown.Item disabled={true}>
                                                        <span>
                                                            Loading...
                                                        </span>
                                                    </Dropdown.Item>
                                            }
                                        </Dropdown.Menu>
                                    </Dropdown>

                                    {
                                        !userListLoading
                                            ?
                                            selectedUserList.map(item => {
                                                return <Button
                                                    key={item}
                                                    className="badge btn-secondary mb-2 mx-1"
                                                    disabled={!!isSaving}
                                                    style={{
                                                        margin: '0 3px'
                                                    }}
                                                >
                                                    {getUserNameById(item)}
                                                    <CloseIco
                                                        onClick={() => {
                                                            addGuideToTourHandler(item)
                                                        }}
                                                        fill='white'
                                                        style={{
                                                            width: '36px',
                                                            height: '16px',
                                                            marginBottom: '2px',
                                                            marginTop: '2px',
                                                            marginLeft: '-5px',
                                                            marginRight: '-15px',
                                                        }}
                                                    />
                                                </Button>
                                            })
                                            :
                                            null

                                    }

                                </div>
                                :
                                null
                        }
                    </div>
                    <div className={'d-flex'}>
                        {
                            user.isGuide
                                ?
                                null
                                :
                                null
                        }
                    </div>
                    <div className={'d-flex pt-2'}>
                        <ToggleButton
                            id="toggle-guide-can_add"
                            type="checkbox"
                            variant={"outline-primary"}
                            checked={isGuideCanAdd}
                            value={'2'}
                            disabled={!!isSaving}
                            onChange={(e) => setGuideCanAddHandler(e.currentTarget.checked)}
                            style={{display: 'flex'}}
                        >
                            {isGuideCanAdd
                                ?
                                <CircleOkIco
                                    fill='white'
                                    style={{
                                        width: '16px',
                                        height: '16px',
                                        marginBottom: '3px',
                                        marginRight: '5px',
                                    }}

                                />
                                :
                                <CircleIco
                                    fill='blue'
                                    style={{
                                        width: '16px',
                                        height: '16px',
                                        marginBottom: '3px',
                                        marginRight: '5px',
                                    }}
                                />
                            }
                            Is guide can add
                        </ToggleButton>
                    </div>
                    <small>
                        This option allows guides to be added to this tour
                    </small>
                </Row>
                <hr/>
                {/***
                 PRICE
                 ***/}
                <Row className={'topic-detail-row justify-content-end'}>
                    <span className={'col-5'}>Tour price USD (per person)</span>
                    <div className={'d-flex col-3'}>
                        <input
                            type="tourPrice"
                            id="tourPrice"
                            className="form-control "
                            placeholder='Items'
                            value={tourPriceUsd}
                            disabled={!!isSaving}
                            onChange={(e) => {
                                priceEditHandler(e.target.value)
                            }}
                        />
                    </div>
                </Row>
                <hr/>
                {/***
                 SAVE
                 ***/}
                <Row className={'topic-detail-row justify-content-center pt-3'}>
                    <Button
                        className={`btn ${saveError ? 'btn-danger' : 'btn-primary'}  btn-lg w-50 btn-block`}
                        disabled={!!isSaving}
                        onClick={saveHandler}
                    >Save</Button>
                </Row>
                <hr/>
                {/***
                 DELETE
                 ***/}
                <Row className={'topic-detail-row'}>

                    <div style={{display: "flex"}}>
                        <button
                            type="button"
                            className={`btn ${deleteError ? 'btn-danger' : 'btn-outline-danger'} w-25 `}
                            disabled={!!isSaving}
                            onClick={onDeleteHandler}
                        >
                            Delete
                        </button>
                        <div style={{display: isDeleting ? "block" : "none"}}>

                            <span
                                style={{marginLeft: '25px', marginRight: '10px'}}
                            >
                                Sure?
                            </span>
                            <button
                                type="button"
                                className="btn btn-outline-danger"
                                onClick={deleteHandler}
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </Row>

                <ModalPopUp
                    show={showModal}
                    onHide={() => {
                        onSetHideModal()
                        // setShowModal(false)
                    }}
                    title={'MAp poinTS'}
                    // item={currItem}
                    child={mapPointPageCardComponent}
                />


            </div>
        );
    }
});

export default TourDetailsPage;