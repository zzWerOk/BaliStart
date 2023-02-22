import React, {useEffect, useState} from 'react';
import './TourGuidesDetailsCard.css'

const TourGuidesDetailsCard = (props) => {
    const {currGuide, index, tourGuideClicked, clickTourGuide} = props

    const [isHover, setIsHover] = useState(false);
    const [guideImage, setGuideImage] = useState('');
    const [loading, setLoading] = useState(true);

    const handleMouseEnter = () => {
        setIsHover(true);
    };
    const handleMouseLeave = () => {
        setIsHover(false);
    };

    useEffect(() => {
        setLoading(true)

        if(currGuide.hasOwnProperty('image')){
            setGuideImage(process.env.REACT_APP_API_URL + '/static/' + currGuide.image + '?' + Date.now())
        }else{
            setGuideImage(process.env.REACT_APP_API_URL + '/static/' + 'guide_avatar.png' + '?' + Date.now())
        }

        setLoading(false)
    }, [])

    if(loading){

    }else {
        return (
            <div key={currGuide.id + ' ' + index}
                 className={`${tourGuideClicked === currGuide.id ? 'col-xl-12' : 'col-xl-4'} mb-4 `}
                // className={`col-xl-4 mb-4`}
            >
                <div className={` rounded py-3 px-4 ${isHover ? 'shadow' : 'shadow-sm'} 
            ${tourGuideClicked === currGuide.id ? 'clicked' : null} 
            ${tourGuideClicked === currGuide.id ? 'd-flex justify-content-start' : null}`}
                     onMouseEnter={handleMouseEnter}
                     onMouseLeave={handleMouseLeave}
                     onClick={() => {
                         clickTourGuide(currGuide.id)
                     }}
                    // style={{backgroundColor: tourGuideClicked === currGuide.id ? 'rgba(204,204,204,0.4)' : null }}
                >

                    {
                        tourGuideClicked === currGuide.id
                            ?
                            <>
                                <div className={'col-3'}>
                                    <img
                                        // src="https://bootstrapious.com/i/snippets/sn-team/teacher-4.jpg" alt=""
                                        src={guideImage} alt="Guide avatar"
                                        width="100"
                                        className={`img-fluid rounded-circle mb-3 img-thumbnail shadow-sm`}
                                    />
                                    <h5 className="mb-0">{currGuide.name}</h5><span
                                    className="small text-uppercase text-muted">Guide experience 15 years</span>
                                    <ul className="social mb-0 list-inline mt-3">
                                        <li className="list-inline-item"><a href="#" className="social-link"><i
                                            className="fa fa-facebook-f"></i></a></li>
                                        <li className="list-inline-item"><a href="#" className="social-link"><i
                                            className="fa fa-twitter"></i></a></li>
                                        <li className="list-inline-item"><a href="#" className="social-link"><i
                                            className="fa fa-instagram"></i></a></li>
                                        <li className="list-inline-item"><a href="#" className="social-link"><i
                                            className="fa fa-linkedin"></i></a></li>
                                    </ul>
                                </div>
                                <div className={'col'}>
                                    Guide info
                                </div>
                            </>
                            :
                            <>
                                <img
                                    src={guideImage} alt="Guide avatar"  width="100"
                                    // src="https://bootstrapious.com/i/snippets/sn-team/teacher-4.jpg" alt=""
                                    className={`img-fluid rounded-circle mb-3 img-thumbnail shadow-sm`}
                                />
                                <h5 className="mb-0">{currGuide.name}</h5><span
                                className="small text-uppercase text-muted">Guide experience 15 years</span>
                                <ul className="social mb-0 list-inline mt-3">
                                    <li className="list-inline-item"><a href="#" className="social-link"><i
                                        className="fa fa-facebook-f"></i></a></li>
                                    <li className="list-inline-item"><a href="#" className="social-link"><i
                                        className="fa fa-twitter"></i></a></li>
                                    <li className="list-inline-item"><a href="#" className="social-link"><i
                                        className="fa fa-instagram"></i></a></li>
                                    <li className="list-inline-item"><a href="#" className="social-link"><i
                                        className="fa fa-linkedin"></i></a></li>
                                </ul>
                            </>
                    }

                </div>

            </div>
        );
    }
};

export default TourGuidesDetailsCard;