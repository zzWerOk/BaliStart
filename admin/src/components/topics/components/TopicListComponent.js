import React, {useEffect, useState} from 'react';

const TopicListComponent = (props) => {
    const {item, dataItemEditHandler} = props

    // const [isSaving, stIsSaving] = useState(false)
    const [items, setItems] = useState('[""]')
    const [listName, setListName] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setListName(item.name)
        setItems(item.items)
        setLoading(false)
    }, [])

    const handleName = (value) => {
        item.name = value
        setListName(value)
        dataItemEditHandler(item)
    }

    const itemsEditHandler = (text, index) => {
        let itemsArr = JSON.parse(items)
        itemsArr[index] = text
        setItems(JSON.stringify(itemsArr))
        item.items = JSON.stringify(itemsArr)
        dataItemEditHandler(item)
    }

    const newItemAddHandler = () => {
        let itemsArr = JSON.parse(items)
        itemsArr.push("")
        setItems(JSON.stringify(itemsArr))
        item.items = JSON.stringify(itemsArr)
        dataItemEditHandler(item)
    }

    const itemDeleteHandler = (index) => {
        let itemsArr = JSON.parse(items)
        itemsArr.splice(index, 1)
        setItems(JSON.stringify(itemsArr))
        item.items = JSON.stringify(itemsArr)
        dataItemEditHandler(item)
    }

    if (loading) {
        // return <SpinnerSM/>
    } else {

        return (
            <div>
                <div className="form-outline">
                    <input
                        type="listName"
                        id="listName"
                        className="form-control"
                        placeholder='List name'
                        value={listName}
                        // disabled={!!isSaving}
                        onChange={e => handleName(e.target.value)}
                    />
                </div>

                <div>
                    {
                        JSON.parse(items).map(function (listItem, index) {
                            return <div key={index} style={{display: "flex"}}>
                                <div style={{marginRight: '5px'}}>•</div>
                                <input
                                    type="commentText"
                                    id="commentText"
                                    className="form-control"
                                    placeholder='List item'
                                    value={listItem}
                                    // disabled={!!isSaving}
                                    onChange={e => itemsEditHandler(e.target.value, index)}
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

export default TopicListComponent;