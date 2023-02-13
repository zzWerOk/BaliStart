import React, {useEffect, useRef, useState} from 'react';
import {Col, Image, Row} from "react-bootstrap";
import ModalPopUp from "../modal/ModalPopUp";
import TopicDetailsPage from "./TopicDetailsPage";
import SpinnerSM from "../SpinnerSM";
import {epochToDate} from "../../utils/consts";
import imageLogo from '../../img/nophoto.jpg'

const TopicListsCell = (props) => {
    const {item, onItemEditHandler, deleteTopic} = props

    const [showModal, setShowModal] = useState(false)
    const [currItem, setCurrItem] = useState({})
    const [loading, setLoading] = useState(true)
    const [itemImageLogo, setItemImageLogo] = useState('')

    const modalScroll = useRef(null)

    useEffect(
        () => {
            setCurrItem(item)
            setItemImageLogo(item.image_logo)
            setLoading(false)
        }, [])

    const topicPageCardComponent = (data) => (
        <TopicDetailsPage
            item={data}
            onItemEditHandler={onItemEditHandlerCell}
            deleteTopic={deleteTopic}
            scrollToTop={scrollModalToTop}
        />
    )

    const onClickHandler = () => {
        setShowModal(true)
    }

    const onItemEditHandlerCell = (item, newImage) => {
        setCurrItem(item)
        if (newImage) {
            setItemImageLogo(item.image_logo + '?' + Date.now())
        }

        onItemEditHandler(item)
    }

    const scrollModalToTop = () => {
        modalScroll.scrollToTop()
    }

    if (loading) {
        return <SpinnerSM/>
    } else {

        return (
            <div
                style={{cursor: 'pointer'}}
            >

                <Row onClick={() => {
                    onClickHandler()
                }}
                     style={{
                         display: "flex",
                         marginBottom: '10px',
                         minHeight: '220px',
                         backgroundColor: currItem.isSaved ? 'white' : 'rgba(204,204,204,0.59)',
                     }}>
                    <Col md={4} style={{border: '1px solid rgba(40, 44, 52, 0.66)'}}>
                        <div className={'align-items-center justify-content-center'}
                             style={{
                                 height: '250px',
                                 overflow: 'hidden',
                                 position: 'relative',
                                 margin: 0,
                             }}>
                            <Image
                                style={{
                                    position: 'absolute',
                                    height: '250px',
                                    left: '50%',
                                    transform: 'translate(-50%, 0)',
                                }}
                                src={itemImageLogo
                                    ?
                                    `${process.env.REACT_APP_API_URL}/static/${itemImageLogo}`
                                    :
                                    imageLogo
                                }
                            />
                        </div>
                    </Col>
                    <Col
                        md={7}
                        style={{
                            backgroundColor: currItem.isSaved ? 'white' : 'rgba(204,204,204,0.59)',
                            border: '1px solid rgba(40, 44, 52, 0.66)',
                            padding: '20px'
                        }}>
                        <Row className={'h-25 align-items-baseline'}>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <div style={{
                                    marginRight: '25px',
                                    backgroundColor: 'rgba(204,204,204,0.51)',
                                }}>
                                    USER<br/>img
                                </div>
                                <div>
                                    <Row>
                                        {currItem.created_by_user_name}
                                    </Row>
                                    <Row>
                                        {epochToDate(currItem.created_date)}
                                    </Row>
                                </div>
                                <div>
                                    {currItem.id >= 0 ? (<strong>{'ID '}{currItem.id}</strong>) : 'Not saved'}
                                </div>
                            </div>
                        </Row>
                        <Row className={'h-50'}>
                            <div>
                                <h1 className={'col-12 text-truncate'}>{item.name}</h1>
                                <h4 className={'col-12 text-truncate'}>{item.description}</h4>
                            </div>
                        </Row>
                        <Row className={'h-25 align-items-center justify-content-center '}
                             style={{borderTop: '2px solid rgba(40, 44, 52, 0.2)',}}>
                            <div className={'col-sm justify-content-center '}>
                                0 views
                            </div>
                            <div className={'col-sm justify-content-center'}>
                                0 clicks
                            </div>
                            <div className={'col-sm justify-content-center'}>
                                0 favs
                            </div>
                        </Row>
                    </Col>
                </Row>

                <ModalPopUp
                    show={showModal}
                    onHide={() => {
                        setShowModal(false)
                    }}
                    title={currItem.name}
                    item={currItem}
                    child={topicPageCardComponent}
                    modalScroll={modalScroll}
                />


            </div>
        );
    }
};

export default TopicListsCell;