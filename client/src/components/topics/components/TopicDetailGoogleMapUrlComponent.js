import React, {useEffect, useState} from 'react';
import {Row} from "react-bootstrap";

const TopicDetailGoogleMapUrlComponent = (props) => {
    const {element} = props

    const [loading, setLoading] = useState(true)
    const [elementName, setElementName] = useState('')
    const [elementUrl, setElementUrl] = useState('')

    useEffect(() => {
        setLoading(true)

        if (element.hasOwnProperty('name')) {
            if (element.name !== '') {
                setElementName(element.name)

                if (element.hasOwnProperty('url')) {
                    if (element.url !== '') {
                        setElementUrl(element.url)
                    }
                }
            }
        }

        setLoading(false)
    }, [])

    if(loading){

    }else {

        return (
            <Row className={'topic-details-row'} >
                <div className="col-lg-12 btn d-flex justify-content-center text-secondary"
                >

                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                         className="bi bi-pin-map " viewBox="0 0 16 16"
                    style={{marginRight: '15px'}}
                    >
                        <path fillRule="evenodd"
                              d="M3.1 11.2a.5.5 0 0 1 .4-.2H6a.5.5 0 0 1 0 1H3.75L1.5 15h13l-2.25-3H10a.5.5 0 0 1 0-1h2.5a.5.5 0 0 1 .4.2l3 4a.5.5 0 0 1-.4.8H.5a.5.5 0 0 1-.4-.8l3-4z"/>
                        <path fillRule="evenodd"
                              d="M8 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999z"/>
                    </svg>

                    <a className="text-primary text-truncate text-lowercase"
                       href={`${elementUrl}`}
                        target="_blank"
                       rel="noreferrer"
                    >
                        {elementName}
                    </a>
                </div>
            </Row>
        );
    }
};

export default TopicDetailGoogleMapUrlComponent;