import React, {useEffect, useState} from 'react';
import FeedTopBar from "./FeedTopBar";
import FeedItemsList from "./FeedItemsList";

const MainPageFeed = (props) => {
    const {
        items,
        setSortHandler,
        selectedSortCode,
        isLoadingSorted,
        sortCodes,
        setSearchHandler,
    } = props

    const [itemsType, setItemsType] = useState('categories')
    const [loading, setLoading] = useState(true)

    const itemsTypeChangeHandler = (type) => {
        setItemsType(type)
    }

    // const setSortHandler = (value) => {
    //
    // }

    useEffect(() => {
        setLoading(true)

        setLoading(false)
    }, [])


    if (loading) {

    } else {
        return (
            <div style={{marginTop: '20px'}}>
                <FeedTopBar
                    itemsTypeChangeHandler={itemsTypeChangeHandler}
                    itemsType={itemsType}
                    isSearch={true}
                    setSearchHandler={setSearchHandler}
                    setSort={setSortHandler}
                    isLoading={isLoadingSorted}
                    selectedSortCode={selectedSortCode}
                    sortCodes={sortCodes}
                />
                <div
                    style={{height: 'calc(100vh - 129px', overflowX: 'hidden', overflowY: 'auto',}}
                >

                    {
                        !isLoadingSorted
                            ?
                            <FeedItemsList
                                items={items}
                                itemsType={itemsType}
                            />
                            :
                            null
                    }

                </div>

            </div>
        );
    }
};

export default MainPageFeed;