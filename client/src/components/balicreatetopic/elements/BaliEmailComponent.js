import React, {useEffect, useState} from 'react';
import BaliInput from "../BaliInput";

const BaliEmailComponent = (props) => {
    const {item, dataItemEditHandler} = props

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
    } else {

        return (
            <div>
                <BaliInput labelText={'Email title'}
                           text={name}
                           onTextChangeHandler={handleName}
                           required={false}
                />

                <BaliInput labelText={'Email'}
                           text={email}
                           onTextChangeHandler={handleEmail}
                           type={'email'}
                           required={false}
                />
            </div>
        );
    }
};

export default BaliEmailComponent;