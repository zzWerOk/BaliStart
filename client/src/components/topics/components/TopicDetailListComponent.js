import React, {useEffect, useState} from 'react';
import {Row} from "react-bootstrap";
import ElementName from "./ElementName";
import ElementListLi from "./ElementListLi";

const TopicDetailListComponent = (props) => {
    const {element} = props

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
                    elementListArr.length > 0
                        ?
                        <ul className="list-group list-group-flush list-group-numbered">

                            {elementListArr.map(function (item, index) {
                                return <ElementListLi key={index} item={item}/>
                            })}

                        </ul>
                        :
                        null
                }


            </Row>
        );
    }
};

export default TopicDetailListComponent;