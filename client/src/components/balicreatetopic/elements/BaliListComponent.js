import React, {useCallback, useEffect, useState} from 'react';
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import DragIcon from '../../../assets/svg/drag-handle.svg';

const BaliListComponent = (props) => {
    const {item, isSaving, dataItemEditHandler} = props

    const [listName, setListName] = useState('')
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setListName(item.name)
        setItemsArr(JSON.parse(item.items))
        setLoading(false)
    }, [])

    const setItemsArr = (itemsArr) => {
        const newItemsArr = []
        itemsArr.map(function (item, index) {
            newItemsArr.push({text: item, id: index})
        })
        setItems(newItemsArr)
    }

    const handleName = (value) => {
        item.name = value
        setListName(value)
        dataItemEditHandler(item)
    }

    const itemsEditHandler = (text, index) => {
        let newArr = JSON.parse(item.items)
        newArr[index] = text
        setItemsArr(newArr)

        item.items = JSON.stringify(newArr)
        dataItemEditHandler(item)
    }

    const newItemAddHandler = () => {
        let itemsArr = JSON.parse(item.items)

        itemsArr.push("")
        setItemsArr(itemsArr)

        item.items = JSON.stringify(itemsArr)
        dataItemEditHandler(item)
    }

    const itemDeleteHandler = (index) => {
        let itemsArr = JSON.parse(item.items)
        itemsArr.splice(index, 1)
        setItemsArr(itemsArr)

        item.items = JSON.stringify(itemsArr)
        dataItemEditHandler(item)
    }

    const onDragEnd = useCallback((params) => {
        const srcIndex = params.source.index
        const dstIndex = params.destination?.index

        if (dstIndex !== null) {
            if (dstIndex !== undefined) {
                let itemsArr = JSON.parse(item.items)
                itemsArr.splice(dstIndex, 0, itemsArr.splice(srcIndex, 1)[0])

                item.items = JSON.stringify(itemsArr)
                setItemsArr(itemsArr)

                dataItemEditHandler(item)
            }
        }
    }, []);

    if (loading) {
    } else {
        return (
            <div>
                <div className="form-group input-material">
                    <input type="text"
                           className="form-control"
                           id="name-field"
                           value={listName}
                           onChange={e => handleName(e.target.value)}
                    />
                    <label htmlFor="name-field">Title</label>
                </div>
                <DragDropContext
                    onDragEnd={onDragEnd}
                >
                    <div>
                        <Droppable droppableId="droppable-images" type="PERSON">
                            {(provided, _) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >

                                    {
                                        items.map(function (listItem, index) {
                                            return <div key={listItem.id}>
                                                <Draggable draggableId={"draggable-" + index} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            className={'d-flex col-12'}
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={{
                                                                ...provided.draggableProps.style,
                                                                margin: '0 0 15px 0',
                                                                padding: snapshot.isDragging ? '0 10px 0 10px' : '0 0 0 0',
                                                            }}

                                                        >
                                                            <img
                                                                src={DragIcon}
                                                                alt="React Logo"
                                                                width={24}
                                                                style={{width: '15px', backgroundColor: "white", margin: '10px', opacity: '55%'}}
                                                            />


                                                            <div className="form-group input-material my-1 col">
                                                                <input type="text"
                                                                       className="form-control"
                                                                       id="listItem-field"
                                                                       value={listItem.text}
                                                                       onChange={e => itemsEditHandler(e.target.value, index)}
                                                                />
                                                                <label htmlFor="listItem-field">List item</label>
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
                                                    )}

                                                </Draggable>
                                            </div>


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
        );
    }
};

export default BaliListComponent;