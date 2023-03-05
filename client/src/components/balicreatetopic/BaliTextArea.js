import React, {useEffect, useRef, useState} from 'react';
import './BaliTextArea.css'

const BaliTextArea = (props) => {
    const {labelText, text, onTextChangeHandler, isError} = props

    // const [loading, setLoading] = useState(true)
    const [elementText, setElementText] = useState('')

    const refTextArea = useRef(null);

    useEffect(() => {

        if (refTextArea !== null && refTextArea !== undefined && text) {
            if (refTextArea.current !== null && refTextArea.current !== undefined) {
                refTextArea.current.setAttribute('value', text);
            }
        }

    }, [])


    useEffect(() => {
        // setLoading(true)

        setElementText(text)

        // setLoading(false)
    }, [])

    const handleChange = (event) => {
        setElementText(event.target.value);

        event.target.setAttribute('value', event.target.value)
        onTextChangeHandler(event.target.value)
    };

    // if (loading) {
    //
    // } else {
        return (
            <div>

                <div className="form-group input-material">

                    <textarea
                        className={`form-control ${isError ? 'invalid' : ''}`}
                        id="textarea-field"
                        rows="3"
                        required
                        onChange={handleChange}
                        value={elementText}
                        ref={refTextArea}
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
    // }
};

export default BaliTextArea;