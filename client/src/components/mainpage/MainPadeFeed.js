import React from 'react';
import FeedTopBar from "./FeedTopBar";
import FeedAddNewPostBtn from "./FeedAddNewPostBtn";
import FeedItemsList from "./FeedItemsList";

const MainPadeFeed = () => {
    return (
        <div style={{marginTop: '20px'}}>
            <FeedTopBar/>
            <FeedAddNewPostBtn/>
            <FeedItemsList/>
        </div>
    );
};

export default MainPadeFeed;