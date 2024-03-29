import React, {useContext, useEffect, useState} from 'react';
import {ListGroup} from "react-bootstrap";
import TopicsCategoryItem_new from "./TopicsCategoryItem_new";
import TopicsCategoryItem_ready from "./TopicsCategoryItem_ready";
import {delay} from "../../utils/consts";
import {getTableUpdateByName} from "../../http/tableUpdatesAPI";
import {changeAPI, deleteAPI, getAll} from "../../http/topicsCategoryAPI";
import {Context} from "../../index";
import SpinnerSm from "../SpinnerSM";
import {observer} from "mobx-react-lite";
import {createAPI} from "../../http/topicsCategoryAPI";

const TopicsCategoryPage = observer(() => {

    const {topicsCategoryStore} = useContext(Context)
    const [loading, setLoading] = useState(true)

    const [loadingAddItem, setLoadingAddItem] = useState(false)
    const [new_items_arr, setNew_items_arr] = useState([])
    const [items_arr, setItems_arr] = useState([])

    const addItemTrigger = React.useRef(null)

    useEffect(() => {
        setLoading(true)

        delay(0).then(() => {

            getTableUpdateByName('TopicsCategory').then(tuData => {
                    getAll().then(data => {
                        /**
                         Сохраняем список
                         **/
                        topicsCategoryStore.saveCategoriesList(data.rows)
                        setItems_arr(data.rows)
                    }).finally(() => {

                    })
                    /**
                     Сохраняем дату последнего изменения таблицы
                     **/
                    topicsCategoryStore.saveLastDateTableTopicsCategory(tuData.date)

            }).finally(() => {
                setLoading(false)
            })

        })
    }, [])

    const addNewNewItem = (newItemData) => {

        if (newItemData.hasOwnProperty('name')) {


            if (!topicsCategoryStore.checkIfNewItemExists(newItemData.name)) {

                setLoadingAddItem(true)

                /**
                 Изменение роли пользователя API
                 **/
                delay(0).then(() => {
                    createAPI(newItemData.name, newItemData.description).then(data => {
                        if (data.hasOwnProperty('status')) {

                            if (data.status === 'ok') {
                                if (topicsCategoryStore.addNewItem(newItemData.name, newItemData.description, false, data.id)) {
                                    setNew_items_arr(topicsCategoryStore.newItemsArr)
                                    topicsCategoryStore.saveCategoriesList()
                                    addItemTrigger.added()

                                }
                            }
                        }
                    }).finally(() => {
                        setLoadingAddItem(false)
                    })
                })


            } else {
                console.log('Объект уже добавлен')
            }
        }
    }

    const onDeleteItemTrigger = (id) => {
        let itemPosition = -1
        let currItems_arr = items_arr.slice()
        for(let i = 0;i < currItems_arr.length;i++){
            if(currItems_arr[i].id === id){
                itemPosition = i
                break
            }
        }
        if(itemPosition > -1) {
            currItems_arr.splice(itemPosition, 1)
            setItems_arr(currItems_arr)
        }

        currItems_arr = new_items_arr.slice()
        for(let i = 0;i < currItems_arr.length;i++){
            if(currItems_arr[i].id === id){
                itemPosition = i
                break
            }
        }
        if(itemPosition > -1) {
            currItems_arr.splice(itemPosition, 1)
            setNew_items_arr(currItems_arr)
        }

    }

    if (loading) {
        return <SpinnerSm/>
    } else {
        return (<div>
            <ListGroup style={{marginBottom: '10px'}}>
                <TopicsCategoryItem_new
                    addNewItemFunc={addNewNewItem}
                    loadingAddItem={loadingAddItem}
                    addItemTrigger={addItemTrigger}
                    // name={topicsCategoryStore.name}
                    // description={topicsCategoryStore.description}
                />
            </ListGroup>
            <div style={{marginBottom: '10px'}}>
                {/*{topicsCategoryStore.newItemsArr.map(item => <TopicsCategoryItem_ready*/}
                {new_items_arr.map(item => <TopicsCategoryItem_ready
                    key={item.id + 'new'}
                    name={item.category_name}
                    description={item.description}
                    is_for_tour={item.is_for_tour}
                    id={item.id}
                    onDeleteItemTrigger={onDeleteItemTrigger}
                    changeAPI={changeAPI}
                    deleteAPI={deleteAPI}
                    categoriesStore={topicsCategoryStore}
                />)}
            </div>
            <div>
                {/*{topicsCategoryStore.itemsArr.map(item => <TopicsCategoryItem_ready*/}
                {items_arr.map(item => <TopicsCategoryItem_ready
                    key={item.id}
                    name={item.category_name}
                    description={item.description}
                    is_for_tour={item.is_for_tour}
                    id={item.id}
                    onDeleteItemTrigger={onDeleteItemTrigger}
                    changeAPI={changeAPI}
                    deleteAPI={deleteAPI}
                    categoriesStore={topicsCategoryStore}

                />)}
            </div>

        </div>);
    }
});

export default TopicsCategoryPage;