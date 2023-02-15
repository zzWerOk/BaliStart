import React, {useEffect, useState} from 'react';
import {MDBFile} from "mdb-react-ui-kit";
import {Button} from "react-bootstrap";

const TopicImagesComponent = (props) => {
    const {
        item,
        dataItemEditHandler,
        isSaving,
        index,
        onFilesAddHandler,
        onFilesDeleteHandler,
        redrawItemTrigger
    } = props

    // const [isSaving, stIsSaving] = useState(false)
    const [imagesName, setImagesName] = useState('')
    const [images, setImages] = useState('')
    const [loading, setLoading] = useState(true)

    const [redraw, setRedraw] = useState(true)

    useEffect(() => {
        setImagesName(item.name)
        setImages(item.items)

        // console.log('TopicImagesComponent ',item)

        setLoading(false)

        redrawItemTrigger.redraw = redrawHandler
    }, [])

    const redrawHandler = (items) => {
        console.log(items)
        setRedraw(!redraw)
    }

    const handleName = (value) => {
        item.name = value
        setImagesName(value)
        dataItemEditHandler(item)
    }

    const itemImagesEdit = (text, index) => {
        let newArr = JSON.parse(images)
        let currItem
        currItem = text
        newArr[index] = currItem
        setImages(JSON.stringify(newArr))

        item.items = JSON.stringify(newArr)
        dataItemEditHandler(item)
    }

    const newItemAddHandler = () => {
        let itemsArr = JSON.parse(images)
        itemsArr.push("")
        setImages(JSON.stringify(itemsArr))

        item.items = JSON.stringify(itemsArr)

        onFilesAddHandler('empty', index, itemsArr.length - 1)

        dataItemEditHandler(item)
    }


    const itemDeleteHandler = (imageIndex) => {
        let itemsArr = JSON.parse(images)
        itemsArr.splice(imageIndex, 1)
        setImages(JSON.stringify(itemsArr))

        item.items = JSON.stringify(itemsArr)

        onFilesDeleteHandler(index, imageIndex)

        dataItemEditHandler(item)
    }

    const onFileChooseHandler = (fileName) => {

        let filesArr = JSON.parse(images)

        for (let i = 0; i < fileName.length; i++) {
            let file = fileName[i]
            if (onFilesAddHandler(file, index)) {
                filesArr.push(file.name)
            }
        }

        setImages(JSON.stringify(filesArr))

        item.items = JSON.stringify(filesArr)
        dataItemEditHandler(item)

    }

    if (loading) {
        // return <SpinnerSM/>
    } else {
        return (
            <div>
                <input
                    type="imagesName"
                    id="imagesName"
                    className="form-control"
                    placeholder='Images name'
                    value={imagesName}
                    disabled={!!isSaving}
                    onChange={e => handleName(e.target.value)}
                />

                {/*<div style={{marginTop: '15px'}}>*/}
                {/*    <MDBFile*/}
                {/*        className={`btn w-50 ${files ? 'btn-primary' : 'btn-secondary'} `}*/}
                {/*        id='topicLogo'*/}
                {/*        disabled={!!isSaving}*/}
                {/*        style={{*/}
                {/*            // position: 'absolute',*/}
                {/*        }}*/}
                {/*        multiple={true}*/}
                {/*        onChange={e => {*/}
                {/*            onFileChooseHandler(e.target.files)*/}
                {/*        }}*/}
                {/*    />*/}
                {/*</div>*/}

                <div>
                    {
                        JSON.parse(images).map(function (listItem, index) {
                            return <div key={index} style={{display: "flex", marginTop: '15px',}}>
                                <Button
                                    onClick={() => {
                                        window.open(process.env.REACT_APP_API_URL + "/static/" + listItem + '?' + Date.now(), '_blank').focus();
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                         className="bi bi-card-image" viewBox="0 0 16 16">
                                        <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                                        <path
                                            d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54A.505.505 0 0 1 1 12.5v-9a.5.5 0 0 1 .5-.5h13z"/>
                                    </svg>
                                </Button>
                                <span
                                    // type="commentText"
                                    // id="commentText"
                                    className="form-control"
                                    // placeholder='no file'
                                    // value={listItem}
                                    // disabled={!!isSaving}
                                    // onChange={e => itemImagesEdit(e.target.value, index)}
                                >
                                    {listItem ? listItem : 'no file'}
                                </span>

                                {/*<MDBFile*/}
                                {/*    className={`btn btn-primary`}*/}
                                {/*    id={'topicImage' + Date.now()}*/}
                                {/*    disabled={!!isSaving}*/}
                                {/*    // style={{visibility:"hidden"}}*/}
                                {/*    onChange={e => {*/}
                                {/*        onFileChooseHandler(e.target.files, index)*/}
                                {/*    }}*/}
                                {/*/>*/}

                                <button
                                    type="button"
                                    className="btn btn-outline-danger"
                                    onClick={() => {
                                        itemDeleteHandler(index)
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                         className="bi bi-x"
                                         viewBox="0 0 16 16">
                                        <path
                                            d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                    </svg>
                                </button>

                            </div>
                        })
                    }
                </div>

                <MDBFile
                    className={`btn btn-primary`}
                    id={'topicImage' + Date.now()}
                    disabled={!!isSaving}
                    // style={{visibility:"hidden"}}
                    style={{
                        marginTop: '10px',
                    }}
                    multiple={true}
                    onChange={e => {
                        onFileChooseHandler(e.target.files)
                    }}
                />

                {/*<button*/}
                {/*    type="button"*/}
                {/*    className="btn btn-info"*/}
                {/*    disabled={!!isSaving}*/}
                {/*    style={{*/}
                {/*        marginTop: '10px',*/}
                {/*    }}*/}
                {/*    onClick={newItemAddHandler}*/}
                {/*>*/}
                {/*    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"*/}
                {/*         className="bi bi-plus" viewBox="0 0 16 16">*/}
                {/*        <path*/}
                {/*            d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>*/}
                {/*    </svg>*/}
                {/*</button>*/}

            </div>
        );
    }
};

export default TopicImagesComponent;