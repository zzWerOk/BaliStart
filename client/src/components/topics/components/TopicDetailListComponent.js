import React, {useEffect, useState} from 'react';
import {Row} from "react-bootstrap";
import ElementName from "./ElementName";
import ElementListLi from "./ElementListLi";

const TopicDetailListComponent = (props) => {
    const {element, isIncludes, isNotIncludes} = props

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
            <Row className={'topic-details-row'}>
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
                                return <div
                                    key={index}
                                    className={'d-flex'}
                                    style={{ marginLeft: '35px'}}
                                >

                                    {
                                        isIncludes
                                            ?
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                 style={{ marginTop: '14px', marginRight: '5px'}}
                                                 fill="#198754" className="bi bi-bookmark-check-fill"
                                                 viewBox="0 0 16 16">
                                                <path fillRule="evenodd"
                                                      d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5zm8.854-9.646a.5.5 0 0 0-.708-.708L7.5 7.793 6.354 6.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z"/>
                                            </svg>
                                            :
                                            isNotIncludes
                                                ?
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                     style={{ marginTop: '14px', marginRight: '5px'}}
                                                     fill="currentColor" className="bi bi-bookmark-dash"
                                                     viewBox="0 0 16 16">
                                                    <path fillRule="evenodd"
                                                          d="M5.5 6.5A.5.5 0 0 1 6 6h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5z"/>
                                                    <path
                                                        d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"/>
                                                </svg>
                                                :
                                                null
                                    }

                                    <ElementListLi item={item}/>
                                </div>
                            })}

                        </ul>
                        :
                        null
                }


            </Row>
        )
            ;
    }
};

export default TopicDetailListComponent;