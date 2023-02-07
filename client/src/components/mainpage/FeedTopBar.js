import React from 'react';
import {Form} from "react-bootstrap";
import classes from './FeedTopBar.module.css'
const FeedTopBar = (props) => {

    const {itemsTypeChangeHandler, itemsType} = props

    return (
        <div
            className={'d-flex'}
            style={{
                padding: '8px 10px',
                backgroundColor: '#332d2d',
                color: 'white'
            }}
        >
            <div
                className="me-auto my-5 my-lg-0 d-flex"
                style={{
                    maxHeight: '100px',
                    boxShadow: '0!important',
                    verticalAlign: 'middle',
            }}
            >
                {
                    itemsType
                        ?
                        <span
                            className={`${classes.feed_top_bar_a} ${itemsType === 'categories' ? classes.selected_a : ''} `}
                            onClick={() => {
                                itemsTypeChangeHandler('categories')
                            }}
                        >Categories</span>
                        :
                        null
                }
                {
                    itemsType
                        ?
                        <span
                            className={`${classes.feed_top_bar_a} ${itemsType === 'lastPosts' ? classes.selected_a : ''} `}
                            onClick={() => {itemsTypeChangeHandler('lastPosts')}}
                        >Last posts</span>
                        :
                        null
                }
            </div>
            <Form className="d-flex">
                <Form.Control
                    type="search"
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search"
                />
                {/*<Button*/}
                {/*    variant="outline-secondary"*/}
                {/*>Search</Button>*/}
            </Form>
        </div>
    );
};

export default FeedTopBar;