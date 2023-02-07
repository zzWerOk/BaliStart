import React from 'react';
import classes from "./Feed_topics.module.css";
import {dateToEpoch, epochToDateWithTime} from "../../../utils/consts";
import {useHistory} from "react-router-dom";

const FeedTopic = (props) => {
    const history = useHistory()

    const {item} = props

    // console.log(item)

    return (

        <li
            className="list-group-item"
        >


            <a
               className={`flex-column align-items-start ${classes.textColor}`}
               onClick={() => {
                   history.push('/topic/' + item.id)
               }}
            >
                <div className="d-flex w-100 justify-content-between">
                    <div></div>
                    <small className="mb-1"
                    >{item.created_by_user_name || ''}</small>
                </div>
                <div
                    className="d-flex w-100 justify-content-between"
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