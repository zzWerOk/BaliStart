import React from 'react';
import classes from "./Feed_topics.module.css";
const FeedTopic = (props) => {

    const {item} = props

    return (

        <li
            className="list-group-item"
        >

            <a href="#"
               className={`flex-column align-items-start ${classes.textColor}`}
               // style={{color: COLORS.text}}
            >
                <div
                    className="d-flex w-100 justify-content-between"
                    // style={{paddingTop: '16px'}}
                >
                    <h5 className="mb-1">{item.name}</h5>
                    <small>{item.date}</small>
                </div>
                <p
                    className="mb-1"
                    // style={{paddingBottom: '16px'}}
                >{item.userName}</p>
            </a>

        </li>

    );
};

export default FeedTopic;