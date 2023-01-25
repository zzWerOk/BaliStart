import React, {useEffect, useState} from 'react';
import SpinnerSM from "../../SpinnerSM";

const MapPointTopicComponent = (props) => {
    const {item, dataItemEditHandler} = props

    const [isSaving, stIsSaving] = useState(false)
    const [mapUrlName, setMapUrlName] = useState('')
    const [mapUrl, setMapUrl] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setMapUrlName(item.name)
        setMapUrl(item.url)
        setLoading(false)
    }, [])

    const handleName = (value) => {
        item.name = value
        setMapUrlName(value)
        dataItemEditHandler(item)
    }

    const handleMapUrl = (value) => {
        item.url = value
        setMapUrl(value)
        dataItemEditHandler(item)
    }

    if (loading) {
        return <SpinnerSM/>
    } else {

        return (
            <div>
                <input
                    type="topicName"
                    id="topicName"
                    className="form-control"
                    placeholder='Select topic'
                    value={mapUrlName}
                    disabled={!!isSaving}
                    onChange={e => handleName(e.target.value)}
                />
                <input
                    type="topicText"
                    id="topicText"
                    className="form-control"
                    placeholder='Topic...'
                    value={mapUrl}
                    disabled={!!isSaving}
                    onChange={e => handleMapUrl(e.target.value)}
                />
            </div>
        );
    }
};

export default MapPointTopicComponent;