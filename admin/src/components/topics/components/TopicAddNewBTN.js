import React from 'react';
import {Dropdown, } from "react-bootstrap";

const TopicAddNewBtn = (props) => {
    const {addNewItemHandler, dropDownItems, disabled} = props

    return (
        <div className={'col-12 d-flex justify-content-center pt-3'}>

            <Dropdown>
                <Dropdown.Toggle
                    variant="secondary"
                    size="sm"
                    id="dropdown-addNew"
                    disabled={!!disabled}
                >
                    Add new item
                </Dropdown.Toggle>

                <Dropdown.Menu>

                        {dropDownItems.map(item => {
                            return <Dropdown.Item
                                key={item.id}
                                onClick={() => {
                                    addNewItemHandler(item.id)
                                }}
                            >{item.name}</Dropdown.Item>
                        })}

                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
};

export default TopicAddNewBtn;