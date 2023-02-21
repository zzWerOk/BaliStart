import React from 'react';

const ElementListLi = (props) => {
    const {item} = props
    return (
        <li className="list-group-item col-11"
        style={{marginTop: '0px', marginBottom: '0',}}
        >
            {item}
        </li>
    );
};

export default ElementListLi;