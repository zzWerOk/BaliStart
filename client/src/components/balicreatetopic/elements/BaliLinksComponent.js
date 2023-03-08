import React, {useCallback, useEffect, useState} from 'react';
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import DragIcon from '../../../assets/svg/drag-handle.svg';
import {addNewLinksElement} from "../../../utils/consts";
import '../BaliTextArea.css'
import BaliInput from "../BaliInput";

const BaliLinksComponent = (props) => {
    const {item, dataItemEditHandler, noName} = props

    const [linkName, setLinkName] = useState('')
    const [links, setLinks] = useState('[{"type":"","link":""}]')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if(item) {
            if (item.name) {
                setLinkName(item.name)
            } else {
                setLinkName('')
            }
            if (item.items) {
                setLinks(item.items)
            } else {
                setLinks('[]')
            }
        }else{
            setLinkName('')
            setLinks('[]')
        }
        setLoading(false)
    }, [])

    const handleName = (value) => {
        item.name = value
        setLinkName(value)
        dataItemEditHandler(item)
    }

    const itemLinksEdit = (text, index) => {
        let newArr = JSON.parse(links)
        let currItem = newArr[index]
        currItem.link = text
        newArr[index] = currItem
        setLinks(JSON.stringify(newArr))

        item.items = JSON.stringify(newArr)
        dataItemEditHandler(item)
    }

    const handleSelect = (value, index) => {
        let newArr = JSON.parse(links)
        let currItem = newArr[index]
        currItem.type = value
        newArr[index] = currItem
        setLinks(JSON.stringify(newArr))

        item.items = JSON.stringify(newArr)
        dataItemEditHandler(item)
    }

    const newItemAddHandler = () => {
        let itemsArr = JSON.parse(links)
        itemsArr.push({"type": "in", "link": ""})
        setLinks(JSON.stringify(itemsArr))

        item.items = JSON.stringify(itemsArr)
        dataItemEditHandler(item)
    }

    const itemDeleteHandler = (index) => {
        let itemsArr = JSON.parse(links)
        itemsArr.splice(index, 1)

        setLinks(JSON.stringify(itemsArr))
        item.items = JSON.stringify(itemsArr)

        dataItemEditHandler(item)
    }

    const onDragEnd = useCallback((params) => {
        try {
            const srcIndex = params.source.index
            const dstIndex = params.destination?.index

            if (dstIndex !== null) {
                if (dstIndex !== undefined) {
                    console.log(item)
                    let itemsArr = JSON.parse(item.items)
                    itemsArr.splice(dstIndex, 0, itemsArr.splice(srcIndex, 1)[0])

                    item.items = JSON.stringify(itemsArr)
                    setLinks(JSON.stringify(itemsArr))

                    dataItemEditHandler(item)
                }
            }
        }catch (e) {
            console.log(e.message)
        }
    }, [item]);

    if (loading) {
    } else {

        return (
            <div className={'d-flex flex-column align-items-center col-12'}>
                {
                    !noName
                    ?
                <BaliInput labelText={'Link name'}
                           text={linkName}
                           onTextChangeHandler={handleName}
                />
                        :
                        null
                }

                <DragDropContext
                    onDragEnd={onDragEnd}
                >
                    <div
                        className={'col-12'}
                    >
                        <Droppable droppableId="droppable-images" type="PERSON">
                            {(provided, _) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >

                                    {
                                        JSON.parse(links).map(function (listItem, index) {
                                            if(listItem) {
                                                return <div key={index + ' ' + listItem.type + "" + listItem}>
                                                    <Draggable draggableId={"draggable-" + index} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                className={'d-flex py-2'}
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                style={{
                                                                    ...provided.draggableProps.style,
                                                                    padding: snapshot.isDragging ? '0 10px 0 10px' : '0 0 0 0',
                                                                    transition: '0.1s ease all',
                                                                    MozTransition: '0.1s ease all',
                                                                    WebkitTransition: '0.1s ease all',
                                                                }}

                                                            >

                                                                <div className={'d-flex col-12 d-flex'}>
                                                                    <img
                                                                        src={DragIcon}
                                                                        alt="React Logo"
                                                                        width={24}
                                                                        style={{padding: 5}}
                                                                    />

                                                                    <select className="form-select col baliSelect"
                                                                        // disabled={!!isSaving}
                                                                            aria-label="Link select"
                                                                            value={listItem.type}
                                                                            onChange={e => handleSelect(e.target.value, index)}
                                                                    >
                                                                        {addNewLinksElement.map(item => {
                                                                            return <option
                                                                                key={item.id}
                                                                                value={item.code}
                                                                            >{item.name}</option>
                                                                        })}
                                                                    </select>

                                                                    <div
                                                                        className={'col-7 form-group input-material my-0'}>
                                                                        <input type="link"
                                                                               className="form-control"
                                                                               id="name-field"
                                                                               value={listItem.link}
                                                                               onChange={e => itemLinksEdit(e.target.value, index)}
                                                                        />

                                                                    </div>
                                                                    <button
                                                                        type="button"
                                                                        className="btn-close p-2"
                                                                        onClick={() => {
                                                                            itemDeleteHandler(index)
                                                                        }}
                                                                    >
                                                                    </button>

                                                                </div>

                                                            </div>
                                                        )}

                                                    </Draggable>
                                                </div>
                                            }
                                        })
                                    }

                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>

                    </div>
                </DragDropContext>

                <button
                    type="button"
                    className="btn btn-info"
                    onClick={newItemAddHandler}
                    style={{
                        paddingTop: '10px',
                        paddingBottom: '10px',
                        paddingLeft: '15px',
                        paddingRight: '15px',
                        marginTop: '10px',
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                         className="bi bi-plus" viewBox="0 0 16 16">
                        <path
                            d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                    </svg>
                </button>

            </div>
        )
    }
}

export default BaliLinksComponent;