import React, {useEffect, useState} from 'react';
import BaliInput from "../BaliInput";

const BaliGoogleMapUrlComponent = (props) => {
    const {item, dataItemEditHandler} = props

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
    } else {

        return (
            <div>

                <BaliInput labelText={'Title'}
                           text={mapUrlName}
                           onTextChangeHandler={handleName}
                />

                {/*<input*/}
                {/*    type="googleMapUrlName"*/}
                {/*    id="googleMapUrlName"*/}
                {/*    className="form-control"*/}
                {/*    placeholder='googleMapUrl name'*/}
                {/*    value={mapUrlName}*/}
                {/*    // disabled={!!isSaving}*/}
                {/*    onChange={e => handleName(e.target.value)}*/}
                {/*/>*/}

                <BaliInput labelText={'Google map Url'}
                           text={mapUrl}
                           onTextChangeHandler={handleMapUrl}
                           type={'googleMapUrlText'}
                />

                {/*<input*/}
                {/*    type="googleMapUrlText"*/}
                {/*    id="googleMapUrlText"*/}
                {/*    className="form-control"*/}
                {/*    placeholder='googleMapUrl text'*/}
                {/*    value={mapUrl}*/}
                {/*    // disabled={!!isSaving}*/}
                {/*    onChange={e => handleMapUrl(e.target.value)}*/}
                {/*/>*/}
            </div>
        );
    }
};

export default BaliGoogleMapUrlComponent;