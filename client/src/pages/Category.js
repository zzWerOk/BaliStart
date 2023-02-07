import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {delay} from "../utils/consts";
import {getAll} from "../http/topicsAPI";
import SpinnerSm from "../components/SpinnerSM";
import FeedTopic from "../components/mainpage/feed/Feed_topic";
import FeedTopBar from "../components/mainpage/FeedTopBar";
import FeedAddNewPostBtn from "../components/mainpage/FeedAddNewPostBtn";
import FeedItemsList from "../components/mainpage/FeedItemsList";

const Category = () => {
    let {id} = useParams();

    const [loading, setLoading] = useState(true)
    const [topicsList, setTopicsList] = useState([])

    useEffect(() => {
        setLoading(true)

        delay(0).then(() => {

            getAll(id).then(data => {

                setTopicsList(data.rows)

            }).finally(() => {
                setLoading(false)
            })

        })

    }, [])

    if (loading) {
        return <SpinnerSm/>
    } else {

        return (<div>

            {

                topicsList.length === 0 ? <span>
                            Нет записей
                        </span> :

                    <div style={{marginTop: '20px'}}>
                        <FeedTopBar
                        />
                        <FeedAddNewPostBtn/>
                        <ul
                            className="list-group list-group-flush"
                            style={{padding: '0 40px'}}
                        >
                            {topicsList.map(function (item, index) {
                                return <FeedTopic item={item} key={index}/>
                            })}
                        </ul>
                    </div>


            }
        </div>);
    }
};

export default Category;