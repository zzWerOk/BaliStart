import React from 'react';
import mapPin from '../../../assets/map_pin.png'
import noImageLogo from "../../../img/nophoto.jpg";
import {Image} from "react-bootstrap";

const TourMapPointGoogleMap = (props) => {

    const {name, url} = props

    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
                window.open(url)
            }}
        >

            <p style={{marginBottom: 0}}>
                <strong>
                    {name}
                </strong>
            </p>

            <div className="input-group">
                <button
                    type="button"
                    className="btn btn-secondary"
                >
                    <Image
                        style={{
                            width: '16px',
                            height: '16px',
                            transform: 'translate(-3px, -3px)',
                        }}
                        src={mapPin}
                    />
                    Open
                </button>

                <div className="input-group-prepend">
                    <div className="input-group-text" id="btnGroupAddon">
                        {url}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default TourMapPointGoogleMap;