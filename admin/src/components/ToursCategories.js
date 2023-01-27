import React, {useState} from 'react';
import {Button, Nav} from "react-bootstrap";
import ModalPopUp from "./modal/ModalPopUp";
import UserPageCard from "./users/UserPageCard";
import TopicsCategoryPage from "./topicsCategory/TopicsCategoryPage";
import ToursCategoryPage from "./tours/ToursCategoryPage";

const ToursCategories = (props) => {
    const {tagType} = props
    const [showModal, setShowModal] = useState(false)

    const categoriesPageCardComponent = () => (
        <ToursCategoryPage tagType={tagType}/>
    );

    return (
        <Nav variant="pills" defaultActiveKey="/home">
            <Nav.Item>
                <Button
                    onClick={() => {
                        setShowModal(true)
                    }}
                >{
                    tagType === 'categories'
                        ?
                        'Categories'
                        :
                        'Types'
                }</Button>
            </Nav.Item>
            <ModalPopUp
                show={showModal}
                onHide={() => {
                    setShowModal(false)
                }}
                title={tagType === 'categories' ? 'Categories' : 'Types'}
                child={categoriesPageCardComponent}
            />
        </Nav>
    );
};

export default ToursCategories;