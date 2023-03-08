import React, {useEffect, useState} from 'react';
import './BaliTextArea.css'

const BaliInput = (props) => {

    const {labelText, text, onTextChangeHandler, required, type='text', isError} = props

    const [loading, setLoading] = useState(true)
    const [elementText, setElementText] = useState('')

    useEffect(() => {
        setLoading(true)

        setElementText(text)

        setLoading(false)
    }, [])

    if (loading) {

    } else {
        return (
            <div className="form-group input-material col-12">
                <input type={type}
                       className={`form-control ${isError ? 'invalid' : ''}`}
                       id="name-field"
                       value={elementText || ''}
                       onChange={e => {
                           setElementText(e.target.value)
                           onTextChangeHandler(e.target.value)
                       }}
                       required={required}
                />
                {
                    labelText
                        ?
                        <label htmlFor="name-field">{labelText}</label>
                        :
                        null
                }
            </div>
        );
    }
};

export default BaliInput;