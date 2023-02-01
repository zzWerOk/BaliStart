import React from 'react';

const TourMapPointText = (props) => {

    const {name, text} = props

    return (
        <div>

            <p style={{marginBottom: 0}}>
                <strong>
                    {name}
                </strong>
            </p>
            <p className="font-weight-light">
                <small>
                    {text}
                </small>
            </p>

        </div>
    );
};

export default TourMapPointText;