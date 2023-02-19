import React, {useEffect, useState} from 'react';
import {delay} from "../utils/consts";
import {getAll} from "../http/topicsAPI";
import SpinnerSm from "../components/SpinnerSM";
import FeedTopBar from "../components/mainpage/FeedTopBar";
import FeedAddNewPostBtn from "../components/mainpage/FeedAddNewPostBtn";
import FeedTopic from "../components/mainpage/feed/Feed_topic";

const TopicsPage = (props) => {
    const {id} = props

    const [loading, setLoading] = useState(true)
    const [topicsList, setTopicsList] = useState([])

    useEffect(() => {
        setLoading(true)

        let topicId = id || null

        delay(0).then(() => {

            getAll(topicId).then(data => {
                if (data.hasOwnProperty('count')) {
                    if (data.hasOwnProperty('rows')) {
                        if (data.count > 0) {
                            setTopicsList(data.rows)
                        }
                    }
                }
            }).finally(() => {
                setLoading(false)
            })

        })

    }, [])

    if (loading) {
        return <SpinnerSm/>
    } else {

        return (<div>
                <div style={{marginTop: '20px'}}>

                    <FeedTopBar
                        isSearch={false}
                        isBackBtn={!!id}
                        backBtnTitle={'Back'}
                    />
                    <FeedAddNewPostBtn/>

                    {
                        topicsList.length === 0
                            ?
                            <div style={{marginTop: '20px'}}>
                                <span>Нет записей</span>
                            </div>
                            :
                            <div>
                                <ul
                                    className="list-group list-group-flush"
                                    style={{padding: '0 40px'}}
                                >
                                    {topicsList.map(function (item, index) {
                                        console.log(item)
                                        return <FeedTopic item={item} key={index}/>
                                    })}
                                </ul>
                            </div>
                    }
                </div>
            </div>
        );
    }
};

export default TopicsPage;