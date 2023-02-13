import React, {useEffect} from 'react';
import {Button, Modal} from "react-bootstrap";

const ModalPopUp = (props) => {
    const {show, onHide, child, title, item = null, modalScroll} = props

    useEffect(() => {
        if (modalScroll) {
            modalScroll.scrollToTop = scrollToTop
        }
    }, [])

    const scrollToTop = () => {
        const element = document.getElementById("modalDiv");
        element.scrollIntoView({behavior: "smooth", block: "start"});
    }

    return (
        <Modal
            size='lg'
            centered
            show={show}
            onHide={onHide}
            id={'modalDiv'}
        >
            <Modal.Header closeButton>
                <Modal.Title id='contained-modal-title-vcenter'>
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body
            >
                {child(item)}
            </Modal.Body>
            <Modal.Footer>
                <Button variant='outline-danger' onClick={onHide}>Закрыть</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalPopUp;