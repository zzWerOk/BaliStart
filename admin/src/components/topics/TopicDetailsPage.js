import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import TopicCL from "../../classes/topicCL";
import {Button, Dropdown, DropdownButton, Image, Row, ToggleButton} from "react-bootstrap";
import noImageLogo from '../../img/nophoto.jpg'
import TopicItemCard from "./components/TopicItemCard";
import TopicTextComponent from "./components/TopicTextComponent";
import TopicCommentComponent from "./components/TopicCommentComponent";
import TopicListComponent from "./components/TopicListComponent";
import TopicLinkComponent from "./components/TopicLinkComponent";
import TopicEmailComponent from "./components/TopicEmailComponent";
import TopicPhoneComponent from "./components/TopicPhoneComponent";
import TopicImagesComponent from "./components/TopicImagesComponent";
import TopicGoogleMapUrlComponent from "./components/TopicGoogleMapUrlComponent";
import TopicAddNewBtn from "./components/TopicAddNewBTN";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";

import {ReactComponent as CircleIco} from "../../img/svg/circle.svg"
import {ReactComponent as CircleOkIco} from "../../img/svg/circle_ok.svg"
import {ReactComponent as CloseIco} from "../../img/svg/close.svg"
import SpinnerSM from "../SpinnerSM";
import {delay} from "../../utils/consts";
import {changeTopicAPI, deleteTopicAPI, getTopicData, saveTopicAPI, setActiveAPI} from "../../http/topicsAPI";
import {MDBFile} from "mdb-react-ui-kit";

const dropDownItems = [
    {
        id: 0,
        name: 'Text card',
        type: 'text',
    },
    {
        id: 1,
        name: 'Commend card',
        type: 'comment',
    },
    {
        id: 2,
        name: 'List card',
        type: 'list',
    },
    {
        id: 3,
        name: 'Link card',
        type: 'link',
    },
    {
        id: 4,
        name: 'Email card',
        type: 'email',
    },
    {
        id: 5,
        name: 'Phones card',
        type: 'phone',
    },
    {
        id: 6,
        name: 'Images card',
        type: 'images',
    },
    {
        id: 7,
        name: 'Google Map Url card',
        type: 'googleMapUrl',
    },
]
let currTopic = null

const TopicDetailsPage = observer((props) => {
    const {item, onItemEditHandler, deleteTopic} = props

    const {topicDetailsStore} = useContext(Context)
    const {topicsCategoryStore} = useContext(Context)

    const [canBeShared, setCanBeShared] = useState(true)
    const [setActiveError, setSetActiveError] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [saveError, setSaveError] = useState(false)
    const [deleteError, setDeleteError] = useState(false)
    const [currName, setCurrName] = useState('')
    const [currDescription, setCurrDescription] = useState('')
    const [itemData, setItemData] = useState([])
    const [topicTags, setTopicTags] = useState([])
    const [isActive, setIsActive] = useState(true)
    const [itemImageLogo, setItemImageLogo] = useState('')
    const [newImageLogo, setNewImageLogo] = useState(false)
    const [topicCategoriesItems, setTopicCategoriesItems] = useState([])
    const [topicCategoriesItems_load, setTopicCategoriesItems_load] = useState(true)

    useEffect(
        () => {
            currTopic = new TopicCL()

            setTopicCategoriesItems_load(true)
            currTopic.setFromJson(item)
            setCurrName(currTopic.name)
            setCurrDescription(currTopic.description)
            setIsActive(currTopic.active)
            setTopicCategoriesItems(topicsCategoryStore.getSavedTopicsCategoryList())
            setTopicTags(currTopic.tagJSON)

            if (item.image_logo) {
                if (item.id >= 0) {
                    setItemImageLogo(currTopic.image_logo + '?' + Date.now())
                }
            }

            // setItemImageLogo(currTopic.image_logo + '?' + Date.now())

            if (Object.keys(currTopic.dataJSON).length === 0) {
                delay(0).then(r => {
                    if (currTopic.id > -1) {
                        getTopicData(currTopic.id).then(data => {
                            if (data.hasOwnProperty('status')) {
                                if (data.status === 'ok') {
                                    currTopic.data = data.data
                                }
                            }
                        }).finally(() => {
                            setItemData(currTopic.dataJSON)
                            setTopicCategoriesItems_load(false)
                        })
                    } else {
                        setTopicCategoriesItems_load(false)
                    }
                })
            } else {
                setItemData(currTopic.dataJSON)
                setTopicCategoriesItems_load(false)
            }

        }, []
    )

    const onNameHandler = (value) => {
        setCurrName(value)
        currTopic.name = value
        currTopic.isSaved = false
        onItemEditHandler(currTopic.getAsJson())
    }

    const changeTopicId = (id) => {
        currTopic.newId = id
        onItemEditHandler(currTopic.getAsJson(), newImageLogo)
    }

    const onDescriptionHandler = (value) => {
        setCurrDescription(value)
        currTopic.description = currDescription
        currTopic.isSaved = false
        onItemEditHandler(currTopic.getAsJson())
    }

    const getNewDataItemByType = (type) => {
        let newItem = {}
        switch (type) {
            case "text":
                newItem = {"type": type, "name": "", "text": ""}
                break
            case "comment":
                newItem = {"type": type, "name": "", "text": ""}
                break
            case "list":
                newItem = {"type": type, "name": "", "items": '[""]'}
                break
            case "link":
                newItem = {"type": type, "name": "", "items": '[{"type":"","link":""}]'}
                break
            case "email":
                newItem = {"type": type, "name": "", "email": ""}
                break
            case "phone":
                newItem = {"type": type, "name": "", "items": '[{"type":"","phone":""}]'}
                break
            case "images":
                newItem = {"type": type, "name": "", "items": '[""]'}
                break
            case "googleMapUrl":
                newItem = {"type": type, "name": "", "url": ""}
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

        currTopic.addNewItemJSON(newItem)
        currTopic.isSaved = false
        onItemEditHandler(currTopic.getAsJson())

        setItemData(currTopic.dataJSON)

        // the function only changes when any of these dependencies change
    }, [topicDetailsStore, currTopic])

    const addNewTagHandler = (value) => {
        let newCategory = null

        for (let i = 0; i < topicCategoriesItems.length; i++) {
            if (topicCategoriesItems[i].id === value) {
                newCategory = topicCategoriesItems[i]
            }
        }

        if (newCategory) {
            const found = topicTags.find(element => element === newCategory.id)
            if (!found) {
                setTopicTags([...topicTags, newCategory.id])
                currTopic.tag = JSON.stringify([...topicTags, newCategory.id])
                currTopic.isSaved = false
                onItemEditHandler(currTopic.getAsJson())
            }
        }
    }

    const dataItemEditHandler = (item) => {
        if (item.hasOwnProperty('index')) {
            let dataArr = JSON.parse(currTopic.data)
            const itemIndex = item.index
            dataArr[itemIndex] = item
            currTopic.data = JSON.stringify(dataArr)
            currTopic.isSaved = false
            onItemEditHandler(currTopic.getAsJson())
        }
    }

    const deleteNewTagHandler = (value) => {
        let newCategory = null

        for (let i = 0; i < topicCategoriesItems.length; i++) {
            if (topicCategoriesItems[i].id === value) {
                newCategory = topicCategoriesItems[i]
            }
        }

        if (newCategory) {
            const found = topicTags.find(element => element === newCategory.id)
            if (found) {
                const filtered = topicTags.filter(function (value, index, arr) {
                    return value !== found;
                })
                setTopicTags(filtered)
                currTopic.tag = JSON.stringify(filtered)
                currTopic.isSaved = false
                onItemEditHandler(currTopic.getAsJson())

            }
        }
    }

    const getDropDownTitleByType = (type) => {
        for (let i = 0; i < dropDownItems.length; i++) {
            if (dropDownItems[i].type === type) {
                return dropDownItems[i].name
            }

        }
    }

    const getTagNameById = (id) => {
        for (let i = 0; i < topicCategoriesItems.length; i++) {
            if (topicCategoriesItems[i].id === id) {
                return topicCategoriesItems[i].category_name
            }
        }
    }

    const deleteDataItemByIndex = (index) => {
        const currItem = itemData[index]

        const filtered = itemData.filter(function (value, index, arr) {
            return value !== currItem;
        })

        setItemData(filtered)
        currTopic.data = JSON.stringify(filtered)
        currTopic.isSaved = false
        onItemEditHandler(currTopic.getAsJson())
    }

    const changeItemType = (id, type) => {
        let newArr = []
        for (let i = 0; i < itemData.length; i++) {
            if (i === id) {
                let newItem = getNewDataItemByType(type)
                newItem.name = itemData[i].name
                itemData[i] = newItem
            }
            newArr.push(itemData[i])
        }

        setItemData(newArr)
        currTopic.data = JSON.stringify(itemData)
        currTopic.isSaved = false
        onItemEditHandler(currTopic.getAsJson())
    }

    const onDeleteHandler = () => {
        setIsDeleting(true)
        setTimeout(() => {
            setIsDeleting(false)
        }, 3000)
    }


    const setActiveHandler = (value) => {
        setIsActive(value)
        currTopic.active = value
        currTopic.isSaved = false
        onItemEditHandler(currTopic.getAsJson())
    }

    const deleteHandler = () => {
        setIsSaving(true)
        setDeleteError(false)

        delay(0).then(r => {

            if (currTopic.id > 0) {
                deleteTopicAPI(
                    currTopic.id
                ).then(data => {
                    if (data.hasOwnProperty('status')) {
                        if (data.status === 'ok') {
                            deleteTopic(currTopic.id)
                        }
                    }
                }).catch(() => {
                    setDeleteError(true)
                }).finally(() => {
                    setIsDeleting(false)
                    setIsSaving(false)
                })
            } else {
                setIsDeleting(false)
                setIsSaving(false)
            }
        })
    }

    const saveHandler = () => {

        setIsSaving(true)
        setSaveError(false)
        delay(0).then(r => {

            if (currTopic.id < 0) {
                saveTopicAPI(
                    // currTopic.
                    currTopic.name,
                    currTopic.description,
                    currTopic.tag,
                    currTopic.image_logo,
                    currTopic.images,
                    currTopic.videos,
                    currTopic.google_map_url,
                    currTopic.active,
                    currTopic.created_by_user_id,
                    currTopic.created_date,
                    currTopic.deleted_by_user_id,
                    currTopic.deleted_date,
                    currTopic.data,
                    currTopic.image_logo_file,
                ).then(data => {
                    if (data.hasOwnProperty('status')) {
                        if (data.status === 'ok') {
                            currTopic.isSaved = true

                            if (data.hasOwnProperty('image_logo')) {

                                currTopic.image_logo = data.image_logo
                                setItemImageLogo(data.image_logo + '?' + Date.now())
                            }

                            changeTopicId(data.id)
                        }
                    }
                }).catch(() => {
                    setSaveError(true)
                }).finally(() => {
                    setIsSaving(false)
                })
            } else {
                changeTopicAPI(
                    currTopic.id,
                    currTopic.name,
                    currTopic.description,
                    currTopic.tag,
                    currTopic.image_logo,
                    currTopic.images,
                    currTopic.videos,
                    currTopic.google_map_url,
                    currTopic.active,
                    currTopic.created_by_user_id,
                    currTopic.created_date,
                    currTopic.deleted_by_user_id,
                    currTopic.deleted_date,
                    currTopic.data,
                    currTopic.image_logo_file,
                ).then(data => {

                    if (data.hasOwnProperty('status')) {
                        if (data.status === 'ok') {
                            currTopic.isSaved = true

                            if (data.hasOwnProperty('image_logo')) {
                                currTopic.image_logo = data.image_logo
                                setItemImageLogo(data.image_logo + '?' + Date.now())
                            }

                            onItemEditHandler(currTopic.getAsJson(), newImageLogo)
                        }
                    }
                }).catch(() => {
                    currTopic.isSaved = false
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
        currTopic.image_logo_file = fileName
        currTopic.isSaved = false
        onItemEditHandler(currTopic.getAsJson())
    }

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

            <Row>
                <div
                    className={'col-sm-5 justify-content-start '}
                    style={{display: 'flex'}}
                >
                    <input
                        type="categoryName"
                        id="formTopicName"
                        className="form-control"
                        placeholder='Category'
                        value={currName}
                        disabled={!!isSaving}
                        onChange={e => onNameHandler(e.target.value)}
                    />
                    <ToggleButton
                        id="toggle-active"
                        type="checkbox"
                        variant={setActiveError ? "outline-danger" : "outline-primary"}
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
            <Row>
                <div className={'col-lg-10 justify-content-center '}>
                    <textarea
                        name="topicDescription"
                        id="topicDescription"
                        cols="50" rows="3"
                        onChange={e => onDescriptionHandler(e.target.value)}
                        value={currDescription}
                        disabled={!!isSaving}
                    />
                </div>
            </Row>
            <Row>
                {topicCategoriesItems_load
                    ?
                    <SpinnerSM/>
                    :
                    <div style={{display: 'flex'}}>
                        <Dropdown>
                            <Dropdown.Toggle
                                variant="outline-secondary"
                                size="sm"
                                id="dropdown-tag"
                                disabled={!!isSaving}
                            >
                                Add category tag
                            </Dropdown.Toggle>

                            <Dropdown.Menu>

                                {topicCategoriesItems.map(item => {
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
                            topicTags.map(item => {
                                return <Button
                                    key={item}
                                    className="badge btn-secondary"
                                    disabled={!!isSaving}
                                    style={{
                                        margin: '0 3px'
                                    }}
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
            <Row>
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
            <Row>
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
                                case 'comment': {
                                    child = <TopicCommentComponent
                                        item={item}
                                        dataItemEditHandler={dataItemEditHandler}
                                    />
                                    break
                                }
                                case 'list': {
                                    child = <TopicListComponent
                                        item={item}
                                        dataItemEditHandler={dataItemEditHandler}
                                    />
                                    break
                                }
                                case 'link': {
                                    child = <TopicLinkComponent
                                        item={item}
                                        dataItemEditHandler={dataItemEditHandler}
                                    />
                                    break
                                }
                                case 'email': {
                                    child = <TopicEmailComponent
                                        item={item}
                                        dataItemEditHandler={dataItemEditHandler}
                                    />
                                    break
                                }
                                case 'phone': {
                                    child = <TopicPhoneComponent
                                        item={item}
                                        dataItemEditHandler={dataItemEditHandler}
                                    />
                                    break
                                }
                                case 'images': {
                                    child = <TopicImagesComponent
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

                    <TopicAddNewBtn
                        disabled={!!isSaving}
                        addNewItemHandler={addNewItemHandler}
                        dropDownItems={dropDownItems}
                    />
                </div>
            </Row>
            <Row>
                <Button
                    className={`btn ${saveError ? 'btn-danger' : 'btn-primary'}  btn-lg w-75 btn-block`}
                    disabled={!!isSaving}
                    onClick={saveHandler}
                >Save</Button>
            </Row>
            <Row>
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
});

export default TopicDetailsPage;