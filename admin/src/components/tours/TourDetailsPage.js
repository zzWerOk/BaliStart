import React, {useContext, useEffect, useState} from 'react';
import {Button, Dropdown, DropdownButton, Image, Row, ToggleButton} from "react-bootstrap";
import noImageLogo from '../../img/nophoto.jpg'
import {Context} from "../../index";
import {observer} from "mobx-react-lite";

import {ReactComponent as CircleIco} from "../../img/svg/circle.svg"
import {ReactComponent as CircleOkIco} from "../../img/svg/circle_ok.svg"
import {ReactComponent as CloseIco} from "../../img/svg/close.svg"
import SpinnerSM from "../SpinnerSM";
import {delay} from "../../utils/consts";
import {MDBFile} from "mdb-react-ui-kit";
import {changeTourAPI, deleteTourAPI, saveTourAPI} from "../../http/toursAPI";
import TourCL from "../../classes/tourCL";

// const dropDownItems = [
//     {
//         id: 0,
//         name: 'Text card',
//         type: 'text',
//     },
//     {
//         id: 1,
//         name: 'Commend card',
//         type: 'comment',
//     },
//     {
//         id: 2,
//         name: 'List card',
//         type: 'list',
//     },
//     {
//         id: 3,
//         name: 'Link card',
//         type: 'link',
//     },
//     {
//         id: 4,
//         name: 'Email card',
//         type: 'email',
//     },
//     {
//         id: 5,
//         name: 'Phones card',
//         type: 'phone',
//     },
//     {
//         id: 6,
//         name: 'Images card',
//         type: 'images',
//     },
//     {
//         id: 7,
//         name: 'Google Map Url card',
//         type: 'googleMapUrl',
//     },
// ]

let currTour = null

const TourDetailsPage = observer((props) => {
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
    const [tourCategoriesItems_load, setTourCategoriesItems_load] = useState(true)
    const [tourTypesItems, setTourTypesItems] = useState([])
    const [tourTypeItems_load, setTourTypeItems_load] = useState(true)
    const [tourTags, setTourTags] = useState([])
    const [tourTypes, setTourTypes] = useState([])

    useEffect(
        () => {

            currTour = new TourCL()

            setTourCategoriesItems_load(true)
            currTour.setFromJson(item)
            setCurrName(currTour.name)
            setCurrDescription(currTour.description)
            setIsActive(currTour.active)
            setTourCategoriesItems(toursCategoryStore.getSavedCategoriesList())
            setTourTypesItems(toursTypeStore.getSavedCategoriesList())
            setTourTags(currTour.tour_categoryJSON)
            setTourTypes(currTour.tour_typeJSON)

            if (item.image_logo) {
                if (item.id >= 0) {
                    setItemImageLogo(currTour.image_logo + '?' + Date.now())
                }
            }

            // setItemImageLogo(currTour.image_logo + '?' + Date.now())

            // if (Object.keys(currTour.dataJSON).length === 0) {
            //     delay(0).then(r => {
            //         if (currTour.id > -1) {
            //             getTourData(currTour.id).then(data => {
            //                 if (data.hasOwnProperty('status')) {
            //                     if (data.status === 'ok') {
            //                         currTour.data = data.data
            //                     }
            //                 }
            //             }).finally(() => {
            //                 setItemData(currTour.dataJSON)
            //                 setTopicCategoriesItems_load(false)
            //             })
            //         } else {
            //             setTopicCategoriesItems_load(false)
            //         }
            //     })
            // } else {
            //     setItemData(currTour.dataJSON)
            //     setTopicCategoriesItems_load(false)
            // }
            setTourCategoriesItems_load(false)
        }, []
    )

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

    // const getNewDataItemByType = (type) => {
    //     let newItem = {}
    //     switch (type) {
    //         case "text":
    //             newItem = {"type": type, "name": "", "text": ""}
    //             break
    //         case "comment":
    //             newItem = {"type": type, "name": "", "text": ""}
    //             break
    //         case "list":
    //             newItem = {"type": type, "name": "", "items": '[""]'}
    //             break
    //         case "link":
    //             newItem = {"type": type, "name": "", "items": '[{"type":"","link":""}]'}
    //             break
    //         case "email":
    //             newItem = {"type": type, "name": "", "email": ""}
    //             break
    //         case "phone":
    //             newItem = {"type": type, "name": "", "items": '[{"type":"","phone":""}]'}
    //             break
    //         case "images":
    //             newItem = {"type": type, "name": "", "items": '[""]'}
    //             break
    //         case "googleMapUrl":
    //             newItem = {"type": type, "name": "", "url": ""}
    //             break
    //     }
    //     return newItem
    // }

    // const addNewItemHandler = useCallback((value) => {
    //     let type = ''
    //
    //     for (let i = 0; i < dropDownItems.length; i++) {
    //         if (dropDownItems[i].id === value) {
    //             type = dropDownItems[i].type
    //         }
    //     }
    //
    //     let newItem = getNewDataItemByType(type)
    //
    //     currTour.addNewItemJSON(newItem)
    //     currTour.isSaved = false
    //     onItemEditHandler(currTour.getAsJson())
    //
    //     setItemData(currTour.dataJSON)
    //
    //     // the function only changes when any of these dependencies change
    // }, [topicDetailsStore, currTour])

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

    // const dataItemEditHandler = (item) => {
    //     if (item.hasOwnProperty('index')) {
    //         let dataArr = JSON.parse(currTour.data)
    //         const itemIndex = item.index
    //         dataArr[itemIndex] = item
    //         currTour.data = JSON.stringify(dataArr)
    //         currTour.isSaved = false
    //         onItemEditHandler(currTour.getAsJson())
    //     }
    // }

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
                const filtered = tourTags.filter(function (value, index, arr) {
                    return value !== found;
                })
                setTourTags(filtered)
                currTour.tour_category = JSON.stringify(filtered)
                currTour.isSaved = false
                onItemEditHandler(currTour.getAsJson())
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
                const filtered = tourTypes.filter(function (value, index, arr) {
                    return value !== found;
                })
                setTourTypes(filtered)
                currTour.tour_type = JSON.stringify(filtered)
                currTour.isSaved = false
                onItemEditHandler(currTour.getAsJson())
            }
        }
    }

    // const getDropDownTitleByType = (type) => {
    //     for (let i = 0; i < dropDownItems.length; i++) {
    //         if (dropDownItems[i].type === type) {
    //             return dropDownItems[i].name
    //         }
    //
    //     }
    // }

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

    // const deleteDataItemByIndex = (index) => {
    //     const currItem = itemData[index]
    //
    //     const filtered = itemData.filter(function (value, index, arr) {
    //         return value !== currItem;
    //     })
    //
    //     setItemData(filtered)
    //     currTour.data = JSON.stringify(filtered)
    //     currTour.isSaved = false
    //     onItemEditHandler(currTour.getAsJson())
    // }

    // const changeItemType = (id, type) => {
    //     let newArr = []
    //     for (let i = 0; i < itemData.length; i++) {
    //         if (i === id) {
    //             let newItem = getNewDataItemByType(type)
    //             newItem.name = itemData[i].name
    //             itemData[i] = newItem
    //         }
    //         newArr.push(itemData[i])
    //     }
    //
    //     setItemData(newArr)
    //     currTour.data = JSON.stringify(itemData)
    //     currTour.isSaved = false
    //     onItemEditHandler(currTour.getAsJson())
    // }

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

    const deleteHandler = () => {
        setIsSaving(true)
        setDeleteError(false)

        delay(0).then(r => {

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
                setIsDeleting(false)
                setIsSaving(false)
            }
        })
    }

    const saveHandler = () => {

        setIsSaving(true)
        setSaveError(false)
        delay(0).then(r => {

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
                    currTour.image_logo_file,
                ).then(data => {
                    if (data.hasOwnProperty('status')) {
                        if (data.status === 'ok') {
                            currTour.isSaved = true

                            if (data.hasOwnProperty('image_logo')) {

                                currTour.image_logo = data.image_logo
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
                    currTour.image_logo_file,
                ).then(data => {

                    if (data.hasOwnProperty('status')) {
                        if (data.status === 'ok') {
                            currTour.isSaved = true

                            if (data.hasOwnProperty('image_logo')) {
                                currTour.image_logo = data.image_logo
                                setItemImageLogo(data.image_logo + '?' + Date.now())
                            }

                            onItemEditHandler(currTour.getAsJson(), newImageLogo)
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
                {/***
                     ACTIVE BTN
                     ***/}
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
                {tourCategoriesItems_load
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
                {tourCategoriesItems_load
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
                                    className="badge btn-secondary"
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
                }

            </Row>
            <Row>

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

export default TourDetailsPage;