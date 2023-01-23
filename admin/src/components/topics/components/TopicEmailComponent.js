import React, {useEffect, useState} from 'react';
import SpinnerSM from "../../SpinnerSM";

const TopicEmailComponent = (props) => {
    const {item, dataItemEditHandler} = props

    const [isSaving, stIsSaving] = useState(false)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setName(item.name)
        setEmail(item.email)
        setLoading(false)
    }, [])

    const handleName = (value) => {
        item.name = value
        setName(value)
        dataItemEditHandler(item)
    }

    const handleEmail = value => {
        setEmail(value)
        item.email = value
        dataItemEditHandler(item)
    }

    if (loading) {
        return <SpinnerSM/>
    } else {

        return (
            <div>
                <input
                    type="emailName"
                    id="emailName"
                    className="form-control"
                    placeholder='Email name'
                    value={name}
                    disabled={!!isSaving}
                    onChange={e => handleName(e.target.value)}
                />
                <input
                    type="emailText"
                    id="emailText"
                    className="form-control"
                    placeholder='Email'
                    value={email}
                    disabled={!!isSaving}
                    onChange={e => handleEmail(e.target.value)}
                />
            </div>
        );
    }
};

export default TopicEmailComponent;