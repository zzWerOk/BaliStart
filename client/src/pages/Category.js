import React from 'react';
import {useParams} from "react-router-dom";
import TopicsPage from "./TopicsPage";

const Category = () => {
    let {id} = useParams();

        return (<div>
            <TopicsPage id={id}/>
        </div>);
};

export default Category;