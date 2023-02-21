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
                            // <div key={currGuide.id + ' ' + index}
                            //             className="col-xl-4 mb-4"
                            // >
                            //
                            //         <div className={`bg-white rounded py-3 px-4 shadow-sm`}
                            //         ><img
                            //             src="https://bootstrapious.com/i/snippets/sn-team/teacher-4.jpg" alt="" width="100"
                            //             className={`img-fluid rounded-circle mb-3 img-thumbnail shadow-sm`}
                            //         />
                            //             <h5 className="mb-0">{currGuide.name}</h5><span
                            //                 className="small text-uppercase text-muted">Guide experience 15 years</span>
                            //             <ul className="social mb-0 list-inline mt-3">
                            //                 <li className="list-inline-item"><a href="#" className="social-link"><i
                            //                     className="fa fa-facebook-f"></i></a></li>
                            //                 <li className="list-inline-item"><a href="#" className="social-link"><i
                            //                     className="fa fa-twitter"></i></a></li>
                            //                 <li className="list-inline-item"><a href="#" className="social-link"><i
                            //                     className="fa fa-instagram"></i></a></li>
                            //                 <li className="list-inline-item"><a href="#" className="social-link"><i
                            //                     className="fa fa-linkedin"></i></a></li>
                            //             </ul>
                            //         </div>
                            //
                            // </div>
                        })
                    }

                    {/*<div className="col-xl-3 col-sm-6 mb-5">*/}
                    {/*    <div className="bg-white rounded shadow-sm py-5 px-4"><img*/}
                    {/*        src="https://bootstrapious.com/i/snippets/sn-team/teacher-4.jpg" alt="" width="100"*/}
                    {/*        className="img-fluid rounded-circle mb-3 img-thumbnail shadow-sm"/>*/}
                    {/*        <h5 className="mb-0">Manuella Nevoresky</h5><span*/}
                    {/*        className="small text-uppercase text-muted">CEO - Founder</span>*/}
                    {/*        <ul className="social mb-0 list-inline mt-3">*/}
                    {/*            <li className="list-inline-item"><a href="#" className="social-link"><i*/}
                    {/*                className="fa fa-facebook-f"></i></a></li>*/}
                    {/*            <li className="list-inline-item"><a href="#" className="social-link"><i*/}
                    {/*                className="fa fa-twitter"></i></a></li>*/}
                    {/*            <li className="list-inline-item"><a href="#" className="social-link"><i*/}
                    {/*                className="fa fa-instagram"></i></a></li>*/}
                    {/*            <li className="list-inline-item"><a href="#" className="social-link"><i*/}
                    {/*                className="fa fa-linkedin"></i></a></li>*/}
                    {/*        </ul>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    {/*<div className="col-xl-3 col-sm-6 mb-5">*/}
                    {/*    <div className="bg-white rounded shadow-sm py-5 px-4"><img*/}
                    {/*        src="https://bootstrapious.com/i/snippets/sn-team/teacher-2.jpg" alt="" width="100"*/}
                    {/*        className="img-fluid rounded-circle mb-3 img-thumbnail shadow-sm"/>*/}
                    {/*        <h5 className="mb-0">Samuel Hardy</h5><span className="small text-uppercase text-muted">CEO - Founder</span>*/}
                    {/*        <ul className="social mb-0 list-inline mt-3">*/}
                    {/*            <li className="list-inline-item"><a href="#" className="social-link"><i*/}
                    {/*                className="fa fa-facebook-f"></i></a></li>*/}
                    {/*            <li className="list-inline-item"><a href="#" className="social-link"><i*/}
                    {/*                className="fa fa-twitter"></i></a></li>*/}
                    {/*            <li className="list-inline-item"><a href="#" className="social-link"><i*/}
                    {/*                className="fa fa-instagram"></i></a></li>*/}
                    {/*            <li className="list-inline-item"><a href="#" className="social-link"><i*/}
                    {/*                className="fa fa-linkedin"></i></a></li>*/}
                    {/*        </ul>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    {/*<div className="col-xl-3 col-sm-6 mb-5">*/}
                    {/*    <div className="bg-white rounded shadow-sm py-5 px-4"><img*/}
                    {/*        src="https://bootstrapious.com/i/snippets/sn-team/teacher-1.jpg" alt="" width="100"*/}
                    {/*        className="img-fluid rounded-circle mb-3 img-thumbnail shadow-sm"/>*/}
                    {/*        <h5 className="mb-0">Tom Sunderland</h5><span className="small text-uppercase text-muted">CEO - Founder</span>*/}
                    {/*        <ul className="social mb-0 list-inline mt-3">*/}
                    {/*            <li className="list-inline-item"><a href="#" className="social-link"><i*/}
                    {/*                className="fa fa-facebook-f"></i></a></li>*/}
                    {/*            <li className="list-inline-item"><a href="#" className="social-link"><i*/}
                    {/*                className="fa fa-twitter"></i></a></li>*/}
                    {/*            <li className="list-inline-item"><a href="#" className="social-link"><i*/}
                    {/*                className="fa fa-instagram"></i></a></li>*/}
                    {/*            <li className="list-inline-item"><a href="#" className="social-link"><i*/}
                    {/*                className="fa fa-linkedin"></i></a></li>*/}
                    {/*        </ul>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    {/*<div className="col-xl-3 col-sm-6 mb-5">*/}
                    {/*    <div className="bg-white rounded shadow-sm py-5 px-4"><img*/}
                    {/*        src="https://bootstrapious.com/i/snippets/sn-team/teacher-7.jpg" alt="" width="100"*/}
                    {/*        className="img-fluid rounded-circle mb-3 img-thumbnail shadow-sm"/>*/}
                    {/*        <h5 className="mb-0">John Tarly</h5><span className="small text-uppercase text-muted">CEO - Founder</span>*/}
                    {/*        <ul className="social mb-0 list-inline mt-3">*/}
                    {/*            <li className="list-inline-item"><a href="#" className="social-link"><i*/}
                    {/*                className="fa fa-facebook-f"></i></a></li>*/}
                    {/*            <li className="list-inline-item"><a href="#" className="social-link"><i*/}
                    {/*                className="fa fa-twitter"></i></a></li>*/}
                    {/*            <li className="list-inline-item"><a href="#" className="social-link"><i*/}
                    {/*                className="fa fa-instagram"></i></a></li>*/}
                    {/*            <li className="list-inline-item"><a href="#" className="social-link"><i*/}
                    {/*                className="fa fa-linkedin"></i></a></li>*/}
                    {/*        </ul>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                </div>
            </div>
    );
};

export default TourGuidesCard;