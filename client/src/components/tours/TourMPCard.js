import React, {useEffect, useState} from 'react';
import TopicDetailTextComponent from "../topics/components/TopicDetailTextComponent";
import ElementLink from "../topics/components/ElementLink";
import ElementLinkBtn from "../topics/components/ElementLinkBtn";

const TourMpCard = (props) => {
        const {item} = props

        const [nameMP, setNameMP] = useState('')
        const [descriptionMP, setDescriptionMP] = useState('')
        const [textsMP, setTextsMP] = useState([])
        const [mapUrlsMP, setMapUrlsMP] = useState([])
        const [itemTopic, setItemTopic] = useState(null)
        const [itemImage, setItemImage] = useState('')

        useEffect(() => {
            const itemData = JSON.parse(item.data)
            const itemTextDataArr = []
            const itemMapUrlsDataArr = []

            console.log(JSON.parse(item.data))

            setNameMP(item.name)

            itemData.map(dataItem => {
                if (dataItem.hasOwnProperty('description')) {
                    setDescriptionMP(dataItem.description)
                }

                if (dataItem.hasOwnProperty('type')) {
                    if (dataItem.type === 'text') {
                        itemTextDataArr.push(dataItem)
                    }
                }
                setTextsMP(itemTextDataArr)

                if (dataItem.hasOwnProperty('type')) {
                    if (dataItem.type === 'googleMapUrl') {
                        if(dataItem?.url !== '') {
                            itemMapUrlsDataArr.push(dataItem)
                        }
                    }
                }
                setMapUrlsMP(itemMapUrlsDataArr)

                if (dataItem.hasOwnProperty('type')) {
                    if (dataItem.type === 'topic') {
                        setItemTopic(dataItem)
                    }
                }

                setItemImage(process.env.REACT_APP_API_URL + '/static/' + item.image + '?' + Date.now())
            })

        }, [])

        return (
            <div
                style={{
                    marginLeft: '25px',
                    marginRight: '15px',
                    marginTop: '5px',
                    marginBottom: '15px',
                }}
            >
                <div className="card float-right">
                    <div className={'align-self-center pt-2'}>
                        <h3>
                            {item.name}
                        </h3>
                    </div>
                    <div className="row">
                        <div className="col-xs-4 col-sm-4 col-lg-5 d-flex align-items-center">
                            <img className="d-block w-100 rounded shadow p-2 bg-white"
                                 style={{marginLeft: '-15px'}}
                                 src={itemImage}
                                 alt={nameMP}
                            />
                        </div>

                        <div className="col-sm-7">
                            <div className="card-block" style={{padding: '20px'}}>
                                <p>{descriptionMP}</p>
                                {
                                    textsMP.map(function (item, index) {
                                        return <div key={item.name + index}>
                                            <TopicDetailTextComponent element={item}/>
                                        </div>
                                    })
                                }
                                <br/>
                                <div className={'d-flex'}>
                                    <div className={'col-6'}>
                                        {
                                            mapUrlsMP.map(function (item, index) {
                                                return <div key={item.name + index}>
                                                    <ElementLink item={{
                                                        link: item.url,
                                                        name: item.name,
                                                        type: 'in'
                                                    }}/>
                                                </div>
                                            })
                                        }
                                    </div>
                                    <div className={'col-6 d-flex align-items-center justify-content-end'}>
                                        {
                                            itemTopic
                                                ?
                                                <ElementLinkBtn item={{
                                                    link: '/topic/' + itemTopic.topicId,
                                                    name: 'Read more',
                                                }}/>
                                                :
                                                null
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
;

export default TourMpCard;