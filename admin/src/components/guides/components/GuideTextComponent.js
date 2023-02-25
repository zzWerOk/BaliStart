import React, {useEffect, useState} from "react";

const GuideTextComponent = (props) => {
    const {text, placeholder, onTextEditHandler, saving} = props

    const [textText, setTextText] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        setTextText(text || '')
        setLoading(false)
    }, [])

    const handleText = value => {
        setTextText(value)
        onTextEditHandler(value)
    }

    if (loading) {

    } else {

        return (
            <div className={'py-2'}>
                <input
                    type={placeholder}
                    id={placeholder}
                    className="form-control"
                    placeholder={placeholder}
                    value={textText}
                    onChange={e => handleText(e.target.value)}
                    disabled={!!saving}
                />
            </div>

        );
    }
};

export default GuideTextComponent;