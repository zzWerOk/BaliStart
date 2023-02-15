import React from 'react';
import {Modal} from "react-bootstrap";

const ModalPopUpImage = (props) => {
    const {show, onHide, imageUrl} = props

    return (
        <Modal
            // size='xl'
            centered
            show={show}
            onHide={onHide}
            dialogClassName="modal-100w"
            // dialogClassName="w-100"
            // fullscreen={true}
            // fullscreen='sm-down'
        >

            <Modal.Header closeButton>
            </Modal.Header>
            <img className="w-100"
                 src={imageUrl}
                 alt="Image fullscreen"
                 style={{objectFit: 'contain', maxHeight: 'calc(100vh - 129px)'}}
            />

            {/*<Modal.Body>*/}
            {/*</Modal.Body>*/}
        </Modal>
    );
};

export default ModalPopUpImage;