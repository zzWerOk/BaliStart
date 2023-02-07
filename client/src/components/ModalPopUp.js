import React, {useMemo} from 'react';
import {Button, Modal} from "react-bootstrap";

const ModalPopUp = (props) => {
    const {show, onHide, child, title} = props

    return (
        <Modal
            size='lg'
            centered
            show={show}
            onHide={onHide}
        >
            <Modal.Header closeButton>
                <Modal.Title id='contained-modal-title-vcenter'>
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {child()}
            </Modal.Body>
            <Modal.Footer>
                <Button variant='outline-danger' onClick={onHide}>Закрыть</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalPopUp;