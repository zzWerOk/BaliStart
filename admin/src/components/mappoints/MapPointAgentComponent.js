import React, {useContext, useEffect, useState} from 'react';
import SpinnerSM from "../SpinnerSM";
import {Dropdown} from "react-bootstrap";
import {Context} from "../../index";

const MapPointAgentComponent = (props) => {
    const {item, dataItemEditHandler} = props
    const {agentsStore} = useContext(Context)

    const [agentName, setAgentName] = useState('')
    const [agentsItems, setAgentsItems] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setAgentName(item.agentName)
        setLoading(false)
        setAgentsItems(agentsStore.getAgentsList)
    }, [])

    const handleAgentName = (value) => {
        item.agentName = value
        setAgentName(value)
        dataItemEditHandler(item)
    }

    const handleAgentId = (value) => {
        item.topicId = value
        dataItemEditHandler(item)
    }

    const selectAgentHandler = (agentId, agentName) => {

        handleAgentId(agentId)
        handleAgentName(agentName)
    }

    const searchTopicByName = (topicSearchName) => {

        const filtered = agentsStore.getAgentsList.filter(function (value) {
            return value.name.toLowerCase().includes(topicSearchName.toLowerCase());
        })

        setAgentsItems(filtered)
    }

    if (loading) {
        return <SpinnerSM/>
    } else {

        return (
            <div>
                <span
                    id="agentName"
                    className="form-control"
                    placeholder='Select topic'
                >
                    {agentName}
                </span>

                <Dropdown>
                    <Dropdown.Toggle
                        variant="outline-secondary"
                        size="sm"
                        id="dropdown-tag"
                    >
                        Select agent
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                            <div style={{paddingLeft: '15px', paddingRight: '15px',}}>
                                <label htmlFor="topicSearch">Search</label>
                                <input type="topic_name"
                                       className="form-control"
                                       id="topicSearch"
                                       placeholder="Agent name"
                                       onChange={e => searchTopicByName(e.target.value)}
                                />

                            </div>
                        <Dropdown.Divider/>
                    {agentsItems.map(item => {
                        return <Dropdown.Item
                            key={item.id}
                            name={item.name}
                            id={item.id}
                            onClick={() => {
                                selectAgentHandler(item.id, item.name)
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

export default MapPointAgentComponent;