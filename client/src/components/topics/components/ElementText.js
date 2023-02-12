import React from 'react';

const NameElement = (props) => {
    const {text} = props
    return (
        <p
            style={{marginBottom: '0'}}
            className="">{text}</p>
    );
};

export default NameElement;