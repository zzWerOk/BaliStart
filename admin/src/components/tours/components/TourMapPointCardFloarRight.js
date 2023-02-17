import React, {useEffect, useState} from 'react';
import TopicDetailTextComponent from "./TopicDetailTextComponent";
import ElementLink from "./ElementLink";

const TourMapPointCardFloatRight = (props) => {

    const {cardImageUrl, cardName, cardDescription, cardData} = props

    const [textComponentItems, setTextComponentItems] = useState([])
    const [linkComponentsItems, setLinkComponentsItems] = useState([])
    const [topicComponentsItems, setTopicComponentsItems] = useState([])

    useEffect(() => {

        cardData.map(function (item) {

            console.log(item)

            if (item.type === 'googleMapUrl') {
                setLinkComponentsItems([...linkComponentsItems, item])
            } else if (item.type === 'topic') {
                setTopicComponentsItems([...topicComponentsItems, item])
            } else {//text
                setTextComponentItems([...textComponentItems, item])
            }
        })

        // setTopicName(item.topicName)
        // setTopicId(item.topicId)
        // setLoading(false)
        // setTopicsItems(topicsStore.getTopicsList)
    }, [])


    return (
        <div className="card float-right">
            <div className="row">
                <div className="col-sm-5">
                    <img className="d-block w-100" src={cardImageUrl} alt={cardName}/>
                </div>
                <div className="col-sm-7">
                    <div className="card-block">
                        <h4 className="card-title">
                            {cardName}
                        </h4>
                        {cardDescription}
                        <br/>
                        <br/>

                        {
                            textComponentItems.length > 0
                                ?
                                textComponentItems.map(function (item, index) {
                                    return <div key={index}
                                    >
                                        <TopicDetailTextComponent
                                            element={item}
                                        />
                                        <br/>
                                    </div>
                                })
                                :
                                null
                        }

                            <div className={'d-flex justify-content-between '}>
                        {/*<Row>*/}
                            <div className={'d-flex flex-column col-5'}>
                                <ul className="list-group list-group-flush">

                                    {
                                        linkComponentsItems.map(function (item, index, element) {
                                            if (item.name && item.url) {
                                                return <ElementLink
                                                        key={item.url + index}
                                                        item={item}
                                                        element={element}
                                                        onClick={e => e.preventDefault()}

                                                />

                                            }
                                        })
                                    }
                                </ul>
                            </div>
                        {/*</Row>*/}
                            <div className={'d-flex flex-column col-5'}>
                                {
                                    topicComponentsItems.map(function (item, index) {
                                        if (item.topicName && item)
                                            return <a key={item.topicName + index}
                                                      href={`${process.env.REACT_APP_CLIENT_URL}/topic/${item.topicId}`}
                                                      className="btn btn-primary btn-sm float-right"
                                                      target="_blank"
                                                      rel="noreferrer"
                                            >
                                                {item.topicName}
                                            </a>
                                    })
                                }

                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}


export default TourMapPointCardFloatRight;