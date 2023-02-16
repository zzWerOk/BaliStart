import React, {useCallback, useEffect, useState} from 'react';
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import DragIcon from '../../../assets/drag-handle_1.svg';

const TopicPhoneComponent = (props) => {
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
        // return <SpinnerSM/>
    } else {

        return (
            <div>
                <input
                    type="phoneName"
                    id="phoneName"
                    className="form-control"
                    placeholder='Phone name'
                    value={phoneName}
                    // disabled={!!isSaving}
                    onChange={e => handleName(e.target.value)}
                />

                <DragDropContext
                    onDragEnd={onDragEnd}
                >
                    <div>
                        <Droppable droppableId="droppable-images" type="PERSON">
                            {(provided, _) => (
                                <div
                                    ref={provided.innerRef}
                                    style={{
                                        // backgroundColor: snapshot.isDraggingOver ? '#ccc' : null,
                                    }}
                                    {...provided.droppableProps}
                                >

                                    {
                                        // item.items.map(function (listItem, index) {
                                        JSON.parse(phones).map(function (listItem, index) {
                                            return <div key={index + ' ' + listItem}>
                                                <Draggable draggableId={"draggable-" + index} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            className={'d-flex'}
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={{
                                                                ...provided.draggableProps.style,
                                                                margin: '0 0 15px 0',
                                                                padding: snapshot.isDragging ? '0 10px 0 10px' : '0 0 0 0',
                                                            }}

                                                        >

                                                            <div key={index} style={{display: "flex"}}>
                                                                <img
                                                                    src={DragIcon}
                                                                    alt="React Logo"
                                                                    width={24}
                                                                    style={{padding: 5}}
                                                                />
                                                                <div style={{display: "flex"}}>
                                                                    <div className={'col-7'}>
                                                                        <select className="form-select"
                                                                            // disabled={!!isSaving}
                                                                                aria-label="Default select example"
                                                                                value={listItem.type}
                                                                                onChange={e => handleSelect(e.target.value, index)}
                                                                        >
                                                                            <option disabled>Выбери тип связи</option>
                                                                            <option value="wa">WhatsApp</option>
                                                                            <option value="vb">Viber</option>
                                                                            <option value="tg">Telegram</option>
                                                                            <option value="ph">Phone call + sms</option>
                                                                            <option value="al">All</option>
                                                                        </select>
                                                                    </div>

                                                                    <div className={'col-6'}>
                                                                        <input
                                                                            type="phoneText"
                                                                            id="phoneText"
                                                                            className="form-control"
                                                                            placeholder='Phone No'
                                                                            value={listItem.phone}
                                                                            // disabled={!!isSaving}
                                                                            onChange={e => itemPhonesEdit(e.target.value, index)}
                                                                        />
                                                                    </div>

                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-outline-danger"
                                                                        onClick={() => {
                                                                            itemDeleteHandler(index)
                                                                        }}
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                                             width="16" height="16"
                                                                             fill="currentColor" className="bi bi-x"
                                                                             viewBox="0 0 16 16">
                                                                            <path
                                                                                d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                                                        </svg>
                                                                    </button>

                                                                </div>
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

export default TopicPhoneComponent;