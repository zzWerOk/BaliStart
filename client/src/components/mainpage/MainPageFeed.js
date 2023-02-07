import React, {useState} from 'react';
import FeedTopBar from "./FeedTopBar";
import FeedAddNewPostBtn from "./FeedAddNewPostBtn";
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
            />
            <FeedAddNewPostBtn/>
            <FeedItemsList
                itemsType={itemsType}
            />
        </div>
    );
};

export default MainPageFeed;