import React, {useContext, useRef, useState} from 'react';
import TopicsCategoryItem from "./TopicsCategoryItem";
import {Button, ToggleButton} from "react-bootstrap";
import {delay} from "../../utils/consts";
import {ReactComponent as CircleOkIco} from "../../img/svg/circle_ok.svg";
import {ReactComponent as CircleIco} from "../../img/svg/circle.svg";
import SpinnerSm from "../SpinnerSM";

const TopicsCategoryItemReady = (props) => {
    // const {topicsCategoryStore} = useContext(Context)
    const editItemTrigger = useRef(null)

    const {onDeleteItemTrigger, changeAPI, deleteAPI, categoriesStore} = props

    const [isNameEdit, setIsNameEdit] = useState(false)
    const [loadingEditItem, setLoadingEditItem] = useState(false)
    const [saveError, setSaveError] = useState(false)

    const [isLoading, setIsLoading] = useState(true)

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [itemId, setItemId] = useState('')
    const [isForTourActive, setIsForTourActive] = useState(false)
    const [isForTourVisible, setIsForTourVisible] = useState(false)

    React.useEffect(() => {
        setIsLoading(true)
        try {
            if (props) {
                if (props.hasOwnProperty('name')) {
                    // name = props['name']
                    setName(props['name'])
                }
                if (props.hasOwnProperty('description')) {
                    // description = props['description']
                    setDescription(props['description'])
                }
                if (props.hasOwnProperty('is_for_tour')) {
                    setIsForTourActive(props['is_for_tour'])
                    setIsForTourVisible(true)
                }
                if (props.hasOwnProperty('id')) {
                    // itemId = props['id']
                    setItemId(props['id'])
                }
            }
        } catch (e) {
        }
        setIsLoading(false)
    }, [])

    const cancelEditItem = (cancel) => {
        setIsNameEdit(cancel)
    }

    const saveStartHandler = () => {
        editItemTrigger.saveStart()
    }


    const deleteHandler = () => {
        editItemTrigger.delete()

        setLoadingEditItem(true)
        delay(0).then(r => {
            deleteAPI(itemId).then(data => {
                setSaveError(true)
                if (data.hasOwnProperty('status')) {
                    if (data.status === 'ok') {
                        if (categoriesStore.deleteItem(itemId)) {
                            categoriesStore.saveCategoriesList()
                            setSaveError(false)
                            onDeleteItemTrigger(itemId)
                        }
                    }
                }
            }).catch(() => {
                setSaveError(true)
            }).finally(() => {
                setLoadingEditItem(false)
            })
        })
    }

    const saveHandler = () => {
        editItemTrigger.save()

        setLoadingEditItem(true)
        setSaveError(false)
        delay(0).then(r => {
            changeAPI(itemId, name, description, isForTourActive).then(data => {
                setSaveError(true)
                if (data.hasOwnProperty('status')) {
                    if (data.status === 'ok') {
                        if (categoriesStore.editItem(name, description, isForTourActive, itemId)) {
                            categoriesStore.saveCategoriesList()
                            setSaveError(false)
                        }
                    }
                }
            }).catch(() => {
                setSaveError(true)
            }).finally(() => {
                setLoadingEditItem(false)
            })
        })
    }

    const changeName = (newName) => {
        // name = newName
        setName(newName)
    }
    const changeDescription = (newDescription) => {
        // description = newDescription
        setDescription(newDescription)
    }

    const setIsTourActiveHandler = (value) => {
        // editItemTrigger.isForTour(value)
        // is_for_tour = value
        setIsForTourActive(value)
    }

    const buttons = () => (<div style={{display: 'flex', marginLeft: '10px'}}>
        {
            isNameEdit ?

                <div style={{display: 'flex'}}>
                    {isForTourVisible ?
                        <ToggleButton
                            id={"toggle-is-for-tour-" + name}
                            type="checkbox"
                            variant={"outline-secondary"}
                            checked={isForTourActive}
                            value={'1'}
                            // disabled={!!isSaving}
                            onChange={(e) => setIsTourActiveHandler(e.currentTarget.checked)}
                            style={{display: 'flex', marginRight: '5px'}}
                        >
                            {isForTourActive
                                ?
                                <CircleOkIco
                                    fill='white'
                                    style={{
                                        width: '16px',
                                        height: '16px',
                                        marginTop: '4px',
                                        marginRight: '5px',
                                    }}

                                />
                                :
                                <CircleIco
                                    fill='gray'
                                    style={{
                                        width: '16px',
                                        height: '16px',
                                        marginTop: '4px',
                                        marginRight: '5px',
                                    }}
                                />
                            }
                            Tour
                        </ToggleButton>
                        : ''
                    }
                    <Button
                        variant={saveError ? 'danger' : 'primary'}
                        style={{marginRight: '5px'}}
                        disabled={!!loadingEditItem}
                        onClick={() => {
                            saveHandler()
                        }}
                    >Save
                    </Button>
                </div>
                :
                <Button
                    variant={saveError ? 'danger' : 'outline-warning'}
                    style={{marginRight: '5px'}}
                    disabled={!!loadingEditItem}
                    onClick={() => {
                        saveStartHandler()
                    }}
                >Edit
                </Button>
        }
        {
            isNameEdit ? <Button
                    variant='outline-secondary'
                    disabled={!!loadingEditItem}
                    onClick={() => {
                        // cancelEditItem()
                        editItemTrigger.cancel()
                    }}
                >Cancel</Button>
                :
                <Button
                    variant='outline-danger'
                    disabled={!!loadingEditItem}
                    onClick={() => {
                        deleteHandler()
                    }}
                >Delete</Button>
        }
    </div>);


    if (isLoading) {
        return <SpinnerSm/>
    } else {

        return (<TopicsCategoryItem
            buttons={buttons}
            name={name}
            description={description}
            isNameEdit={isNameEdit}
            changeName={changeName}
            changeDescription={changeDescription}
            editItemTrigger={editItemTrigger}
            cancelEditItem={cancelEditItem}
            loadingEditItem={loadingEditItem}
            saveError={saveError}
        />);
    }
};

export default TopicsCategoryItemReady;