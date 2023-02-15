import React, {useEffect, useState} from "react";

const TopicTextComponent = (props) => {
    const {item, dataItemEditHandler} = props

    const [textName, setTextName] = useState('')
    const [textText, setTextText] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setTextName(item.name)
        setTextText(item.text)
        setLoading(false)
    }, [])

    const handleName = (value) => {
        item.name = value
        setTextName(value)
        dataItemEditHandler(item)
    }

    const handleText = value => {
        setTextText(value)
        item.text = value
        dataItemEditHandler(item)
    }

    if (loading) {
        // return <SpinnerSM/>
    } else {

        return (
            <div>
                <input
                    type="textName"
                    id="textName"
                    className="form-control"
                    placeholder='Text name'
                    value={textName}
                    // disabled={!!isSaving}
                    onChange={e => handleName(e.target.value)}
                />
                <input
                    type="textText"
                    id="textText"
                    className="form-control"
                    placeholder='Text'
                    value={textText}
                    // disabled={!!isSaving}
                    onChange={e => handleText(e.target.value)}
                />
            </div>

        );
    }
};

export default TopicTextComponent;