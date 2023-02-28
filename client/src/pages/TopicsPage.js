import React, {useEffect, useState} from 'react';
import {sortTopics} from "../utils/consts";
import {getAll} from "../http/topicsAPI";
import SpinnerSm from "../components/SpinnerSM";
import FeedTopBar from "../components/mainpage/FeedTopBar";
import FeedTopic from "../components/mainpage/feed/Feed_topic";

const TopicsPage = (props) => {
    const {id} = props

    const [loading, setLoading] = useState(true)
    const [topicsList, setTopicsList] = useState([])

    const [categoryId, setCategoryId] = useState(-1)
    const [selectedSortCode, setSelectedSortCode] = useState('')
    const [isLoadingSorted, setIsLoadingSorted] = useState(true)
    const [sortCode, setSortCode] = useState('alpha')
    const [searchKey, setSearchKey] = useState('')

    useEffect(() => {
        setLoading(true)

        setCategoryId(id)

        const sortCode = localStorage.getItem("sort_code_Topics") || 'alpha'
        setSelectedSortCode(sortCode)
        setSortCode(sortCode)

        getTopicsData(id, sortCode, searchKey)

    }, [])

    const getTopicsData = (categoryId, selectedSortCode, searchKey) => {
        setIsLoadingSorted(true)

        getAll(categoryId, searchKey, selectedSortCode).then(data => {

            if (data.hasOwnProperty('count')) {
                if (data.hasOwnProperty('rows')) {

                    setTopicsList(JSON.parse(JSON.stringify(data.rows)))

                }
            }
        }).finally(() => {
            setIsLoadingSorted(false)
            setLoading(false)
        })
    }

    const setSortHandler = (value) => {
        setSortCode(value)
        localStorage.setItem("sort_code_Topics", value)
        getTopicsData(categoryId, value, searchKey)
    }

    const setSearchHandler = (value) => {
        setSearchKey(value)
        getTopicsData(categoryId, sortCode, value)
    }


    if (loading) {
        return <SpinnerSm/>
    } else {

        return (<div>
                <div style={{marginTop: '20px'}}>

                    <FeedTopBar
                        isSearch={true}
                        isBackBtn={!!id}
                        backBtnTitle={'Back'}

                        setSearchHandler={setSearchHandler}
                        setSort={setSortHandler}
                        isLoading={isLoadingSorted}
                        selectedSortCode={selectedSortCode}
                        sortCodes={sortTopics}

                    />
                    {/*<FeedAddNewPostBtn/>*/}

                    {
                        topicsList.length === 0
                            ?
                            <div>
                                <span>Нет записей</span>
                            </div>
                            :
                            <div
                                style={{height: 'calc(100vh - 129px', overflowX: 'hidden', overflowY: 'auto',}}
                            >
                                <ul
                                    className="list-group list-group-flush"
                                >

                                    {
                                        !isLoadingSorted
                                            ?
                                            topicsList.map(function (item, index) {
                                                return <FeedTopic item={item} key={index}/>
                                            })
                                            :
                                            null
                                    }
                                </ul>
                            </div>
                    }

                </div>
            </div>
        );
    }
};

export default TopicsPage;