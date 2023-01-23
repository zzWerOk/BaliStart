import React from 'react';
import {Dropdown, DropdownButton} from "react-bootstrap";
import {values} from "mobx";

const TopicItemCard = (props) => {
    const {child, index, dropDownItems, title, changeItemType, deleteDataItemByIndex} = props

    const selectType = (id, type) => {
        changeItemType(id, type)
    }

    const itemDeleteHandler = (index) => {
        deleteDataItemByIndex(index)
    }

    return (
        <div
            key={index}
            className="card border-dark w-75 "
            style={{display: 'flex' ,flexDirection: 'row'}}
        >
            <div className="w-50 ">
                <Dropdown>
                    <Dropdown.Toggle
                        variant="secondary"
                        size="sm"
                        id="dropdown-basic"
                    >
                        {title}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>

                        {dropDownItems.map(item => {
                            return <Dropdown.Item
                                key={item.id}
                                onClick={() => {
                                    selectType(index, item.type)
                                }}
                            >{item.name}</Dropdown.Item>
                        })}
                    </Dropdown.Menu>
                </Dropdown>
                <div className="card-body text-dark text-center">
                    {child}
                </div>
            </div>
            <div className="w-50"
            >
                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => {
                        itemDeleteHandler(index)
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                         className="bi bi-x"
                         viewBox="0 0 16 16">
                        <path
                            d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default TopicItemCard;