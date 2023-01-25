import React, {useContext, useEffect, useState} from 'react';
import MapPointsListCell from "./MapPointsListsCell";
import {Button, Dropdown, Row, ToggleButton} from "react-bootstrap";
import {Context} from "../../index";
import SpinnerSM from "../SpinnerSM";
import {delay} from "../../utils/consts";
import {ReactComponent as CloseIco} from "../../img/svg/close.svg";

const sortItems = [
    {name: `By user (a-b)`, code: 'user'},
    {name: 'By user (b-a)', code: 'reuser'},
    {name: 'By date (1-2)', code: 'date'},
    {name: 'By date (2-1)', code: 'redate'},
    {name: 'By ID (1-2)', code: 'id'},
    {name: 'By ID (2-1)', code: 'reid'},
]

const MapPointsList = (props) => {
    const {mapPointsStore} = useContext(Context)
    const {user} = useContext(Context)

    const {redrawPage, getAllData} = props

    const [itemsList, setItemsList] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        delay(0).then(r => {
            let mapPointsArr = mapPointsStore.getMapPointList
            if (!mapPointsArr) {
                mapPointsArr = []
            }

            setItemsList(mapPointsArr)

            setLoading(false)
        })
    }, [])

    const createNewMapPoint = () => {
        mapPointsStore.createAndAddMapPointsJson(user.currUserId)
        setItemsList(mapPointsStore.getMapPointList)
    }

    const deleteMapPoint = (id) => {
        mapPointsStore.deleteMapPointById(id)
        setItemsList(mapPointsStore.getMapPointList)
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
        mapPointsStore.setMapPointsListFromArr(newArr)

        redrawPage()
    }

    // const sortHandler = (item) => {
    //     mapPointsStore.sort_code = item.code
    //
    //     setSelectedCode(item.code)
    //     setSelectedName(item.name)
    //
    //     getAllData()
    // }
    //
    // const addNewTagHandler = (value) => {
    //     let newCategory = null
    //
    //     for (let i = 0; i < topicCategoriesItems.length; i++) {
    //         if (topicCategoriesItems[i].id === value) {
    //             newCategory = topicCategoriesItems[i]
    //         }
    //     }
    //
    //     setSelectedTagId(newCategory.id)
    //
    //     newCategory.id === -1
    //         ?
    //         setSelectedTagName('')
    //         :
    //         setSelectedTagName(newCategory.category_name)
    //
    //     newCategory.id === -1
    //         ?
    //         mapPointsStore.tag_search = ''
    //         :
    //         mapPointsStore.tag_search = newCategory.id
    //
    //     getAllData()
    // }

    if (loading) {
        return <SpinnerSM/>
    } else {

        return (
            <div>
                <nav className="navbar navbar-dark bg-dark" style={{
                    marginBottom: '10px',
                    marginTop: '10px',
                }}>

                </nav>

                {itemsList.map(item =>
                    <MapPointsListCell
                        key={item.id}
                        item={item}
                        onItemEditHandler={onItemEditHandler}
                        deleteMapPoint={deleteMapPoint}
                    />
                )}

                <Row>
                    <Button
                        className={'btn btn-primary btn-lg w-75 btn-block'}
                        onClick={createNewMapPoint}
                    >New topic</Button>
                </Row>
            </div>
        )
    }
}

export default MapPointsList;