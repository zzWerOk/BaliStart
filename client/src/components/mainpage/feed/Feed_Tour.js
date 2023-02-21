import React, {useContext, useEffect, useState} from 'react';
import './FeedTour.css'
import {Context} from "../../../index";
import {getTourActivityLevel, getTourDuration, tourLanguages} from "../../../utils/consts";

const FeedTour = (props) => {
    // const history = useHistory()
    const {toursCategoryStore, toursTypeStore} = useContext(Context)

    const {item} = props

    const [itemImage, setItemImage] = useState('')

    useEffect(() => {

        if (item.image) {
            setItemImage(process.env.REACT_APP_API_URL + '/static/' + item.image + '?' + Date.now())
        }

//image
    }, [])

    // const getTourDuration = (duration) => {
    //     const durationArr = duration.split(' ')
    //     let durationIsDaysText = ''
    //     if (durationArr) {
    //         if (durationArr.length > 1) {
    //             if (durationArr[1] === 'd' || durationArr[1] === '2') {
    //                 durationIsDaysText = ' day'
    //             }else{
    //                 durationIsDaysText = ' hour'
    //             }
    //             if(durationArr[0] + '' !== '' + 1) {
    //                 durationIsDaysText = durationIsDaysText + 's'
    //             }
    //             return durationArr[0] + durationIsDaysText
    //         }
    //     }
    //     return ''
    // }
    //
    // const getTourActivityLevel = (activityLevel) => {
    //     switch (activityLevel) {
    //         case '1':
    //         case 1:
    //             return 'Easy level'
    //         case '2':
    //         case 2:
    //             return 'Normal level'
    //         case '3':
    //         case 3:
    //             return 'Medium level'
    //         case '4':
    //         case 4:
    //             return 'Hard level'
    //         case '5':
    //         case 5:
    //             return 'Expert level'
    //     }
    // }
    //
    // const tourLanguages = (lang) => {
    //     const langArr = JSON.parse(lang)
    //     let langText = ''
    //     langArr.map(item => {
    //
    //         switch (item) {
    //             case 'ru':
    //                 langText = langText + 'Russian '
    //                 break
    //             case 'en':
    //                 langText = langText + 'English '
    //                 break
    //             case 'id':
    //                 langText = langText + 'Indonesian '
    //                 break
    //         }
    //     })
    //
    //     return langText
    // }

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
        typesText = typesText.substring(0, typesText.length-3);

        return typesText
    }

    return (

        <div>
            <div className="blog-card ">
                <div className="meta">
                    <div className="photo"
                         style={{
                             backgroundImage: `url(${itemImage})`,
                         }}

                    >

                    </div>
                    <ul className="details">
                        <li >{getTourDuration(item.duration)}</li>
                        <li >{tourTypes(item.tour_type)}</li>
                        <li >{getTourActivityLevel(item.activity_level)}</li>
                        <li >{tourLanguages(item.languages)}</li>
                    </ul>
                </div>
                <div className="description col-8">
                    <h1 className="text-truncate">{item.name}</h1>
                    <h2 className="text-truncate">{tourCategories(item.tour_category)}</h2>
                    <p className="">{item.description}</p>
                    <div className={'d-flex align-items-center justify-content-between'}>
                        <div className={'price'}>
                            {item.price_usd}
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 className="bi bi-currency-dollar" viewBox="0 0 16 16">
                                <path
                                    d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718H4zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73l.348.086z"/>
                            </svg>
                        </div>
                        <div>
                            <p className="read-more">
                                <a href={"/tour/" + item.id}>Read More</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        // <li
        //     className={`list-group-item `}
        // >
        //
        //
        //     <a
        //         className={`flex-column align-items-start ${classes.textColor} ${classes.pointer}`}
        //         onClick={() => {
        //             history.push('/tour/' + item.id)
        //         }}
        //     >
        //         <div className="d-flex w-100 justify-content-between">
        //             <div></div>
        //             <small className="mb-1"
        //             >{item.created_by_user_name || ''}</small>
        //         </div>
        //         <div
        //             className="d-flex w-100 justify-content-between"
        //         >
        //             <Col>
        //                 <h5 className="mb-1">{item.name}</h5>
        //             </Col>
        //             <Col className={'d-flex justify-content-end'}
        //                  md={2}
        //             >
        //                 <small
        //                     className={''}
        //                 >{epochToDateWithTime(dateToEpoch(item.updatedAt) * 1000) || ''}</small>
        //             </Col>
        //
        //         </div>
        //
        //         <small className="mb-1"
        //         >
        //             {item.description}
        //         </small>
        //
        //     </a>
        //     <div className={'d-flex justify-content-between'}>
        //
        //         <div className={'d-flex'}>
        //
        //             <div className={'d-flex'}>
        //                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
        //                      className="bi bi-chat-left-text" viewBox="0 0 16 16"
        //                      style={{marginTop: '5px'}}
        //                 >
        //                     <path
        //                         d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
        //                     <path
        //                         d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
        //                 </svg>
        //                 <small style={{marginLeft: '5px'}}>
        //                     {item.commentsCount}
        //                 </small>
        //             </div>
        //
        //             <div className={'d-flex'}>
        //                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
        //                      className="bi bi-eye" viewBox="0 0 16 16"
        //                      style={{marginTop: '3px', marginLeft: '15px'}}
        //                 >
        //                     <path
        //                         d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
        //                     <path
        //                         d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
        //                 </svg>
        //                 <small style={{marginLeft: '5px'}}>
        //                     0
        //                 </small>
        //             </div>
        //         </div>
        //
        //         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
        //              className="bi bi-share align-self-end" viewBox="0 0 16 16"
        //              style={{marginTop: '3px', marginLeft: '25px', marginRight: '0px'}}
        //         >
        //             <path
        //                 d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
        //         </svg>
        //     </div>
        //
        // </li>

    );
};

export default FeedTour;