import React, {useEffect, useState} from 'react';
import ElementName from "./ElementName";
import ElementText from "./ElementText";
import {Row} from "react-bootstrap";

const TopicDetailCommentComponent = (props) => {
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
            <Row style={{marginBottom: '15px', marginLeft: '15px'}} className={'topic-details-row quote'} >
                <div className="container">
                    {/*PAGE TITLE*/}
                    {
                        elementName !== ''
                            ?
                            <ElementName name={elementName}/>
                            :
                            null
                    }

                    {/*BLOCKQUOTE*/}
                    <div>
                        {
                            elementText !== ''
                                ?
                                <ElementText text={elementText}/>
                                :
                                null
                        }
                    </div>
                </div>
            </Row>
        );
    }
};

export default TopicDetailCommentComponent;