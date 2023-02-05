import React from 'react';
import {Form} from "react-bootstrap";

const FeedTopBar = () => {
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
                <a
                    href=""
                    style={{
                        padding: '10px 10px',
                        verticalAlign: 'middle',
                        color: 'white'
                    }}
                >Categories</a>
                <a
                    href=""
                    style={{
                        padding: '10px 10px',
                        verticalAlign: 'middle',
                        color: 'white'
                    }}
                >All posts</a>
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