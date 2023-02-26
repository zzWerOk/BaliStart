import React, {useEffect, useState} from 'react';
import {Row} from "react-bootstrap";
import ElementPhone from "./ElementPhone";
import ElementName from "./ElementName";

const TopicDetailPhoneComponent = (props) => {
    const {element, fieldWidth} = props

    const [loading, setLoading] = useState(true)
    const [elementName, setElementName] = useState('')
    const [elementListArr, setListArr] = useState([])

    useEffect(() => {
        setLoading(true)

        if (element.hasOwnProperty('name')) {
            if (element.name !== '') {
                setElementName(element.name)
            }
        }

        if (element.hasOwnProperty('items')) {
            if (element.items !== '[]') {
                setListArr(JSON.parse(element.items))
            }
        }

        setLoading(false)
    }, [])

    if(loading){

    }else {

        return (
            <Row className={'topic-details-row'}
                 style={{paddingBottom: '25px'}}
            >
                {
                    elementName !== ''
                        ?
                        <ElementName name={elementName}/>
                        :
                        null
                }
                {
                    elementListArr.length > 0
                        ?
                        <ul className="list-group list-group-flush">

                            {elementListArr.map(function (item, index) {
                                if(item.phone !== '') {
                                    return <ElementPhone fieldWidth={fieldWidth} key={index} item={item}/>
                                }
                            })}

                        </ul>
                        :
                        null
                }


            </Row>
        );
    }
};

export default TopicDetailPhoneComponent;