import React from 'react';
import {Dropdown} from "react-bootstrap";

const TopicItemCard = (props) => {

    const {child, index, dropDownItems, title, changeItemType, deleteDataItemByIndex, moveItemUp, moveItemDown, isMovedDownItem} = props

    const selectType = (id, type) => {
        changeItemType(id, type)
    }

    const itemDeleteHandler = (index) => {
        deleteDataItemByIndex(index)
    }

    const moveItemUpHandler = () => {
        moveItemUp(index)
    }

    const moveItemDownHandler = () => {
        moveItemDown(index)
    }

    return (
        <div
            key={index}
            className={
                `card 
                border-dark 
                w-100 d-flex justify-content-between 
                ${isMovedDownItem ? 'moved-item-down' : ''}`
            }
            style={{flexDirection: 'row'}}
        >
            <div className="col-11 ">
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
            <div className={'d-flex flex-column'}>

                <div>
                    <button
                        type="button"
                        className="btn btn-outline-secondary "
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

                <div style={{
                    height: '100%',
                    paddingBottom: '17px'
                }}
                     className={'d-flex align-items-end'}
                >
                    <div className={'d-flex flex-column'}>

                        {moveItemUp
                            ?
                            <button
                                type="button"
                                className="btn btn-outline-secondary "
                                onClick={() => {
                                    moveItemUpHandler()
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     className="bi bi-arrow-bar-up" viewBox="0 0 16 16">
                                    <path fillRule="evenodd"
                                          d="M8 10a.5.5 0 0 0 .5-.5V3.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 3.707V9.5a.5.5 0 0 0 .5.5zm-7 2.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5z"/>
                                </svg>

                            </button>
                            :
                            null}

                        {moveItemDown
                            ?
                            <button
                                type="button"
                                className="btn btn-outline-secondary "
                                onClick={() => {
                                    moveItemDownHandler()
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     className="bi bi-arrow-bar-down" viewBox="0 0 16 16">
                                    <path fillRule="evenodd"
                                          d="M1 3.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5zM8 6a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 .708-.708L7.5 12.293V6.5A.5.5 0 0 1 8 6z"/>
                                </svg>

                            </button>
                            :
                            null}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TopicItemCard;