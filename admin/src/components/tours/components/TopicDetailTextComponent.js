import React, {useEffect, useState} from 'react';
import {Row} from "react-bootstrap";
import ElementName from "./ElementName";
import ElementText from "./ElementText";

const TopicDetailTextComponent = (props) => {
    const {element} = props

    const [loading, setLoading] = useState(true)
    const [elementName, setElementName] = useState('')
    const [elementText, setElementText] = useState('')

    useEffect(() => {
        setLoading(true)

        if (element.hasOwnProperty('name')) {
            if (element.name !== '') {
                setElementName(element.name)
            }
        }

        if (element.hasOwnProperty('text')) {
            if (element.text !== '') {
                setElementText(element.text)
            }
        }

        setLoading(false)
    }, [])

    if (loading) {

    } else {
        return (
            <Row className={'topic-details-row'} >
                {
                    elementName !== ''
                        ?
                        <ElementName name={elementName}/>
                        :
                        null
                }
                {
                    elementText !== ''
                        ?
                        <ElementText text={elementText}/>
                        :
                        null
                }
            </Row>
        );
    }
};

export default TopicDetailTextComponent;