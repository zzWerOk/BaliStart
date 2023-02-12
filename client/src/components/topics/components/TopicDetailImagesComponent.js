import React, {useEffect, useState} from 'react';
import {Row} from "react-bootstrap";

const TopicDetailImagesComponent = (props) => {
    const {element} = props

    const [loading, setLoading] = useState(true)
    const [elementName, setElementName] = useState(true)

    useEffect(() => {
        setLoading(true)



        setLoading(false)
    }, [])

    if(loading){

    }else {

        return (
            <Row className={'topic-details-row'} >

            </Row>
        );
    }
};

export default TopicDetailImagesComponent;