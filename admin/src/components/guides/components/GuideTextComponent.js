import React, {useEffect, useState} from "react";

const GuideTextComponent = (props) => {
    const {text, placeholder, onTextEditHandler} = props

    const [textText, setTextText] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setTextText(text)
        setLoading(false)
    }, [])

    const handleText = value => {
        setTextText(value)
        onTextEditHandler(text)
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
                />
            </div>

        );
    }
};

export default GuideTextComponent;