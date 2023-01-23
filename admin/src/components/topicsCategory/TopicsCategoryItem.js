import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {ListGroup} from "react-bootstrap";

const TopicsCategoryItem = (props) => {
    const [currName, setCurrName] = useState('')
    const [currDescription, setCurrDescription] = useState('')
    const {buttons, isNameEdit} = props
    const {addItemTrigger, changeName, changeDescription} = props
    const {cancelEditItem, editItemTrigger} = props
    const {loadingEditItem} = props
    const {saveError} = props

    const [savedName, setSavedName] = useState('')
    const [savedDescription, setSavedDescription] = useState('')

    const saveStartTrigger = () => {
        cancelEditItem(true)
    }

    const saveTrigger = () => {
        cancelEditItem(false)
        setSavedName(currName)
        setSavedDescription(currDescription)
    }

    const isForTour = (value) => {
        // console.log(value)
    }

    useEffect(() => {
        if (addItemTrigger) {
            addItemTrigger.added = alertTrigger
            addItemTrigger.clear = alertTrigger
        }

        if (editItemTrigger) {
            editItemTrigger.cancel = editCancelTrigger
            editItemTrigger.saveStart = saveStartTrigger
            editItemTrigger.save = saveTrigger
            editItemTrigger.delete = saveTrigger
            editItemTrigger.isForTour = isForTour
        }

    }, [])


    useMemo(() => {
        try {
            if (props) {
                if (props.hasOwnProperty('name')) {
                    setCurrName(props.name || '')
                    setSavedName(props.name || '')
                }
                if (props.hasOwnProperty('description')) {
                    setCurrDescription(props.description || '')
                    setSavedDescription(props.description || '')
                }
            }
        } catch (e) {
        }
    }, [])


    const alertTrigger = () => {
        if (changeName) {
            changeName('')
            changeDescription('')
        }
        setCurrName('')
        setCurrDescription('')
    }

    const editCancelTrigger = () => {
        cancelEditItem(false)
        setCurrName(savedName)
        setCurrDescription(savedDescription)
    }


    const onNameHandler = (value) => {
        if (isNameEdit) {
            if (changeName) {
                changeName(value)
            }
            setCurrName(value)
        }
    }

    const onDescriptionHandler = (value) => {
        if (isNameEdit) {
            if (changeDescription) {
                changeDescription(value)
            }
            setCurrDescription(value)
        }
    }

    return (
        <ListGroup.Item
            style={{display: 'flex'}}

            className={saveError ? 'list-group-item-danger' : ''}
        >
            <input
                type="categoryName"
                id="formCategoryName"
                className="form-control"
                placeholder='Category'
                value={currName}
                disabled={!!loadingEditItem}
                onChange={e => onNameHandler(e.target.value)}
            />
            <input
                id="formCategoryDescription"
                className="form-control"
                placeholder='Description'
                value={currDescription}
                disabled={!!loadingEditItem}
                onChange={e => onDescriptionHandler(e.target.value)}
            />
            {buttons()}
        </ListGroup.Item>
    );
};

export default TopicsCategoryItem;