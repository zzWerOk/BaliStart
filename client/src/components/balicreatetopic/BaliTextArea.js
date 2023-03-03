import React, {useEffect, useState} from 'react';
import './BaliTextArea.css'

const BaliTextArea = (props) => {
    const {labelText, text, onTextChangeHandler} = props

    const [loading, setLoading] = useState(true)
    const [elementText, setElementText] = useState('')

    useEffect(() => {
        setLoading(true)

        setElementText(text)

        setLoading(false)
    }, [])

    const handleChange = (event) => {
        setElementText(event.target.value);

        event.target.setAttribute('value', event.target.value)
        onTextChangeHandler(event.target.value)
    };

    if (loading) {

    } else {
        return (
            <div>

                <div className="form-group input-material">

                    <textarea
                        className="form-control"
                        id="textarea-field"
                        rows="3"
                        required
                        onChange={handleChange}
                        value={elementText}
                        // onChange={e => {
                        //     setElementText(e.target.value)
                        // }}
                    />
                    {
                        labelText
                            ?
                            <label htmlFor="textarea-field">{labelText}</label>
                            :
                            null
                    }
                </div>

            </div>
        );
    }
};

export default BaliTextArea;