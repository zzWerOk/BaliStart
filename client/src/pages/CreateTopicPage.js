import React, {useCallback, useContext, useEffect, useState} from 'react';
import FeedTopBar from "../components/mainpage/FeedTopBar";
import {Col, Row} from "react-bootstrap";
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

const CreateTopicPage = (props) => {
    const {categoryId} = props

    const {topicsCategoryStore} = useContext(Context)

    const [isSaving, setIsSaving] = useState(false)

    const [loading, setLoading] = useState(true)
    const [loadingCat, setLoadingCat] = useState(true)
    const [categoriesItems, setCategoriesItems] = useState([])

    const [newTopicName, setNewTopicName] = useState('')
    const [newTopicDescription, setNewTopicDescription] = useState('')
    const [newTopicSelectedCategoryId, setNewTopicSelectedCategoryId] = useState('')
    const [newTopicSelectedCategoryLabelText, setNewTopicSelectedCategoryLabelText] = useState('Select topic category')
    const [newTopicImage, setNewTopicImage] = useState('')
    const [newTopicImageFile, setNewTopicImageFile] = useState(null)
    const [imagesAdd, setImagesAdd] = useState({})

    const [newTopicDataElements, setNewTopicDataElements] = useState([])

    const [isDragDisables, setIsDragDisables] = useState(false)

    useEffect(() => {
        setLoading(true)

        if(categoryId) {
            newTopicSelectedCategoryIdChangeHandler(categoryId + "")
        }

        if (!topicsCategoryStore.loaded) {
            const sortCode = localStorage.getItem("sort_code_Categories") || 'alpha'
            getCategoriesData(sortCode, '')
        } else {
            setCatItems()
            setLoading(false)
        }

    }, [])

    const setCatItems = () => {
        setLoadingCat(true)
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
            setCatItems()
            setLoading(false)
        })

    }

    const newTopicNameChangeHandler = (text) => {
        setNewTopicName(text)
    }

    const newTopicDescriptionChangeHandler = (text) => {
        setNewTopicDescription(text)
    }

    const newTopicSelectedCategoryIdChangeHandler = (catId) => {
        if (catId !== '-1' || catId !== '') {
            setNewTopicSelectedCategoryLabelText('Topic category')
        } else {
            setNewTopicSelectedCategoryLabelText('Select topic category')
        }
        setNewTopicSelectedCategoryId(catId)
    }

    const newTopicImageChangeHandler = (imageUrl) => {
        setNewTopicImageFile(imageUrl)
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
    }

    const dataItemEditHandler = (item) => {
        if (item.hasOwnProperty('index')) {
            let dataArr = JSON.parse(JSON.stringify(newTopicDataElements))
            const itemIndex = item.index
            dataArr[itemIndex] = item
            setNewTopicDataElements(dataArr)

            // currTopic.isSaved = false
            // onItemEditHandler(currTopic.getAsJson())
        }
    }

    const onFilesAddHandler = (fileName, imageListIndex) => {

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
            }
            return !isThere
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

        currImagesList[imageListIndex] = newCurrList
        setImagesAdd(currImagesList)

    }


    const onDragEnd = useCallback((params) => {
        const srcIndex = params.source.index
        const dstIndex = params.destination?.index

        if (dstIndex !== null) {
            if (dstIndex !== undefined) {
                let elementsArr = JSON.parse(JSON.stringify(newTopicDataElements))
                elementsArr.splice(dstIndex, 0, elementsArr.splice(srcIndex, 1)[0])

                setNewTopicDataElements(elementsArr)
            }
        }
    }, [newTopicDataElements]);

    const isDragDisableHandler = (value) => {
        setIsDragDisables(value)
    }

    if (loading || loadingCat) {
    } else {

        return (
            <div
            >
                <div
                    style={{marginTop: '20px', flex: '1'}}
                >
                    <FeedTopBar
                        isBackBtn={true}
                        backBtnTitle={'Back'}
                    />

                    <div className={'d-flex'}
                         style={{height: 'calc(100vh - 129px'}}
                    >
                        <Col
                            style={{overflowX: 'hidden', overflowY: 'auto'}}
                        >
                            <Row className={`d-flex flex-column align-items-center`}>
                                <div className={'col-10'}>
                                    <BaliInput text={newTopicName}
                                               labelText={'Topic name'}
                                               onTextChangeHandler={newTopicNameChangeHandler}
                                    />
                                </div>
                                <div className={'col-10'}>
                                    <BaliTextArea text={newTopicDescription}
                                                  labelText={'Topic description'}
                                                  onTextChangeHandler={newTopicDescriptionChangeHandler}
                                    />
                                </div>
                                <div className={'col-10'}>
                                    <div className={'col-6'}>
                                        <BaliSelect items={categoriesItems}
                                                    selectedItemCode={newTopicSelectedCategoryId}
                                                    labelText={newTopicSelectedCategoryLabelText}
                                                    onItemSelectHandler={newTopicSelectedCategoryIdChangeHandler}
                                        />
                                    </div>
                                </div>
                                <div className={'col-10'}>
                                    <BaliFileUpload image={newTopicImage}
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
                                                            const itemKey = item.type + index

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
                                                                                    title={getNewTopicElementTitleByType(item.type)}
                                                                                    dropDownItems={addNewElementItems}
                                                                                    child={child}
                                                                                    isDragDisableHandler={isDragDisableHandler}
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
        );
    }
};

export default CreateTopicPage;