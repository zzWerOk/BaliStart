import React, {useContext, useEffect, useState} from 'react';
import './FeedTour.css'
import {Context} from "../../../index";
import {getTourActivityLevel, getTourDuration, tourLanguages} from "../../../utils/consts";
import classes from "./Feed_topics.module.css";
import {useHistory} from "react-router-dom";

const FeedTour = (props) => {
    const history = useHistory()

    const {toursCategoryStore, toursTypeStore} = useContext(Context)

    const {item} = props

    const [itemImage, setItemImage] = useState('')

    useEffect(() => {

        if (item.image) {
            setItemImage(process.env.REACT_APP_API_URL + '/static/' + item.image + '?' + Date.now())
        }

    }, [])

    const tourTypes = (types) => {
        const typesArr = JSON.parse(types)
        let typesText = ''
        typesArr.map(item => {
            typesText = typesText + toursTypeStore.getTypeNameById(item) + ' '
        })
        return typesText
    }

    const tourCategories = (types) => {
        const typesArr = JSON.parse(types)
        let typesText = ''
        typesArr.map(item => {
            typesText = typesText + toursCategoryStore.getTypeNameById(item) + ' / '
        })
        typesText = typesText.substring(0, typesText.length - 3);

        return typesText
    }

    return (

        <li
            className={`list-group-item `}
        >
            <a className={`${classes.textColor} ${classes.pointer}`}
               onClick={() => {
                   history.push('/tour/' + item.id)
               }}
            >
                <div className="blog-card ">
                    <div className="meta">
                        <div className="photo"
                             style={{
                                 backgroundImage: `url(${itemImage})`,
                             }}

                        >

                        </div>
                        <ul className="details">
                            <li>{getTourDuration(item.duration)}</li>
                            <li>{tourTypes(item.tour_type)}</li>
                            <li>{getTourActivityLevel(item.activity_level)}</li>
                            <li>{tourLanguages(item.languages)}</li>
                        </ul>
                    </div>
                    <div className="description col-md-8">
                        <h1 className="text-truncate">{item.name}</h1>
                        <h2 className="text-truncate">{tourCategories(item.tour_category)}</h2>
                        <p className="">{item.description}</p>
                        <div className={'d-flex align-items-center justify-content-between'}>
                            <div className={'price'}
                            style={{color: "black"}}
                            >
                                {item.price_usd}
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     className="bi bi-currency-dollar" viewBox="0 0 16 16">
                                    <path
                                        d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718H4zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73l.348.086z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        </li>
    );
};

export default FeedTour;