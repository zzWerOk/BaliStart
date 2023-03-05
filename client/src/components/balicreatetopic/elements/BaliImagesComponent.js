import React, {useCallback, useEffect, useState} from 'react';
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {Row} from "react-bootstrap";
import {MDBFile} from "mdb-react-ui-kit";
import BaliInput from "../BaliInput";

const BaliImagesComponent = (props) => {
    const {
        item,
        dataItemEditHandler,
        isSaving,
        index,
        onFilesAddHandler,
        onFilesDeleteHandler,
    } = props

    const [imagesName, setImagesName] = useState('')
    const [images, setImages] = useState('[]')
    const [imagesBlob, setImagesBlob] = useState('[]')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setImagesName(item.name)
        setImages(item.items)

        setImagesBlob(item.items)

        setLoading(false)
    }, [])

    const handleName = (value) => {
        item.name = value
        setImagesName(value)
        dataItemEditHandler(item)
    }

    const itemDeleteHandler = (imageIndex) => {
        let itemsArr = JSON.parse(images)
        let imagesBlobArr = JSON.parse(imagesBlob)

        itemsArr.splice(imageIndex, 1)
        imagesBlobArr.splice(imageIndex, 1)
        setImages(JSON.stringify(itemsArr))
        setImagesBlob(JSON.stringify(imagesBlobArr))

        item.items = JSON.stringify(imagesBlobArr)

        onFilesDeleteHandler(index, imageIndex)

        // dataItemEditHandler(item)
    }

    const onFileChooseHandler = (fileName) => {

        let filesArr = JSON.parse(images)
        let imagesBlobArr = JSON.parse(imagesBlob)

        for (let i = 0; i < fileName.length; i++) {
            let file = fileName[i]
            if (onFilesAddHandler(file, index)) {
                filesArr.push(file.name)
                const blob = URL.createObjectURL(file)
                imagesBlobArr.push(blob)
            }
        }

        setImages(JSON.stringify(filesArr))
        setImagesBlob(JSON.stringify(imagesBlobArr))

        item.items = JSON.stringify(imagesBlobArr)

    }

    const onDragEnd = useCallback((params) => {
        const srcIndex = params.source.index
        const dstIndex = params.destination?.index

        if (dstIndex !== null) {
            if (dstIndex !== undefined) {
                let imagesArr = JSON.parse(images)
                let imagesBlobArr = JSON.parse(imagesBlob)

                imagesArr.splice(dstIndex, 0, imagesArr.splice(srcIndex, 1)[0])
                imagesBlobArr.splice(dstIndex, 0, imagesBlobArr.splice(srcIndex, 1)[0])

                setImages(JSON.stringify(imagesArr))
                setImagesBlob(JSON.stringify(imagesBlobArr))

                item.items = JSON.stringify(imagesBlobArr)

                dataItemEditHandler(item)
            }
        }
    }, [images, imagesBlob]);

    if (loading) {
        // return <SpinnerSM/>
    } else {
        return (
            <div>

                <BaliInput labelText={'Images title'}
                           text={imagesName}
                           onTextChangeHandler={handleName}
                           type={'imagesName'}
                />


                <small>
                    <em className={'opacity-50'}>
                        *Для того чтобы не потерять данные Вам необходимо их сохранить
                    </em>
                </small>

                <DragDropContext
                    onDragEnd={onDragEnd}
                >
                    <div>
                        <Droppable droppableId="droppable-images" type="PERSON" direction="horizontal">
                            {(provided, _) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >

                                    <div className={'d-flex '}
                                         style={{overflow: 'auto',}}
                                    >
                                        {
                                            JSON.parse(imagesBlob).map(function (image, index) {
                                                let itemImage = `${process.env.REACT_APP_API_URL}` + "/static/" + image + '?' + Date.now()

                                                try {
                                                    if (image.indexOf('blob:http://') !== -1) {
                                                        itemImage = image
                                                    }
                                                } catch (e) {

                                                }

                                                return (
                                                    <div key={image + index}>
                                                        <Draggable draggableId={"draggable-" + index} index={index}>
                                                            {(provided) => (
                                                                <div
                                                                    className={'d-flex'}
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    style={{
                                                                        ...provided.draggableProps.style,
                                                                        // padding: snapshot.isDragging ? '10px' : '0 0 0 0',
                                                                        transition: '0.1s ease all',
                                                                        MozTransition: '0.1s ease all',
                                                                        WebkitTransition: '0.1s ease all',
                                                                    }}

                                                                >
                                                                    <div className={'card p-2 m-2 shadow-sm'}
                                                                         style={{
                                                                             width: '125px',
                                                                             height: '125px',
                                                                             objectFit: 'cover',
                                                                         }}
                                                                    >
                                                                        <Row style={{height: '100px'}}>
                                                                            <img className="d-block w-100"
                                                                                 src={itemImage}
                                                                                 alt={"New topic slide " + (index + 1)}/>
                                                                            {/*alt={image}/>*/}
                                                                        </Row>
                                                                        <div>
                                                                            <button
                                                                                type="button"
                                                                                className="btn-close p-2 my-2"
                                                                                onClick={() => {
                                                                                    itemDeleteHandler(index)
                                                                                }}
                                                                            >
                                                                            </button>
                                                                        </div>

                                                                    </div>

                                                                </div>
                                                            )}
                                                        </Draggable>


                                                    </div>
                                                )
                                            })




                                            //     JSON.parse(images).map(function (listItem, index) {
                                            //     return <div key={index + ' ' + listItem}>
                                            //     <Draggable draggableId={"draggable-" + index} index={index}>
                                            // {(provided, snapshot) => (
                                            //     <div
                                            //     className={'d-flex'}
                                            //     ref={provided.innerRef}
                                            // {...provided.draggableProps}
                                            // {...provided.dragHandleProps}
                                            //     style={{
                                            //     ...provided.draggableProps.style,
                                            //     padding: snapshot.isDragging ? '0 10px 0 10px' : '0 0 0 0',
                                            //     transition: '0.1s ease all',
                                            //     MozTransition: '0.1s ease all',
                                            //     WebkitTransition: '0.1s ease all',
                                            // }}
                                            //
                                            //     >
                                            //     <Button
                                            //     onClick={() => {
                                            //     window.open(process.env.REACT_APP_API_URL + "/static/" + listItem + '?' + Date.now(), '_blank').focus();
                                            // }}
                                            //     >
                                            //     <svg xmlns="http://www.w3.org/2000/svg" width="16"
                                            //     height="16"
                                            //     fill="currentColor"
                                            //     className="bi bi-card-image"
                                            //     viewBox="0 0 16 16">
                                            //     <path
                                            //     d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                                            //     <path
                                            //     d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54A.505.505 0 0 1 1 12.5v-9a.5.5 0 0 1 .5-.5h13z"/>
                                            //     </svg>
                                            //     </Button>
                                            //     <span
                                            //     className="form-control"
                                            //     >
                                            // {listItem ? listItem : 'no file'}
                                            //     </span>
                                            //
                                            //     <button
                                            //     type="button"
                                            //     className="btn-close p-2"
                                            //     onClick={() => {
                                            //     itemDeleteHandler(index)
                                            // }}
                                            //     >
                                            //     </button>
                                            //
                                            // {/*<button*/}
                                            // {/*    type="button"*/}
                                            // {/*    className="btn btn-outline-danger"*/}
                                            // {/*    onClick={() => {*/}
                                            // {/*        itemDeleteHandler(index)*/}
                                            // {/*    }}*/}
                                            // {/*>*/}
                                            // {/*    <svg xmlns="http://www.w3.org/2000/svg" width="16"*/}
                                            // {/*         height="16"*/}
                                            // {/*         fill="currentColor"*/}
                                            // {/*         className="bi bi-x"*/}
                                            // {/*         viewBox="0 0 16 16">*/}
                                            // {/*        <path*/}
                                            // {/*            d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>*/}
                                            // {/*    </svg>*/}
                                            // {/*</button>*/}
                                            //
                                            //
                                            //     </div>
                                            //     )}
                                            //     </Draggable>
                                            //
                                            //     </div>
                                            // })


                                        }
                                        {provided.placeholder}
                                    </div>
                                </div>
                            )}
                        </Droppable>

                    </div>
                </DragDropContext>

                <MDBFile
                    className={`btn btn-primary`}
                    id={'topicImage' + Date.now()}
                    disabled={!!isSaving}
                    style={{
                        marginTop: '10px',
                    }}
                    multiple={true}
                    onChange={e => {
                        onFileChooseHandler(e.target.files)
                    }}
                />

            </div>
        );
    }
};

export default BaliImagesComponent;