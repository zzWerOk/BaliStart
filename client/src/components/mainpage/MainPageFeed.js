import React, {useState} from 'react';
import FeedTopBar from "./FeedTopBar";
import FeedItemsList from "./FeedItemsList";

const MainPageFeed = () => {

    const [itemsType, setItemsType] = useState('categories')

    const itemsTypeChangeHandler = (type) => {
        setItemsType(type)
    }

    return (
        <div style={{marginTop: '20px'}}>
            <FeedTopBar
                itemsTypeChangeHandler={itemsTypeChangeHandler}
                itemsType={itemsType}
                isSearch={true}
            />
            <div
                style={{height: 'calc(100vh - 129px', overflowX: 'hidden', overflowY: 'auto',}}
            >

                <FeedItemsList
                    itemsType={itemsType}
                />

            </div>

        </div>
    );
};

export default MainPageFeed;