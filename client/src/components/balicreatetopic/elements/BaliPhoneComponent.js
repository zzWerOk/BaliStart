import React, {useCallback, useEffect, useState} from 'react';
import BaliInput from "../BaliInput";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import DragIcon from "../../../assets/svg/drag-handle.svg";
import {addNewPhonesElement} from "../../../utils/consts";

const BaliPhoneComponent = (props) => {
    const {item, dataItemEditHandler} = props

    const [phoneName, setPhoneName] = useState('')
    const [phones, setPhones] = useState('[{"type":"","phone":""}]')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setPhoneName(item.name)
        setPhones(item.items)
        setLoading(false)
    }, [])

    const handleName = (value) => {
        item.name = value
        setPhoneName(value)
        dataItemEditHandler(item)
    }

    const itemPhonesEdit = (text, index) => {
        let newArr = JSON.parse(phones)
        let currItem = newArr[index]
        currItem.phone = text
        newArr[index] = currItem
        setPhones(JSON.stringify(newArr))

        item.items = JSON.stringify(newArr)
        dataItemEditHandler(item)
    }

    const handleSelect = (value, index) => {
        let newArr = JSON.parse(phones)
        let currItem = newArr[index]
        currItem.type = value
        newArr[index] = currItem
        setPhones(JSON.stringify(newArr))

        item.items = JSON.stringify(newArr)
        dataItemEditHandler(item)
    }

    const newItemAddHandler = () => {
        let itemsArr = JSON.parse(phones)
        itemsArr.push({"type": "", "phone": ""})
        setPhones(JSON.stringify(itemsArr))

        item.items = JSON.stringify(itemsArr)
        dataItemEditHandler(item)
    }

    const itemDeleteHandler = (index) => {
        let itemsArr = JSON.parse(phones)
        itemsArr.splice(index, 1)
        setPhones(JSON.stringify(itemsArr))

        item.items = JSON.stringify(itemsArr)
        dataItemEditHandler(item)
    }

    const onDragEnd = useCallback((params) => {
        const srcIndex = params.source.index
        const dstIndex = params.destination?.index

        if (dstIndex !== null) {
            if (dstIndex !== undefined) {
                let imagesArr = JSON.parse(item.items)
                imagesArr.splice(dstIndex, 0, imagesArr.splice(srcIndex, 1)[0])

                item.items = JSON.stringify(imagesArr)
                setPhones(JSON.stringify(imagesArr))

                dataItemEditHandler(item)
            }
        }
    }, []);

    if (loading) {
    } else {

        return (
            <div
            >

                <BaliInput labelText={'Phones title'}
                           text={phoneName}
                           onTextChangeHandler={handleName}
                           required={false}
                />
                <DragDropContext
                    onDragEnd={onDragEnd}
                >
                    <div>
                        <Droppable droppableId="droppable-phones" type="PHONES">
                            {(provided, _) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >

                                    {
                                        JSON.parse(phones).map(function (listItem, index) {
                                            return <div key={index + ' ' + listItem}>
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

                                                            <div key={index} className={'d-flex col-12 d-flex'}>
                                                                <img
                                                                    src={DragIcon}
                                                                    alt="drag"
                                                                    width={24}
                                                                    style={{padding: 5}}
                                                                />

                                                                <select className="form-select col baliSelect"
                                                                    // disabled={!!isSaving}
                                                                        aria-label="Phone select"
                                                                        value={listItem.type}
                                                                        onChange={e => handleSelect(e.target.value, index)}
                                                                >
                                                                    {
                                                                        addNewPhonesElement.map(item => {
                                                                            return <option
                                                                                key={item.id}
                                                                                value={item.code}
                                                                            >{item.name}</option>
                                                                        })
                                                                    }
                                                                </select>

                                                                <div
                                                                    className={'col-7 form-group input-material my-0'}>
                                                                    <input type="tel"
                                                                           className="form-control"
                                                                           id="name-field"
                                                                           value={listItem.link}
                                                                           onChange={e => itemPhonesEdit(e.target.value, index)}
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

export default BaliPhoneComponent;