import React, {useEffect, useState} from 'react';
import SpinnerSM from "../../SpinnerSM";

const TopicPhoneComponent = (props) => {
    const {item, dataItemEditHandler} = props

    const [isSaving, stIsSaving] = useState(false)
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
        itemsArr.push({"type":"","phone":""})
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

    if (loading) {
        return <SpinnerSM/>
    } else {

        return (
            <div>
                <input
                    type="phoneName"
                    id="phoneName"
                    className="form-control"
                    placeholder='Phone name'
                    value={phoneName}
                    disabled={!!isSaving}
                    onChange={e => handleName(e.target.value)}
                />
                <div>
                    {
                        // item.items.map(function (listItem, index) {
                        JSON.parse(phones).map(function (listItem, index) {
                            return <div key={index} style={{display: "flex"}}>
                                <div style={{display: "flex"}}>
                                    <select className="form-select"
                                            disabled={!!isSaving}
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

                                    <input
                                        type="phoneText"
                                        id="phoneText"
                                        className="form-control"
                                        placeholder='Phone No'
                                        value={listItem.phone}
                                        disabled={!!isSaving}
                                        onChange={e => itemPhonesEdit(e.target.value, index)}
                                    />

                                    <button
                                        type="button"
                                        className="btn btn-outline-danger"
                                        onClick={() => {
                                            itemDeleteHandler(index)
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                             fill="currentColor" className="bi bi-x"
                                             viewBox="0 0 16 16">
                                            <path
                                                d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                        </svg>
                                    </button>

                                </div>
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

export default TopicPhoneComponent;