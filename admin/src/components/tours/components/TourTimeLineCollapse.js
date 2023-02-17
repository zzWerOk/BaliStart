import React, {useMemo, useState} from 'react';
import './TourTimeLineCollapse.css';
import {MDBCollapse} from "mdb-react-ui-kit";
import noImageLogo from "../../../img/nophoto.jpg";
import TourMapPointCardFloatRight from "./TourMapPointCardFloarRight";

const TourTimeLineCollapse = (props) => {

    const {dataItems, name, description, image_logo, index} = props

    const [showShow, setShowShow] = useState(false);
    const [itemImageLogo, setItemImageLogo] = useState('')

    useMemo(() => {
        try {
            if (image_logo) {
                setItemImageLogo(image_logo + '?' + Date.now())
            }
        } catch (e) {
            console.log(e)
        }
    }, [])


    const toggleShow = () => setShowShow(!showShow);


    return (
        <li className="timeline-item mb-5" key={index} onClick={toggleShow}>

            <span className="timeline-icon">
                {index + 1}
            </span>
            <h5 className="fw-bold">{name}</h5>

            <MDBCollapse
                show={showShow}
            >

                <TourMapPointCardFloatRight
                    cardImageUrl={itemImageLogo ? `${process.env.REACT_APP_API_URL}/static/${itemImageLogo}` : noImageLogo}
                    cardName={name}
                    cardDescription={description}
                    cardData={dataItems}
                />


            </MDBCollapse>
        </li>
    );
};

export default TourTimeLineCollapse;