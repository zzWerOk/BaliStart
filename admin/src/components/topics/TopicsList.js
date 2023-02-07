import React, {useContext, useEffect, useState} from 'react';
import {Button, Dropdown, Row, ToggleButton} from "react-bootstrap";
import {Context} from "../../index";
import SpinnerSM from "../SpinnerSM";
import {delay} from "../../utils/consts";

const sortItems = [
    {name: `By user (a-b)`, code: 'user'},
    {name: 'By user (b-a)', code: 'reuser'},
    {name: 'By date (1-2)', code: 'date'},
    {name: 'By date (2-1)', code: 'redate'},
    {name: 'By ID (1-2)', code: 'id'},
    {name: 'By ID (2-1)', code: 'reid'},
]

const TopicsList = (props) => {
    // const {topicsStore} = useContext(Context)
    const {user} = useContext(Context)

    const {redrawPage, getAllData, categoriesStore, topicsStore, ItemsListsCell} = props

    const [itemsList, setItemsList] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedCode, setSelectedCode] = useState('')
    const [selectedName, setSelectedName] = useState('')

    const [selectedTagName, setSelectedTagName] = useState('')
    const [selectedTagId, setSelectedTagId] = useState('')

    const [topicCategoriesItems, setTopicCategoriesItems] = useState([])
    const [topicCategoriesItems_load, setTopicCategoriesItems_load] = useState(true)

    useEffect(() =>
    {

        delay(0).then(r => {
            let topicsArr = topicsStore.getTopicsList
            // let topicsArr = topicsStore.getSavedTopics_List
            if (!topicsArr) {
                topicsArr = []
            }
            setItemsList(topicsArr)

            setTopicCategoriesItems([...categoriesStore.getSavedCategoriesList(),
                {
                    "id": -99,
                    "category_name": "Divider"
                },
                {
                    "id": -1,
                    "category_name": "Cancel"
                },

            ])

            const filtered = categoriesStore.getSavedCategoriesList().filter(function (value, index, arr) {
                return ("" + value.id) === ("" + topicsStore.tag_search)
            })

            setSelectedTagName(filtered.length > 0 ? filtered[0].category_name : '')

            setSelectedCode(topicsStore.sort_code)
            setSelectedName(sortItems.filter(function (value, index, arr) {
                return value.code === topicsStore.sort_code;
            })[0].name)

            setLoading(false)
        })
    }, [])

    const createNewTopic = () => {
        topicsStore.createAndAddNewTopicJson(user.currUserId)
        setItemsList(topicsStore.getTopicsList)
    }

    const deleteTopic = (id) => {
        topicsStore.deleteTopicById(id)
        setItemsList(topicsStore.getTopicsList)
    }

    const onItemEditHandler = (item) => {
        let newArr = itemsList
        for (let i = 0; i < newArr.length; i++) {
            if (newArr[i].id === item.id) {
                if (item.hasOwnProperty('newId')) {
                    item.id = item.newId
                    delete item.newId
                }
                newArr[i] = item
            }
        }


        setItemsList(newArr)
        topicsStore.setListFromArr(newArr)

        redrawPage()
    }

    const sortHandler = (item) => {
        topicsStore.sort_code = item.code

        setSelectedCode(item.code)
        setSelectedName(item.name)

        getAllData()
    }

    const addNewTagHandler = (value) => {
        let newCategory = null

        for (let i = 0; i < topicCategoriesItems.length; i++) {
            if (topicCategoriesItems[i].id === value) {
                newCategory = topicCategoriesItems[i]
            }
        }

        setSelectedTagId(newCategory.id)

        newCategory.id === -1
            ?
            setSelectedTagName('')
            :
            setSelectedTagName(newCategory.category_name)

        newCategory.id === -1
            ?
            topicsStore.tag_search = ''
            :
            topicsStore.tag_search = newCategory.id

        getAllData()
    }

    if (loading) {
        return <SpinnerSM/>
    } else {

        return (
            <div>
                <nav className="navbar navbar-dark bg-dark" style={{
                    marginBottom: '10px',
                    marginTop: '10px',
                }}>

                    <div style={{display: 'flex'}}>
                        <Dropdown>
                            <Dropdown.Toggle
                                variant="outline-secondary"
                                size="sm"
                                id="dropdown-tag"
                                style={{
                                    color: 'white',
                                    marginLeft: '20px'
                                }}
                            >
                                {selectedTagName === '' ? "Select category tag" : selectedTagName}

                            </Dropdown.Toggle>

                            <Dropdown.Menu>

                                {topicCategoriesItems.map(function (item, index) {
                                    return item.id === -99
                                        ?
                                        <Dropdown.Divider
                                            // key={item.id}
                                            key={index}
                                        />
                                        :
                                        <Dropdown.Item
                                            // key={item.id}
                                            key={index}
                                            onClick={() => {
                                                addNewTagHandler(item.id)
                                            }}
                                        >
                                            {item.category_name}
                                        </Dropdown.Item>
                                }
                                )}
                            </Dropdown.Menu>
                        </Dropdown>

                    </div>

                    <div style={{
                        minHeight: '30px',
                        justifyContent: 'space-between',
                        flexDirection: 'column',
                        display: 'flex',
                        marginRight: '20px'
                    }}>

                        <div style={{
                            justifyContent: 'flex-end',
                            display: 'flex',
                        }}>

                            <span style={{
                                color: 'white',
                                marginRight: '10px',
                                marginTop: '3px',

                            }}>Sort</span>

                            <Dropdown>
                                <Dropdown.Toggle
                                    variant="outline-secondary"
                                    size="sm"
                                    id="dropdown-tag"
                                    style={{color: 'white'}}
                                >
                                    {selectedCode ? selectedName : 'Sort topics'}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    {sortItems.map(item => {
                                        return <Dropdown.Item
                                            key={item.code}
                                            onClick={() => {
                                                sortHandler(item)
                                            }}
                                            active={!!selectedCode === item.code}
                                        >{item.name}</Dropdown.Item>
                                    })}

                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                </nav>

                {itemsList.map(item =>
                    // <TopicListsCell
                    <ItemsListsCell
                        key={item.id}
                        item={item}
                        onItemEditHandler={onItemEditHandler}
                        deleteTopic={deleteTopic}
                        categoriesStore={categoriesStore}
                    />
                )}

                <Row>
                    <Button
                        className={'btn btn-primary btn-lg w-75 btn-block'}
                        onClick={createNewTopic}
                    >New topic</Button>
                </Row>
            </div>
        )
    }
}

export default TopicsList;