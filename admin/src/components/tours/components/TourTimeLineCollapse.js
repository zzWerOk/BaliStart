import React, {useEffect, useState} from 'react';
import './TourTimeLineCollapse.css';
import {MDBCollapse} from "mdb-react-ui-kit";
import noImageLogo from "../../../img/nophoto.jpg";
import {Image} from "react-bootstrap";
import TourMapPointText from "./TourMapPointText";
import TourMapPointGoogleMap from "./TourMapPointGoogleMap";

const TourTimeLineCollapse = (props) => {

    const {dataItems, name, description, image_logo, index} = props

    const [showShow, setShowShow] = useState(false);
    const [itemImageLogo, setItemImageLogo] = useState('')

    useEffect(
        () => {
            if (image_logo) {
                setItemImageLogo(image_logo + '?' + Date.now())
            }

        }
    )

    const toggleShow = () => setShowShow(!showShow);


    return (
        <li className="timeline-item mb-5" key={index} onClick={toggleShow}>

            <span className="timeline-icon">
                {index + 1}
            </span>
            <h5 className="fw-bold">{name}</h5>

            <MDBCollapse show={showShow}>
                <div>
                    <Image

                        style={{
                            float: 'left',
                            margin: '5px',
                            objectFit: 'cover',
                            width: '150px',
                            maxHeight: '95px',
                        }}
                        src={itemImageLogo
                            ?
                            `${process.env.REACT_APP_API_URL}/static/${itemImageLogo}`
                            :
                            noImageLogo
                        }
                    />
                </div>

                <p
                    className="text-muted"
                    style={{
                        textAlign: 'justify',
                    }}
                >
                    {description}
                </p>

                {dataItems
                    ?
                    dataItems.map(function (item, index) {

                        if (item.hasOwnProperty('type')) {
                            switch (item.type) {
                                case 'text':
                                    return <TourMapPointText
                                        key={index}
                                        name={item.name}
                                        text={item.text}
                                    />
                                case 'googleMapUrl':
                                    return <TourMapPointGoogleMap
                                        key={index}
                                        name={item.name}
                                        url={item.url}
                                    />
                            }
                        }
                    })
                    :
                    null
                }

                {/**/}

            </MDBCollapse>


        </li>
    );
};

export default TourTimeLineCollapse;