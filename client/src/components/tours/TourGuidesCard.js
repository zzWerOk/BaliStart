import React from 'react';
import TourGuidesDetailsCard from "./TourGuidesDetailsCard";

const TourGuidesCard = (props) => {

    const {items, tourGuideClicked, clickTourGuide} = props

    const clickTourGuide2 = (guideId) => {
        clickTourGuide(guideId)
    }

    return (
            <div className="container">
                <div className="text-center row justify-content-center">

                    {
                        items.map(function (currGuide, index) {
                            return <TourGuidesDetailsCard
                                key={currGuide.id + ' ' + index}
                                currGuide={currGuide}
                                index={index}
                                tourGuideClicked={tourGuideClicked}
                                clickTourGuide={clickTourGuide2}
                            />
                        })
                    }

                </div>
            </div>
    );
};

export default TourGuidesCard;