import React, {useState} from 'react';
import {Button, Nav} from "react-bootstrap";
import ModalPopUp from "./modal/ModalPopUp";
import UserPageCard from "./users/UserPageCard";
import TopicsCategoryPage from "./topicsCategory/TopicsCategoryPage";

const TopicsCategories = () => {
    const [showModal, setShowModal] = useState(false)

    const categoriesPageCardComponent = () => ( <TopicsCategoryPage /> );

    return (
        <Nav variant="pills" defaultActiveKey="/home">
            <Nav.Item>
                <Button
                    onClick={() => {
                        setShowModal(true)
                    }}
                >Categories</Button>
            </Nav.Item>
            <ModalPopUp
                show={showModal}
                onHide={() => {
                    setShowModal(false)
                }}
                title={'Categories'}
                child={categoriesPageCardComponent}
            />
        </Nav>
    );
};

export default TopicsCategories;