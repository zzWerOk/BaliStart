import React, {useEffect, useState} from 'react';
import SpinnerSM from "../../SpinnerSM";

const TopicImagesComponent = (props) => {
    const {item, dataItemEditHandler} = props

    const [isSaving, stIsSaving] = useState(false)
    const [imagesName, setImagesName] = useState('')
    const [images, setImages] = useState('["type","phone","image"]')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setImagesName(item.name)
        setImages(item.items)
        setLoading(false)
    }, [])

    const handleName = (value) => {
        item.name = value
        setImagesName(value)
        dataItemEditHandler(item)
    }

    const itemImagesEdit = (text, index) => {
        let newArr = JSON.parse(images)
        let currItem = newArr[index]
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
        dataItemEditHandler(item)
    }


    const itemDeleteHandler = (index) => {
        let itemsArr = JSON.parse(images)
        itemsArr.splice(index, 1)
        setImages(JSON.stringify(itemsArr))

        item.items = JSON.stringify(itemsArr)
        dataItemEditHandler(item)
    }

    if (loading) {
        return <SpinnerSM/>
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

                <div>
                    {
                        JSON.parse(images).map(function (listItem, index) {
                            return <div key={index} style={{display: "flex"}}>
                                <input
                                    type="commentText"
                                    id="commentText"
                                    className="form-control"
                                    placeholder='Image'
                                    value={listItem}
                                    disabled={!!isSaving}
                                    onChange={e => itemImagesEdit(e.target.value, index)}
                                />
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
                <button
                    type="button"
                    className="btn btn-info"
                    onClick={newItemAddHandler}
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

export default TopicImagesComponent;