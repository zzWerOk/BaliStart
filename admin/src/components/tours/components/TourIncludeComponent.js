import React, {useCallback, useEffect, useState} from 'react';
import {Button} from "react-bootstrap";
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import DragIcon from '../../../assets/drag-handle_1.svg';

const TourIncludeComponent = (props) => {

    const {includes, isSaving, tourIncludesEditHandler} = props

    const [newIncludesField, setNewIncludesField] = useState('')
    const [tourIncludes, setTourIncludes] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setTourIncludes(JSON.parse(includes))

        setLoading(false)
    }, [])

    const setIncludesHandler = () => {
        const newIncludesArr = newIncludesField.split('\n');
        let currIncludesArr = JSON.parse(JSON.stringify(tourIncludes))
        setTourIncludes([...currIncludesArr, ...newIncludesArr])
        tourIncludesEditHandler([...currIncludesArr, ...newIncludesArr])

        setNewIncludesField('')
    }

    const itemEditHandler = (itemText, index) => {
        let currIncludesArr = JSON.parse(JSON.stringify(tourIncludes))
        currIncludesArr[index] = itemText
        setTourIncludes(currIncludesArr)
        tourIncludesEditHandler(currIncludesArr)

    }

    const itemDeleteHandler = (index) => {
        let currIncludesArr = JSON.parse(JSON.stringify(tourIncludes))
        currIncludesArr.splice(index, 1)
        setTourIncludes(currIncludesArr)
        tourIncludesEditHandler(currIncludesArr)

    }


    const onDragEnd = useCallback((params) => {
        const srcIndex = params.source.index
        const dstIndex = params.destination?.index

        if (dstIndex !== null) {
            if (dstIndex !== undefined) {
                let dragIncludesArr = JSON.parse(JSON.stringify(tourIncludes))
                dragIncludesArr.splice(dstIndex, 0, dragIncludesArr.splice(srcIndex, 1)[0])


                setTourIncludes(dragIncludesArr)
                tourIncludesEditHandler(dragIncludesArr)
            }
        }
    }, [tourIncludes]);

    if (loading) {

    } else {

        return (
            <div className={'col-12'}>

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
                                        tourIncludes.map(function (item, index) {
                                            return <div key={item + index}

                                            >
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
                                                            <div className={''}>
                                                                <img
                                                                    className={' '}
                                                                    src={DragIcon}
                                                                    alt="React Logo"
                                                                    width={24}
                                                                    style={{padding: 5}}
                                                                />
                                                            </div>
                                                            <div className={'col-11'}>
                                                                <input
                                                                    type="currInclude"
                                                                    id="currInclude"
                                                                    className="form-control "
                                                                    placeholder='Items'
                                                                    value={item}
                                                                    disabled={!!isSaving}
                                                                    onChange={(e) => {
                                                                        itemEditHandler(e.target.value, index)
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className={''}>
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
                    <textarea
                        rows="2"
                        id="includeText"
                        className="form-control"
                        placeholder='Paste list of items here'
                        value={newIncludesField}
                        disabled={!!isSaving}
                        onChange={(e) => {
                            setNewIncludesField(e.target.value)
                        }}
                    />
            <Button
                className={'col-2'}
                onClick={() => {
                    setIncludesHandler()
                }}
            >
                Add
            </Button>
        </div>
    </div>
    )
    }
    }


    export default TourIncludeComponent;