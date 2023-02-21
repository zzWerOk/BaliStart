import React, {useEffect, useRef, useState} from 'react';
import {useLongPress} from "use-long-press";
import {OverlayTrigger, Tooltip} from "react-bootstrap";

const ElementLink = (props) => {
    const {item} = props

    const [loading, setLoading] = useState(true)
    const [elementName, setElementName] = useState('')
    const [elementLink, setElementLink] = useState('')

    const [showToolTip, setShowToolTip] = useState(false)
    const target = useRef(null);

    const bind = useLongPress(() => {

        if (!navigator.clipboard) {
            window.clipboardData.setData("Text", elementLink)
        } else {
            navigator.clipboard.writeText(elementLink).then(
                function () {
                    // alert("yeah!"); // success
                    setShowToolTip(true)
                    setTimeout(() => {
                        setShowToolTip(false)
                    }, 1000)
                })
        }
    });

    useEffect(() => {
        setLoading(true)

        const element = item
        if (element.hasOwnProperty('link')) {
            if (element.link !== '') {
                setElementLink(element.link)
            }
        }

        if (element.hasOwnProperty('name')) {
            if (element.name !== '') {
                setElementName(element.name)
            }
        }

        setLoading(false)
    }, [])

    if (loading) {

    } else {

        return (
            <OverlayTrigger
                placement="right"
                overlay={<Tooltip id={'id' + item}>{'Copied!'}</Tooltip>}
                delay={300}
                show={showToolTip}
                target={target.current}
                defaultShow={false} onHide={null} onToggle={null} popperConfig={{}}
            >

                <div className="col-12 btn btn-primary d-flex justify-content-between"
                     {...bind()}
                     ref={target}
                >

                    <a className="text-light col-11 align-self-center text-truncate text-lowercase"
                       href={elementLink}
                       target="_blank"
                       rel="noreferrer"
                    >
                        {elementName ? elementName : elementLink}
                    </a>
                    <div className={'align-self-end'}/>
                </div>
            </OverlayTrigger>

        );
    }
};

export default ElementLink;