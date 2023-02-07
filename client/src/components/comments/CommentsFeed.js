import React, {useEffect, useState} from 'react';

import './AddNewCommentComponent.css'
import CommentField from "./CommentField";
import {delay} from "../../utils/consts";
import {getAllByTopicId} from "../../http/topicCommentsAPI";

const comments = [
    {
        userName: 'Lisa D.',
        date: '11 min ago',
        text: 'consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.',
        replies: [
            {
                userName: 'Lucy Moon',
                date: '2 min ago',
                text: 'Duis autem vel eum iriure dolor in hendrerit in vulputate ?',
                replies: [
                    {
                        userName: 'Bobby Marz',
                        date: '7 min ago',
                        text: 'Sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.',
                        replies: [
                            {
                                userName: 'Bobby Marz',
                                date: '7 min ago',
                                text: 'Sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.',
                                replies: [
                                    {
                                        userName: 'Bobby Marz',
                                        date: '7 min ago',
                                        text: 'Sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.'
                                    },
                                ]
                            },
                            {
                                userName: 'Bobby Marz',
                                date: '7 min ago',
                                text: 'Sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.'
                            },
                        ]
                    },
                ]
            },
            {
                userName: 'Bobby Marz',
                date: '7 min ago',
                text: 'Sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.',
            },
        ]
    },
    {userName: 'John Doe', date: '11 min ago', text: 'Lorem ipsum dolor sit amet.'},
    {userName: 'Maria Leanz', date: '2 min ago', text: 'Duis autem vel eum iriure dolor in hendrerit in vulputate?'},
]
const CommentsFeed = (props) => {

    const {topicId} = props

    const [loading, setLoading] = useState(true)


    useEffect(() => {
        setLoading(true)

        delay(0).then(() => {

            getAllByTopicId(topicId).then(data => {

                console.log(data)

            }).finally(() => {
                setLoading(false)
            })

        })

    }, [])
    const getCommentComponent = (item, index) => {
        let repliesArr = []
        if (item.hasOwnProperty('replies')) {
            item.replies.map(function (replItem, replIndex) {
                repliesArr.push(getCommentComponent(replItem, replIndex))
            })
        }
        return <CommentField
            replies={repliesArr}
            key={index}
            comment={item}
        />
    }
    if (loading) {

    } else {

        return (
            <div className="panel">
                <div className="panel-body">

                    {
                        comments.map(function (item, index) {
                            return getCommentComponent(item, index)
                        })
                    }

                </div>
            </div>
        );
    }
};

export default CommentsFeed;