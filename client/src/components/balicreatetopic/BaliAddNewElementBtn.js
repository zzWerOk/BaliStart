import React, {useEffect, useState} from 'react';
import {Dropdown, DropdownButton} from "react-bootstrap";
import './BaliTextArea.css'

const BaliAddNewElementBtn = (props) => {
    const {items = [], onItemSelectHandler} = props

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)

        setLoading(false)
    }, [])

    const handleChange = (elementCode) => {
        // console.log(elementCode)
        onItemSelectHandler(elementCode)
    };

    if (loading) {

    } else {
        return (
            <div className={'col-12 d-flex justify-content-center pt-3 mb-4'}>

                <DropdownButton
                    id="dropdown-button"
                    variant="primary"
                    menuVariant="dark"
                    title="Add new item"
                    className="mt-2 "
                >
                    {items.map(item => {
                        return <Dropdown.Item
                            key={item.id}
                            onClick={() => {
                                handleChange(item.type)
                            }}
                        >{item.name}</Dropdown.Item>
                    })}
                </DropdownButton>

            </div>
        );
    }
};

export default BaliAddNewElementBtn;