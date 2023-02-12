import React from 'react';
import {Form} from "react-bootstrap";
import classes from './FeedTopBar.module.css'
import {useHistory} from "react-router-dom";

const FeedTopBar = (props) => {

    const {
        itemsTypeChangeHandler,
        itemsType,
        isSearch,
        isBackBtn,
        backBtnTitle,
        rightSideBarElements,
    } = props

    let history = useHistory();


    return (
        <div
            className={'d-flex'}
            style={{
                padding: '8px 10px',
                backgroundColor: '#332d2d',
                color: 'white',
                minHeight: '50px',
                maxHeight: '50px',
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
                    isBackBtn
                        ?
                        <a className={`btn btn-link ${classes.back_btn}`}
                           onClick={() => {
                               history.goBack()
                           }}
                            // type="button"
                        >

                            {/*<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"*/}
                            {/*     className="bi bi-arrow-left-short " viewBox="0 0 16 16"*/}
                            {/*     style={{height: '100%'}}*/}
                            {/*>*/}
                            {/*    <path*/}
                            {/*          d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z"/>*/}
                            {/*</svg>*/}

                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 className="bi bi-chevron-left" viewBox="0 0 16 16"
                                 style={{height: '100%', marginLeft: '-5px'}}
                            >
                                <path
                                    d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                            </svg>
                            <small
                                style={{height: '100%'}}
                            >
                                {backBtnTitle}
                            </small>

                        </a>
                        :
                        null
                }

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
                            onClick={() => {
                                itemsTypeChangeHandler('lastPosts')
                            }}
                        >Last posts</span>
                        :
                        null
                }
            </div>
            {
                isSearch
                    ?
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
                    :
                    null
            }
            {
                rightSideBarElements
                    ?
                    rightSideBarElements
                    :
                    null
            }
        </div>
    );
};

export default FeedTopBar;