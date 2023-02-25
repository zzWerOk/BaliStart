import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import {getAllGuides} from "../http/guideAPI";
import TourGuidesCard from "../components/tours/components/TourGuidesCard";
import TourGuideEditCard from "../components/tours/components/TourGuideEditCard";

const GuidePage = () => {
    const {navBarTitle} = useContext(Context)

    const [loading, setLoading] = useState(true)
    const [guidesList, setGuidesList] = useState([])
    const [tourGuideClicked, setTourGuideClicked] = useState(-1)

    const [selectedGuideDates, setSelectedGuideDates] = useState({})
    const [selectedGuide, setSelectedGuide] = useState(null)
    const [selectedGuideEdited, setSelectedGuideEdited] = useState(false)

    const [redraw, setRedraw] = useState(false)

    const clickTourGuide = (guideId) => {

        if (guideId === tourGuideClicked) {
            setTourGuideClicked(-1)
            setSelectedGuide(null)
            setSelectedGuideEdited(false)
            setSelectedGuideDates({})
        } else {
            setTourGuideClicked(guideId)

            const usersArr = guidesList
            for (let i = 0; i < usersArr.length; i++) {
                const currUser = usersArr[i]
                if (guideId === currUser.id) {
                    setSelectedGuide(JSON.parse(JSON.stringify(currUser)))
                    break
                }
            }
        }

    }

    useEffect(() => {
        setLoading(true)
        navBarTitle.navBarTitle = 'Guide Page'

        getAllGuides().then(data => {
            if (data.hasOwnProperty('count') && data.hasOwnProperty('rows')) {
                setGuidesList(data.rows)

                // console.log(data.rows)
            }
        }).catch(() => {

        }).finally(() => {
            setLoading(false)
        })

    }, [])

    const setUserSaved = (value) => {
        const currGuide = JSON.parse(JSON.stringify(selectedGuide))

        currGuide.avatar_img = value.avatar_img

        // setSelectedGuide(JSON.parse(JSON.stringify(value)))

        const usersArr = JSON.parse(JSON.stringify(guidesList))
        for (let i = 0; i < usersArr.length; i++) {
            const currUser = usersArr[i]
            if (currGuide.id === currUser.id) {
                usersArr[i] = JSON.parse(JSON.stringify(currGuide))
                break
            }
        }

        setSelectedGuide(currGuide)
        setGuidesList(usersArr)

        setRedraw(!redraw)
    }

    const setGuideEdited = (value) => {
        setSelectedGuideEdited(value)
    }

    const setGuideDates = (value) => {
        setSelectedGuideDates(value)
    }



    if (loading) {

    } else {
        return (
            <div>
                <><br/></>

                {
                    !selectedGuide
                        ?
                        <div>
                            <TourGuidesCard
                                items={guidesList}
                                clickTourGuide={clickTourGuide}
                                tourGuideClicked={tourGuideClicked}
                                redraw={redraw}
                            />
                        </div>
                        :
                        <div>
                            <TourGuidesCard
                                items={JSON.parse(JSON.stringify([selectedGuide]))}
                                clickTourGuide={clickTourGuide}
                                tourGuideClicked={tourGuideClicked}
                                selectedGuideEdited={selectedGuideEdited}
                                selectedGuideDates={selectedGuideDates}
                                redraw={redraw}
                            />
                        </div>
                }

                <><br/><br/><br/></>

                {
                    selectedGuide
                        ?
                        <TourGuideEditCard
                            tourGuideClicked={tourGuideClicked}
                            setGuideEdited={setGuideEdited}
                            setUserSaved={setUserSaved}
                            setGuideDates={setGuideDates}
                            clickTourGuide={clickTourGuide}
                        />
                        :
                        null
                }

            </div>
        );
    }
};

export default GuidePage;