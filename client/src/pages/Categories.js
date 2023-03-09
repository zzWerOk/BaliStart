import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import {delay, sortCategories} from "../utils/consts";
import {getAllCategories} from "../http/topicsCategoryAPI";
import SpinnerSm from "../components/SpinnerSM";
import MainPageFeed from "../components/mainpage/MainPageFeed";

const Categories = () => {
    const {topicsCategoryStore, presetPageTitle} = useContext(Context)

    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadingSorted, setLoadingSorted] = useState(true)
    const [sortCode, setSortCode] = useState('alpha')
    const [searchKey, setSearchKey] = useState('')

    const [pageTitle, setPageTitle] = useState('')

    useEffect(() => {
        if(!presetPageTitle) {
            document.title = pageTitle;
        }else{
            document.title = presetPageTitle;
        }
    }, [pageTitle]);

    useEffect(() => {

        setPageTitle('Categories')

        setLoading(true)

        const sortCode = localStorage.getItem("sort_code_Categories") || 'alpha'

        setSortCode(sortCode)

        delay(0).then(() => {

            getCategoriesData(sortCode, searchKey)

        })
    }, [])

    const getCategoriesData = (sortCode, search) => {
        setLoadingSorted(true)
        getAllCategories(sortCode, search).then(data => {
            /**
             Сохраняем список
             **/
            topicsCategoryStore.saveCategoriesList(JSON.parse(JSON.stringify(data.rows)))
            setItems(JSON.parse(JSON.stringify(data.rows)))
        }).catch(() => {
            topicsCategoryStore.saveCategoriesList([])
        }).finally(() => {
            setLoading(false)
            setLoadingSorted(false)
        })

    }

    const setSortHandler = (value) => {
        setSortCode(value)
        localStorage.setItem("sort_code_Categories", value)
        getCategoriesData(value, searchKey)
    }

    const setSearchHandler = (value) => {
        setSearchKey(value)
        getCategoriesData(sortCode, value)
    }


    if (loading) {
        return <SpinnerSm/>
    } else {

        return (
            <div>
                <MainPageFeed items={items}
                              setSortHandler={setSortHandler}
                              isLoadingSorted={loadingSorted}
                              selectedSortCode={sortCode}
                              sortCodes={sortCategories}
                              setSearchHandler={setSearchHandler}
                />

            </div>
        );
    }
};

export default Categories;