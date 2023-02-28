import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Button, Dropdown, Image, Row, ToggleButton} from "react-bootstrap";
import noImageLogo from '../../img/nophoto.jpg'
import {observer} from "mobx-react-lite";

import {ReactComponent as CircleIco} from "../../img/svg/circle.svg"
import {ReactComponent as CircleOkIco} from "../../img/svg/circle_ok.svg"
import {ReactComponent as CloseIco} from "../../img/svg/close.svg"
import {delay} from "../../utils/consts";
import {MDBFile} from "mdb-react-ui-kit";
import TopicAddNewBtn from "../topics/components/TopicAddNewBTN";
import TopicItemCard from "../topics/components/TopicItemCard";
import TopicGoogleMapUrlComponent from "../topics/components/TopicGoogleMapUrlComponent";
import TopicTextComponent from "../topics/components/TopicTextComponent";
import MapPointTopicComponent from "./MapPointTopicComponent";
import {changeMapPointAPI, deleteMapPointAPI, getMapPointData, saveMapPointAPI} from "../../http/mapPointsAPI";
import mapPointCL from "../../classes/mapPointCL";
import SpinnerSM from "../SpinnerSM";
import {Context} from "../../index";
import MapPointAgentComponent from "./MapPointAgentComponent";

const dropDownItems = [
    {
        id: 0,
        name: 'Text card',
        type: 'text',
    },
    {
        id: 1,
        name: 'Google Map Url card',
        type: 'googleMapUrl',
    },
    {
        id: 2,
        name: 'Topic',
        type: 'topic',
    },
    {
        id: 3,
        name: 'Agent',
        type: 'agent',
    },
]
let currMapPoint = null
let item = null
const MapPointsDetailsPage = observer((props) => {
    const {itemC, onItemEditHandler, deleteMapPoint, addToTourId} = props
    const {mapPointsStore, user, toursTypeStore} = useContext(Context)

    const [isSaving, setIsSaving] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [saveError, setSaveError] = useState(false)
    const [deleteError, setDeleteError] = useState(false)
    const [currName, setCurrName] = useState('')
    const [currDescription, setCurrDescription] = useState('')
    const [itemData, setItemData] = useState([])
    const [isActive, setIsActive] = useState(true)
    const [itemImageLogo, setItemImageLogo] = useState('')
    const [newImageLogo, setNewImageLogo] = useState(false)
    const [mapPointsItems_load, setMapPointsItems_load] = useState(true)

    const [tourTypesItems, setTourTypesItems] = useState([])
    const [tourTypes, setTourTypes] = useState([])

    useEffect(
        () => {

            if (!itemC) {
                item = mapPointsStore.getCreateAndAddMapPointsJson(user.currUserId)
            } else {
                item = itemC
            }

            setTourTypesItems(toursTypeStore.getSavedCategoriesList())

            currMapPoint = new mapPointCL()

            setMapPointsItems_load(true)
            currMapPoint.setFromJson(item)
            setCurrName(currMapPoint.name)

            setIsActive(currMapPoint.active)

            setTourTypes(JSON.parse(currMapPoint.types))

            if (item.image_logo) {
                if (item.id >= 0) {
                    setItemImageLogo(currMapPoint.image_logo + '?' + Date.now())
                }
            }

            if (Object.keys(currMapPoint.dataJSON).length === 0) {
                delay(0).then(() => {
                    if (currMapPoint.id > -1) {
                        getMapPointData(currMapPoint.id).then(data => {
                            if (data.hasOwnProperty('status')) {
                                if (data.status === 'ok') {
                                    currMapPoint.data = data.data

                                }
                            }
                        }).finally(() => {
                            setItemData(currMapPoint.dataJSON)
                            setMapPointsItems_load(false)
                            setCurrDescription(currMapPoint.descriptionData)

                        })
                    } else {
                        setCurrDescription(currMapPoint.descriptionData)
                        setMapPointsItems_load(false)
                    }
                })
            } else {
                setItemData(currMapPoint.dataJSON)
                setCurrDescription(currMapPoint.descriptionData)
                setMapPointsItems_load(false)
            }

        }, []
    )

    const onNameHandler = (value) => {
        setCurrName(value)
        currMapPoint.name = value
        currMapPoint.isSaved = false
        onItemEditHandler(currMapPoint.getAsJson())
    }

    const changeTopicId = (id) => {
        currMapPoint.newId = id
        onItemEditHandler(currMapPoint.getAsJson(), newImageLogo)
    }

    const onDescriptionHandler = (value) => {
        currMapPoint.description = value.substring(0, 120)
        currMapPoint.setDescriptionData(value)
        setCurrDescription(value)

        currMapPoint.isSaved = false
        onItemEditHandler(currMapPoint.getAsJson())
    }

    const getNewDataItemByType = (type) => {
        let newItem = {}
        switch (type) {
            case "text":
                newItem = {"type": type, "name": "", "text": ""}
                break
            case "googleMapUrl":
                newItem = {"type": type, "name": "", "url": ""}
                break
            case "topic":
                newItem = {"type": type, "topicId": "", "topicName": ""}
                break
            case "agent":
                newItem = {"type": type, "userId": ""}
                break
        }
        return newItem
    }

    const addNewItemHandler = useCallback((value) => {
        let type = ''

        for (let i = 0; i < dropDownItems.length; i++) {
            if (dropDownItems[i].id === value) {
                type = dropDownItems[i].type
            }
        }

        let newItem = getNewDataItemByType(type)

        currMapPoint.addNewItemJSON(newItem)
        currMapPoint.isSaved = false
        onItemEditHandler(currMapPoint.getAsJson())

        setItemData(currMapPoint.dataJSON)

        /** the function only changes when any of these dependencies change */
    }, [currMapPoint])

    const dataItemEditHandler = (item) => {
        if (item.hasOwnProperty('index')) {
            let dataArr = JSON.parse(currMapPoint.data)
            const itemIndex = item.index
            dataArr[itemIndex] = item
            currMapPoint.data = JSON.stringify(dataArr)
            currMapPoint.isSaved = false
            onItemEditHandler(currMapPoint.getAsJson())
        }
    }

    const deleteDataItemByIndex = (index) => {
        const currItem = itemData[index]

        const filtered = itemData.filter(function (value) {
            return value !== currItem;
        })

        setItemData(filtered)
        currMapPoint.data = JSON.stringify(filtered)
        currMapPoint.isSaved = false
        onItemEditHandler(currMapPoint.getAsJson())
    }

    const getDropDownTitleByType = (type) => {
        for (let i = 0; i < dropDownItems.length; i++) {
            if (dropDownItems[i].type === type) {
                return dropDownItems[i].name
            }

        }
    }

    const changeItemType = (id, type) => {
        let newMapPointsArr = []
        for (let i = 0; i < itemData.length; i++) {
            if (i === id) {
                let newItem = getNewDataItemByType(type)
                newItem.name = itemData[i].name
                itemData[i] = newItem
            }
            newMapPointsArr.push(itemData[i])
        }

        setItemData(newMapPointsArr)
        currMapPoint.data = JSON.stringify(itemData)
        currMapPoint.isSaved = false
        onItemEditHandler(currMapPoint.getAsJson())
    }

    const onDeleteHandler = () => {
        setIsDeleting(true)
        setTimeout(() => {
            setIsDeleting(false)
        }, 3000)
    }

    const setActiveHandler = (value) => {
        setIsActive(value)
        currMapPoint.active = value
        currMapPoint.isSaved = false
        onItemEditHandler(currMapPoint.getAsJson())
    }

    const deleteHandler = () => {
        setIsSaving(true)
        setDeleteError(false)

        delay(0).then(() => {

            if (currMapPoint.id > 0) {
                deleteMapPointAPI(
                    currMapPoint.id
                ).then(data => {
                    if (data.hasOwnProperty('status')) {
                        if (data.status === 'ok') {
                            deleteMapPoint(currMapPoint.id)
                        }
                    }
                }).catch(() => {
                    setDeleteError(true)
                }).finally(() => {
                    setIsDeleting(false)
                    setIsSaving(false)
                })
            } else {
                mapPointsStore.deleteMapPointById(currMapPoint.id)

                setIsDeleting(false)
                setIsSaving(false)
            }
        })
    }

    const saveHandler = () => {

        setIsSaving(true)
        setSaveError(false)
        delay(0).then(() => {

            /***
             * Удаляем поле 'index' с каждого элемента
             ***/
            let newDataArr = []
            currMapPoint.dataJSON.map(dataItem => {
                delete dataItem.index
                newDataArr.push(dataItem)
            })


            if (currMapPoint.id < 0) {
                /***
                 * Сохраняем новый объект
                 ***/

                saveMapPointAPI(
                    currMapPoint.name,
                    currMapPoint.description,
                    currMapPoint.types,
                    // currMapPoint.google_map_url,
                    // currMapPoint.topics,
                    currMapPoint.active,
                    currMapPoint.created_by_user_id,
                    currMapPoint.created_date,
                    JSON.stringify(newDataArr),
                    currMapPoint.image_logo_file,
                ).then(data => {
                    if (data.hasOwnProperty('status')) {
                        if (data.status === 'ok') {
                            currMapPoint.isSaved = true

                            if (data.hasOwnProperty('image_logo')) {

                                currMapPoint.image_logo = data.image_logo
                                setItemImageLogo(data.image_logo + '?' + Date.now())
                            }

                            changeTopicId(data.id)
                            if (addToTourId) {
                                currMapPoint.id = data.id
                                addToTourId(data.id)
                            }
                        }
                    }
                }).catch(() => {
                    setSaveError(true)
                }).finally(() => {
                    setIsSaving(false)
                })
            } else {
                /***
                 * Пересохраняем объект
                 ***/
                changeMapPointAPI(
                    currMapPoint.id,
                    currMapPoint.name,
                    currMapPoint.description,
                    currMapPoint.types,
                    // currMapPoint.google_map_url,
                    // currMapPoint.topics,
                    currMapPoint.active,
                    currMapPoint.created_by_user_id,
                    currMapPoint.created_date,
                    // currMapPoint.data,
                    JSON.stringify(newDataArr),
                    currMapPoint.image_logo_file,
                ).then(data => {

                    if (data.hasOwnProperty('status')) {
                        if (data.status === 'ok') {
                            currMapPoint.isSaved = true

                            if (data.hasOwnProperty('image_logo')) {
                                currMapPoint.image_logo = data.image_logo
                                setItemImageLogo(data.image_logo + '?' + Date.now())
                            }

                            onItemEditHandler(currMapPoint.getAsJson(), newImageLogo)
                        }
                    }
                }).catch(() => {
                    currMapPoint.isSaved = false
                    setSaveError(true)
                }).finally(() => {
                    setIsSaving(false)
                })
            }
        })
    }

    const onFileChooseHandler = (fileName) => {
        if (fileName) {
            setNewImageLogo(true)
        } else {
            setNewImageLogo(false)
        }
        currMapPoint.image_logo_file = fileName
        currMapPoint.isSaved = false
        onItemEditHandler(currMapPoint.getAsJson())
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
                currMapPoint.types = JSON.stringify([...tourTypes, newType.id])
                currMapPoint.isSaved = false
                onItemEditHandler(currMapPoint.getAsJson())
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
                currMapPoint.types = JSON.stringify(filtered)
                currMapPoint.isSaved = false
                onItemEditHandler(currMapPoint.getAsJson())
            }
        } else {
            const filtered = tourTypes.filter(function (typeId) {
                return value !== typeId;
            })

            setTourTypes(filtered)
            currMapPoint.types = JSON.stringify(filtered)
            currMapPoint.isSaved = false
            onItemEditHandler(currMapPoint.getAsJson())
        }
    }

    if (mapPointsItems_load) {
        return <SpinnerSM/>
    } else {

        return (
            <div>

                <Row className={'h-25 align-items-center justify-content-center '}
                     style={{
                         borderBottom: '1px solid rgba(40, 44, 52, 0.2)',
                         marginBottom: '15px'
                     }}>
                </Row>

                <Row className={'topic-detail-row'}>
                    <div
                        className={'col-12 justify-content-between'}
                        style={{display: 'flex'}}
                    >
                        <div className={'col-10'}>
                            <input
                                type="categoryName"
                                id="formMapPointName"
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
                            // variant={setActiveError ? "outline-danger" : "outline-primary"}
                            variant={"outline-primary"}
                            checked={isActive}
                            value={'1'}
                            disabled={!!isSaving}
                            onChange={(e) => setActiveHandler(e.currentTarget.checked)}
                            style={{display: 'flex'}}
                        >
                            {isActive
                                ? <CircleOkIco
                                    fill='white'
                                    style={{
                                        width: '16px',
                                        height: '16px',
                                        marginBottom: '3px',
                                        marginRight: '5px',
                                    }}

                                />
                                : <CircleIco
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
                <Row className={'topic-detail-row'}>
                    <div className={'col-12 justify-content-center '}>
                    <textarea
                        className={'col-12'}
                        name="mapPointDescription"
                        id="mapPointDescription"
                        rows="3"
                        onChange={e => onDescriptionHandler(e.target.value)}
                        value={currDescription}
                        disabled={!!isSaving}
                    />
                    </div>
                </Row>

                <Row className={'topic-detail-row'}>
                    <div className={'d-flex flex-wrap'}>
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
                                    style={{
                                        margin: '0 3px'
                                    }}
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

                </Row>

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
                <Row className={'topic-detail-row'}>
                    <div>

                        {itemData.map(function (item, index) {
                            if (item.hasOwnProperty('type')) {
                                let child = null
                                item.index = index
                                switch (item.type) {
                                    default : {
                                        child = <TopicTextComponent
                                            item={item}
                                            dataItemEditHandler={dataItemEditHandler}
                                        />
                                        break
                                    }
                                    case 'googleMapUrl': {
                                        child = <TopicGoogleMapUrlComponent
                                            item={item}
                                            dataItemEditHandler={dataItemEditHandler}
                                        />
                                        break
                                    }
                                    case 'topic': {
                                        child = <MapPointTopicComponent
                                            item={item}
                                            dataItemEditHandler={dataItemEditHandler}
                                        />
                                        break
                                    }
                                    case 'agent': {
                                        child = <MapPointAgentComponent
                                            item={item}
                                            dataItemEditHandler={dataItemEditHandler}
                                        />
                                        break
                                    }
                                }

                                return <TopicItemCard
                                    key={index}
                                    index={index}
                                    child={child}
                                    dropDownItems={dropDownItems}
                                    changeItemType={changeItemType}
                                    deleteDataItemByIndex={deleteDataItemByIndex}
                                    title={getDropDownTitleByType(item.type)}
                                >
                                </TopicItemCard>
                            }
                        })}

                        <div className={'pt-3'}>
                            <TopicAddNewBtn
                                disabled={!!isSaving}
                                addNewItemHandler={addNewItemHandler}
                                dropDownItems={dropDownItems}
                            />
                        </div>
                    </div>
                </Row>
                <hr/>
                <Row className={'topic-detail-row d-flex justify-content-center pt-3'}>
                    <Button
                        className={`btn ${saveError ? 'btn-danger' : 'btn-primary'}  btn-lg btn-block col-6`}
                        disabled={!!isSaving}
                        onClick={saveHandler}
                    >Save</Button>
                </Row>
                <hr/>
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
            </div>
        );
    }
});

export default MapPointsDetailsPage;