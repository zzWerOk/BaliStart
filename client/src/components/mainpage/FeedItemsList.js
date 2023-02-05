import React from 'react';
import FeedCategory from "./feed/Feed_category";
import FeedTopic from "./feed/Feed_topic";

const feedItems = [
    {
        name: 'General Discussion',
        description: 'Describe your forum category. Engage your audience and entice them to continue reading.',
        comments: 5,
        userName: 'zWer',
        date: 'today',
    },
    {
        name: 'Europe',
        description: 'Describe your forum category. Engage your audience and entice them to continue reading.',
        comments: 0,
        userName: 'Admin',
        date: 'today',
    },
    {
        name: 'Americas',
        description: 'Describe your forum category. Engage your audience and entice them to continue reading.',
        comments: 0,
        userName: 'Admin',
        date: '12.02.2023 14:53',
    },
    {
        name: 'Asia',
        description: 'Describe your forum category. Engage your audience and entice them to continue reading.',
        comments: 10,
        userName: 'User',
        date: '12.02.2023 10:15',
    },
    {
        name: 'Africa',
        description: 'Describe your forum category. Engage your audience and entice them to continue reading.',
        comments: 2,
        userName: 'Admin',
        date: '11.02.2023 23:01',
    },
    {
        name: 'Australia',
        description: 'Describe your forum category. Engage your audience and entice them to continue reading.',
        comments: 0,
        userName: 'User',
        date: '11.02.2023 15:33',
    },
]
const FeedItemsList = () => {
    return (
        <div>

            {/*<div className="list-group">*/}
            {/*    {feedItems.map(function (item, index) {*/}
            {/*        return <FeedCategory item={item} key={index}/>*/}
            {/*    })}*/}
            {/*</div>*/}

            <ul
                className="list-group list-group-flush"
                style={{padding: '0 40px'}}
            >
                {feedItems.map(function (item, index) {
                    return <FeedTopic item={item} key={index}/>
                })}
            </ul>

        </div>
    );
}
    ;

    export default FeedItemsList;