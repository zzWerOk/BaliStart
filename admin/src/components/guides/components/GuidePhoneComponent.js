import React, {useCallback, useEffect, useState} from 'react';
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import DragIcon from '../../../assets/drag-handle_1.svg';

const GuidePhoneComponent = (props) => {
    const {item, phonesEditHandler, saving} = props

    const [phones, setPhones] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (item) {
            setPhones(item)
        } else {
            setPhones([{items: []}])
            setPhones([])
        }

        setLoading(false)
    }, [])

    const itemPhonesEdit = (text, index) => {
        let newArr = JSON.parse(JSON.stringify(phones))
        let currItem = newArr[index]
        currItem.phone = text
        newArr[index] = currItem

        setPhones(newArr)
        phonesEditHandler(newArr)
    }

    const handleSelect = (value, index) => {
        let newArr = JSON.parse(JSON.stringify(phones))
        let currItem = newArr[index]
        currItem.type = value
        newArr[index] = currItem

        setPhones(newArr)
        phonesEditHandler(newArr)
    }

    const newItemAddHandler = () => {
        let itemsArr = JSON.parse(JSON.stringify(phones))
        itemsArr.push({"type": "wa", "phone": ""})

        setPhones(itemsArr)
        phonesEditHandler(itemsArr)
    }

    const itemDeleteHandler = (index) => {
        let itemsArr = JSON.parse(JSON.stringify(phones))
        itemsArr.splice(index, 1)

        setPhones(itemsArr)
        phonesEditHandler(itemsArr)
    }

    const onDragEnd = useCallback((params) => {
        if(!saving) {
            const srcIndex = params.source.index
            const dstIndex = params.destination?.index

            if (dstIndex !== null) {
                if (dstIndex !== undefined) {
                    let imagesArr = JSON.parse(JSON.stringify(phones))
                    imagesArr.splice(dstIndex, 0, imagesArr.splice(srcIndex, 1)[0])

                    setPhones(imagesArr)
                    phonesEditHandler(imagesArr)
                }
            }
        }
    }, [phones, saving]);

    if (loading) {

    } else {

        return (
            <div className={'col-12 d-flex flex-column justify-content-center mt-3'}>
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

                                        phones.map(function (listItem, index) {
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

                                                            <div key={index}
                                                                 className={'d-flex col-12'}>
                                                                <img
                                                                    src={DragIcon}
                                                                    alt="React Logo"
                                                                    width={24}
                                                                    style={{padding: 5}}
                                                                />
                                                                <div className={'d-flex col-12'}
                                                                     style={{paddingRight: "25px"}}
                                                                >
                                                                    <div className={'col'}>
                                                                        <select className="form-select"
                                                                                aria-label="Default select example"
                                                                                value={listItem.type}
                                                                                onChange={e => handleSelect(e.target.value, index)}
                                                                                disabled={!!saving}
                                                                        >
                                                                            <option disabled>Выбери тип связи</option>
                                                                            <option value="wa">WhatsApp</option>
                                                                            <option value="vb">Viber</option>
                                                                            <option value="tg">Telegram</option>
                                                                            <option value="ph">Phone call + sms</option>
                                                                            <option value="al">All</option>
                                                                        </select>
                                                                    </div>

                                                                    <div className={'col-7'}>
                                                                        <input
                                                                            type="phoneText"
                                                                            id="phoneText"
                                                                            className="form-control"
                                                                            placeholder='Phone No'
                                                                            value={listItem.phone}
                                                                            onChange={e => itemPhonesEdit(e.target.value, index)}
                                                                            disabled={!!saving}
                                                                        />
                                                                    </div>

                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-outline-danger"
                                                                        onClick={() => {
                                                                            itemDeleteHandler(index)
                                                                        }}
                                                                        disabled={!!saving}
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

                <div className={'d-flex justify-content-center'}>
                    <button
                        type="button"
                        className="btn btn-info "
                        onClick={newItemAddHandler}
                        style={{
                            marginTop: '10px',
                        }}
                        disabled={!!saving}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             className="bi bi-plus" viewBox="0 0 16 16">
                            <path
                                d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                        </svg>
                    </button>
                </div>
            </div>
        );
    }
};

export default GuidePhoneComponent;