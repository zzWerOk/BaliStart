import React from 'react';
import {Dropdown, DropdownButton} from "react-bootstrap";

const BaliNewTopicElement = (props) => {
    const {title, index, dropDownItems, child, isDragDisableHandler, itemDeleteHandler} = props
    return (
        <div
            className={
                `card
                shadow-sm
                my-2 
                w-100 d-flex justify-content-between`
            }
            style={{flexDirection: 'row'}}
        >

            <div className="col-12 "
            >

                <DropdownButton
                    id="dropdown-button"
                    variant="secondary"
                    menuVariant="dark"
                    size="sm"
                    title={title}
                >
                    {dropDownItems.map(item => {
                        return <Dropdown.Item
                            key={item.id}
                            onClick={() => {
                                // handleChange(item.type)
                            }}
                        >{item.name}</Dropdown.Item>
                    })}
                </DropdownButton>

                {
                    child
                        ?
                        <div className="card-body text-dark text-center"
                             onMouseMove={() => {
                                 isDragDisableHandler(true)
                             }}
                        >
                            {child}
                        </div>
                        :
                        null
                }
            </div>


            <div className={'d-flex flex-column'}
                 onMouseMove={() => {
                     isDragDisableHandler(false)
                 }}
            >

                <div>
                    <button
                        type="button"
                        className="btn-close p-2"
                        onClick={() => {
                            itemDeleteHandler(index)
                        }}
                    >
                    </button>
                </div>

                <div className={'d-flex align-items-center justify-content-center h-100 '}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                         className="bi bi-grip-vertical align-middle" viewBox="0 0 16 16">
                        <path
                            d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default BaliNewTopicElement;