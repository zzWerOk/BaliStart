import React from 'react';
import classes from "./Feed_category.module.css";

const FeedCategory = (props) => {

    const {item} = props

    return (
        <div
            style={{padding: '10px 20px '}}
        >
            <a href="#"
               className={`list-group-item  flex-column align-items-start ${classes.textColor}`}
               style={{padding: '16px!important 24px!important'}}
            >
                <div
                    className="d-flex w-100 justify-content-between"
                    style={{paddingTop: '16px'}}
                >
                    <h5 className="mb-1">{item.name}</h5>
                    <small>{item.date}</small>
                </div>
                <p
                    className="mb-1"
                    style={{paddingBottom: '16px'}}
                >{item.description}</p>
            </a>
        </div>
    );
};

export default FeedCategory;