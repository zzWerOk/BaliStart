import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {Button, ListGroup} from "react-bootstrap";
import {delay} from "../../utils/consts";
import {getTableUpdateByName} from "../../http/tableUpdatesAPI";
import {Context} from "../../index";
import SpinnerSm from "../SpinnerSM";
import {observer} from "mobx-react-lite";
import {getAll_Cat, createAPI_Cat, deleteAPI_Cat, changeAPI_Cat} from "../../http/toursCategoryAPI";
import TopicsCategoryItem_new from "../topicsCategory/TopicsCategoryItem_new";
import TopicsCategoryItem_ready from "../topicsCategory/TopicsCategoryItem_ready";
import {changeAPI_Type, createAPI_Type, deleteAPI_Type, getAll_Type} from "../../http/toursTypeAPI";

const ToursCategoryPage = observer((props) => {
    const {tagType} = props

    const {toursCategoryStore, toursTypeStore} = useContext(Context)
    const [loading, setLoading] = useState(true)

    const [loadingAddItem, setLoadingAddItem] = useState(false)
    const [new_items_arr, setNew_items_arr] = useState([])
    const [items_arr, setItems_arr] = useState([])

    const addItemTrigger = React.useRef(null)

    useEffect(() => {
        setLoading(true)

        delay(0).then(r => {

            getTableUpdateByName(tagType === 'categories' ? 'ToursCategory' : 'ToursType').then(tuData => {
                let lastDateTable

                if(tagType === 'categories') {
                    lastDateTable = toursCategoryStore.getSavedLastDateTableToursCategory()
                }else {
                    lastDateTable = toursTypeStore.getSavedLastDateTableToursCategory()
                }

                let currTagList = []
                if(tagType === 'categories'){
                    currTagList = toursCategoryStore.getSavedCategoriesList()
                }else{
                    currTagList = toursTypeStore.getSavedCategoriesList()
                }

                if (tuData.date.toString() !== lastDateTable.toString() || currTagList.length === 0) {

                    if(tagType === 'categories'){
                        getAll_Cat().then(data => {
                            /**
                             Сохраняем список
                             **/
                            toursCategoryStore.saveCategoriesList(data.rows)
                            setItems_arr(data.rows)
                        }).finally(() => {
                            /**
                             Сохраняем дату последнего изменения таблицы
                             **/
                            toursCategoryStore.saveLastDateTableToursCategory(tuData.date)
                        })
                    }else{
                        getAll_Type().then(data => {
                            /**
                             Сохраняем список
                             **/
                            toursTypeStore.saveCategoriesList(data.rows)
                            setItems_arr(data.rows)
                        }).finally(() => {
                            /**
                             Сохраняем дату последнего изменения таблицы
                             **/
                            toursTypeStore.saveLastDateTableToursCategory(tuData.date)
                        })
                    }

                } else {
                    if(tagType === 'categories'){
                        setItems_arr(toursCategoryStore.getSavedCategoriesList())
                    }else{
                        setItems_arr(toursTypeStore.getSavedCategoriesList())
                    }
                }

            }).finally(() => {
                setLoading(false)
            })

        })
    }, [])

    const addNewNewItem = (newItemData) => {

        if (newItemData.hasOwnProperty('name')) {


            if (!toursCategoryStore.checkIfNewItemExists(newItemData.name)) {

                setLoadingAddItem(true)

                delay(0).then(r => {
                    if(tagType === 'categories'){
                        createAPI_Cat(newItemData.name, newItemData.description).then(data => {
                            if (data.hasOwnProperty('status')) {

                                if (data.status === 'ok') {
                                    if (toursCategoryStore.addNewItem(newItemData.name, newItemData.description, false, data.id)) {
                                        setNew_items_arr(toursCategoryStore.newItemsArr)
                                        toursCategoryStore.saveCategoriesList()
                                        addItemTrigger.added()

                                    }
                                }
                            }
                        }).finally(() => {
                            setLoadingAddItem(false)
                        })
                    }else{
                        createAPI_Type(newItemData.name, newItemData.description).then(data => {
                            if (data.hasOwnProperty('status')) {

                                if (data.status === 'ok') {
                                    if (toursTypeStore.addNewItem(newItemData.name, newItemData.description, false, data.id)) {
                                        setNew_items_arr(toursTypeStore.newItemsArr)
                                        toursTypeStore.saveCategoriesList()
                                        addItemTrigger.added()
                                    }
                                }
                            }
                        }).finally(() => {
                            setLoadingAddItem(false)
                        })
                    }

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
                />
            </ListGroup>
            <div style={{marginBottom: '10px'}}>
                {new_items_arr.map(item => <TopicsCategoryItem_ready
                    key={item.id + 'new'}
                    name={item.category_name}
                    description={item.description}
                    id={item.id}
                    onDeleteItemTrigger={onDeleteItemTrigger}
                    changeAPI={tagType === 'categories' ? changeAPI_Cat : changeAPI_Type}
                    deleteAPI={tagType === 'categories' ? deleteAPI_Cat : deleteAPI_Type}
                    categoriesStore={tagType === 'categories' ? toursCategoryStore : toursTypeStore}
                />)}
            </div>
            <div>
                {items_arr.map(item => <TopicsCategoryItem_ready
                    key={item.id}
                    name={item.category_name}
                    description={item.description}
                    id={item.id}
                    onDeleteItemTrigger={onDeleteItemTrigger}
                    changeAPI={tagType === 'categories' ? changeAPI_Cat : changeAPI_Type}
                    deleteAPI={tagType === 'categories' ? deleteAPI_Cat : deleteAPI_Type}
                    categoriesStore={tagType === 'categories' ? toursCategoryStore : toursTypeStore}
                />)}
            </div>
        </div>);
    }
});

export default ToursCategoryPage;