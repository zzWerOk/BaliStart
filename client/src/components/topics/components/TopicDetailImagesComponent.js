import React, {useEffect, useState} from 'react';
import {Carousel, Row} from "react-bootstrap";
import ElementName from "./ElementName";
import ModalPopUpImage from "../../ModalPopUpImage";

const TopicDetailImagesComponent = (props) => {
    const {element} = props

    const [loading, setLoading] = useState(true)
    const [elementName, setElementName] = useState('')
    const [images, setImages] = useState([])
    const [imageUrlPopUp, setImageUrlPopUp] = useState('')

    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        setLoading(true)


        if (element.hasOwnProperty('name')) {
            if (element.name !== '') {
                setElementName(element.name)
            }
        }

        if (element.hasOwnProperty('items')) {
            if (element.items !== '') {
                setImages(JSON.parse(element.items))
            }
        }


        setLoading(false)
    }, [])

    const imagePopUpUrl = () => {
        return imageUrlPopUp
    }

    const setImageUrl = async (imageUrl) => {
        await setImageUrlPopUp(imageUrl)
        await setShowModal(true)
    }


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

                <Carousel
                    nextIcon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor"
                             className="bi bi-caret-right" viewBox="0 0 16 16">
                            <path
                                d="M6 12.796V3.204L11.481 8 6 12.796zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753z"/>
                        </svg>}
                    prevIcon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor"
                             className="bi bi-caret-left" viewBox="0 0 16 16">
                            <path
                                d="M10 12.796V3.204L4.519 8 10 12.796zm-.659.753-5.48-4.796a1 1 0 0 1 0-1.506l5.48-4.796A1 1 0 0 1 11 3.204v9.592a1 1 0 0 1-1.659.753z"/>
                        </svg>}
                    indicators={images.length > 1}
                    controls={images.length > 1}
                    interval={3000}
                >
                    {
                        images.map(function (item, index) {
                            return <Carousel.Item
                                key={index}
                                onClick={() => {
                                    // setImageUrl(`${process.env.REACT_APP_API_URL}` + "/static/" + item + '?' + Date.now())
                                }}
                            >
                                <img className="d-block w-100"
                                     src={`${process.env.REACT_APP_API_URL}` + "/static/" + item + '?' + Date.now()}
                                     alt="First slide"/>
                            </Carousel.Item>

                        })
                    }
                </Carousel>
                <ModalPopUpImage
                    show={showModal}
                    onHide={() => {
                        setShowModal(false)
                    }}
                    imageUrl={imagePopUpUrl()}
                />

            </Row>

        );
    }
};

export default TopicDetailImagesComponent;