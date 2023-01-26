import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {Button, ListGroup} from "react-bootstrap";
import {delay} from "../../utils/consts";
import {getTableUpdateByName} from "../../http/tableUpdatesAPI";
import {Context} from "../../index";
import SpinnerSm from "../SpinnerSM";
import {observer} from "mobx-react-lite";
import {getAll, createAPI} from "../../http/toursCategoryAPI";
import TopicsCategoryItem_new from "../topicsCategory/TopicsCategoryItem_new";
import TopicsCategoryItem_ready from "../topicsCategory/TopicsCategoryItem_ready";
import {changeAPI, deleteAPI} from "../../http/toursCategoryAPI";

const ToursCategoryPage = observer(() => {

    const {toursCategoryStore} = useContext(Context)
    const [loading, setLoading] = useState(true)

    const [loadingAddItem, setLoadingAddItem] = useState(false)
    const [new_items_arr, setNew_items_arr] = useState([])
    const [items_arr, setItems_arr] = useState([])

    const addItemTrigger = React.useRef(null)

    useEffect(() => {
        setLoading(true)

        delay(0).then(r => {

            getTableUpdateByName('ToursCategory').then(tuData => {
                const lastDateTable = toursCategoryStore.getSavedLastDateTableToursCategory()

                if (tuData.date.toString() !== lastDateTable.toString() || toursCategoryStore.getSavedToursCategoryList().length === 0) {
                    getAll().then(data => {
                        /**
                         Сохраняем список
                         **/
                        // console.log(data)
                        toursCategoryStore.saveCategoriesList(data.rows)
                        // console.log('Даты не равны, получаем данные с сервера')
                        setItems_arr(data.rows)
                    }).finally(() => {
                        // setItems_arr(toursCategoryStore.itemsArr)
                    })
                    /**
                     Сохраняем дату последнего изменения таблицы
                     **/
                    toursCategoryStore.saveLastDateTableToursCategory(tuData.date)
                } else {
                    setItems_arr(toursCategoryStore.getSavedToursCategoryList())
                    // console.log('Даты равны, получаем данные с LocalStorage')
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
                    createAPI(newItemData.name, newItemData.description).then(data => {
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
                    // name={toursCategoryStore.name}
                    // description={toursCategoryStore.description}
                />
            </ListGroup>
            <div style={{marginBottom: '10px'}}>
                {/*{toursCategoryStore.newItemsArr.map(item => <TopicsCategoryItem_ready*/}
                {new_items_arr.map(item => <TopicsCategoryItem_ready
                    key={item.id + 'new'}
                    name={item.category_name}
                    description={item.description}
                    id={item.id}
                    onDeleteItemTrigger={onDeleteItemTrigger}
                    changeAPI={changeAPI}
                    deleteAPI={deleteAPI}
                    categoriesStore={toursCategoryStore}

                />)}
            </div>
            <div>
                {/*{toursCategoryStore.itemsArr.map(item => <TopicsCategoryItem_ready*/}
                {items_arr.map(item => <TopicsCategoryItem_ready
                    key={item.id}
                    name={item.category_name}
                    description={item.description}
                    id={item.id}
                    onDeleteItemTrigger={onDeleteItemTrigger}
                    changeAPI={changeAPI}
                    deleteAPI={deleteAPI}
                    categoriesStore={toursCategoryStore}

                />)}
            </div>

        </div>);
    }
});

export default ToursCategoryPage;