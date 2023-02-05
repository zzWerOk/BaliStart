import React from 'react';
import {Button} from "react-bootstrap";

const FeedAddNewPostBtn = () => {
    return (
        <div
            className={'d-flex'}
            style={{justifyContent: 'flex-end', padding: '10px'}}
        >
            <Button
                variant="dark"
            >
                Add new post
            </Button>
        </div>
    );
};

export default FeedAddNewPostBtn;