import React, {useEffect, useState} from 'react';
import BaliInput from "../BaliInput";
import BaliTextArea from "../BaliTextArea";

const BaliCommentComponent = (props) => {
    const {item, isSaving, dataItemEditHandler} = props

    const [textName, setTextName] = useState('')
    const [textText, setTextText] = useState('')
    const [loading, setLoading] = useState(true)

    const handleName = (value) => {
        if(!isSaving) {
            item.name = value
            setTextName(value)
            dataItemEditHandler(item)
        }
    }

    const handleText = value => {
        if(!isSaving) {
            setTextText(value)
            item.text = value
            dataItemEditHandler(item)
        }
    }

    useEffect(() => {
        setTextName(item.name)
        setTextText(item.text)
        setLoading(false)
    }, [])

    if (loading) {
    } else {

        return (
            <div style={{borderLeft: '2px solid rgba(40, 44, 52, 0.4)', paddingLeft: '15px'}}>
                <BaliInput labelText={'Title'}
                           text={textName}
                           onTextChangeHandler={handleName}
                />
                <BaliTextArea labelText={'Comment'}
                              text={textText}
                              onTextChangeHandler={handleText}
                />
            </div>
        );
    }
};

export default BaliCommentComponent;