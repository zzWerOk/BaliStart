import React, {useEffect, useState} from 'react';
import SpinnerSM from "../../SpinnerSM";

const TopicCommentComponent = (props) => {
    const {item, dataItemEditHandler} = props

    const [isSaving, stIsSaving] = useState(false)
    const [commentName, setCommentName] = useState('')
    const [commentText, setCommentText] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setCommentName(item.name)
        setCommentText(item.text)
        setLoading(false)
    }, [])

    const handleName = (value) => {
        item.name = value
        setCommentName(value)
        dataItemEditHandler(item)
    }

    const handleText = value => {
        setCommentText(value)
        item.text = value
        dataItemEditHandler(item)
    }

    if (loading) {
        return <SpinnerSM/>
    } else {

        return (
            <div style={{borderLeft: '2px solid rgba(40, 44, 52, 0.4)', height: '100px'}}>
                <input
                    type="commentName"
                    id="commentName"
                    className="form-control"
                    placeholder='Comment name'
                    value={commentName}
                    disabled={!!isSaving}
                    onChange={e => handleName(e.target.value)}
                />
                <input
                    type="commentText"
                    id="commentText"
                    className="form-control"
                    placeholder='Comment'
                    value={commentText}
                    disabled={!!isSaving}
                    onChange={e => handleText(e.target.value)}
                />
            </div>
        );
    }
};

export default TopicCommentComponent;