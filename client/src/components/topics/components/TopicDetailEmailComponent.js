import React, {useEffect, useState} from 'react';
import {Row} from "react-bootstrap";
import ElementName from "./ElementName";
import ElementEmail from "./ElementEmail";

const TopicDetailEmailComponent = (props) => {
    const {element} = props

    const [loading, setLoading] = useState(true)
    const [elementName, setElementName] = useState('')
    const [elementEmail, setElementEmail] = useState('')

    useEffect(() => {
        setLoading(true)

        if (element.hasOwnProperty('name')) {
            if (element.name !== '') {
                setElementName(element.name)
            }
        }

        if (element.hasOwnProperty('email')) {
            if (element.email !== '') {
                setElementEmail(element.email)
            }
        }

        setLoading(false)
    }, [])

    if(loading){

    }else {

        return (
            <Row className={'topic-details-row'} >
                {
                    elementName !== ''
                        ?
                        <ElementName name={elementName}/>
                        :
                        null
                }
                <ElementEmail item={elementEmail} />
            </Row>
        );
    }
};

export default TopicDetailEmailComponent;