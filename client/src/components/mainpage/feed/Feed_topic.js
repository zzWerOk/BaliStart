import React from 'react';
import classes from "./Feed_topics.module.css";
import {dateToEpoch, epochToDate, epochToDateWithTime} from "../../../utils/consts";

const FeedTopic = (props) => {

    const {item} = props

    console.log(item)

    return (

        <li
            className="list-group-item"
        >


            <a href="#"
               className={`flex-column align-items-start ${classes.textColor}`}
                // style={{color: COLORS.text}}
            >
                <div className="d-flex w-100 justify-content-between">
                    <div></div>
                    <small className="mb-1"
                    >{item.created_by_user_name || ''}</small>
                </div>
                <div
                    className="d-flex w-100 justify-content-between"
                    // style={{paddingTop: '16px'}}
                >
                    <h5 className="mb-1">{item.name}</h5>
                    <small>{epochToDateWithTime(dateToEpoch(item.updatedAt) * 1000) || ''}</small>
                </div>

                <small className="mb-1"
                >{item.description}</small>
            </a>

        </li>

    );
};

export default FeedTopic;