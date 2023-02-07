import React from 'react';
import classes from "./Feed_category.module.css";
import {CATEGORY_ROUTE, dateToEpoch, epochToDate} from "../../../utils/consts";
import {useHistory} from "react-router-dom";

const FeedCategory = (props) => {
    const history = useHistory()

    const {item} = props

    return (
        <div
            style={{padding: '10px 20px '}}
        >
            <a className={`list-group-item  flex-column align-items-start ${classes.textColor} text-truncate`}
               style={{padding: '16px!important 24px!important'}}
               onClick={() => {
                   history.push('/category/' + item.id)
               }}
            >
                <div
                    className="d-flex w-100 justify-content-between"
                    style={{paddingTop: '16px'}}
                >
                    <h5 className="mb-1">{item.category_name}</h5>
                    <small>{epochToDate(dateToEpoch(item.updatedAt) * 1000)}</small>
                </div>
                <small
                    className="mb-1"
                    style={{paddingBottom: '16px'}}
                >{item.description}</small>
            </a>
        </div>
    );
};

export default FeedCategory;