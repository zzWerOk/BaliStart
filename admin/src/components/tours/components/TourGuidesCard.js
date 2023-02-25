import React, {useEffect, useState} from 'react';
import TourGuidesDetailsCard from "./TourGuidesDetailsCard";

const TourGuidesCard = (props) => {

    const {items, tourGuideClicked, clickTourGuide, selectedGuideEdited, selectedGuideDates, redraw} = props

    const [loading, setLoading] = useState(true)

    const clickTourGuide2 = (guideId) => {
        clickTourGuide(guideId)
    }

    useEffect(() => {
        setLoading(true)

        setLoading(false)
    }, [])

    if (loading) {

    } else {
        return (
            <div className="container">
                <div className="text-center row justify-content-center">

                    {
                        items.map(function (currGuide, index) {
                            return <TourGuidesDetailsCard
                                key={currGuide.id + ' ' + index + redraw}
                                currGuide={currGuide}
                                index={index}
                                tourGuideClicked={tourGuideClicked}
                                clickTourGuide={clickTourGuide2}
                                selectedGuideEdited={selectedGuideEdited}
                                selectedGuideDates={selectedGuideDates}
                            />
                        })
                    }

                </div>
            </div>
        );
    }
};

export default TourGuidesCard;