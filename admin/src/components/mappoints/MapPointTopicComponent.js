import React, {useContext, useEffect, useState} from 'react';
import SpinnerSM from "../SpinnerSM";
import {Dropdown} from "react-bootstrap";
import {Context} from "../../index";

const MapPointTopicComponent = (props) => {
    const {item, dataItemEditHandler} = props
    const {topicsStore} = useContext(Context)

    const [topicName, setTopicName] = useState('')
    const [topicsItems, setTopicsItems] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setTopicName(item.topicName)
        setLoading(false)
        setTopicsItems(topicsStore.getTopicsList)
    }, [])

    const handleTopicName = (value) => {
        item.topicName = value
        setTopicName(value)
        dataItemEditHandler(item)
    }

    const handleTopicId = (value) => {
        item.topicId = value
        dataItemEditHandler(item)
    }

    const selectTopicHandler = (topicId, topicName) => {

        handleTopicId(topicId)
        handleTopicName(topicName)
    }

    const searchTopicByName = (topicSearchName) => {

        const filtered = topicsStore.getTopicsList.filter(function (value) {
            return value.name.toLowerCase().includes(topicSearchName.toLowerCase());
        })

        setTopicsItems(filtered)
    }

    if (loading) {
        return <SpinnerSM/>
    } else {

        return (
            <div>
                <span
                    id="topicName"
                    className="form-control"
                    placeholder='Select topic'
                >
                    {topicName}
                </span>

                <Dropdown>
                    <Dropdown.Toggle
                        variant="outline-secondary"
                        size="sm"
                        id="dropdown-tag"
                        // disabled={!!isSaving}
                    >
                        Select topic
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                            <div style={{paddingLeft: '15px', paddingRight: '15px',}}>
                                <label htmlFor="topicSearch">Search</label>
                                <input type="topic_name"
                                       className="form-control"
                                       id="topicSearch"
                                       placeholder="Topic name"
                                       onChange={e => searchTopicByName(e.target.value)}
                                />

                            </div>
                        <Dropdown.Divider/>
                    {topicsItems.map(item => {
                        return <Dropdown.Item
                            key={item.id}
                            name={item.name}
                            id={item.id}
                            onClick={() => {
                                selectTopicHandler(item.id, item.name)
                            }}
                        >{item.name}</Dropdown.Item>
                    })}
                </Dropdown.Menu>
            </Dropdown>

    </div>


    )
        ;
    }
};

export default MapPointTopicComponent;