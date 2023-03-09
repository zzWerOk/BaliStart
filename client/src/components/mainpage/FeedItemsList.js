import React, {useEffect, useState} from 'react';
import FeedCategory from "./feed/Feed_category";
import SpinnerSm from "../SpinnerSM";


const FeedItemsList = (props) => {
    const {items} = props

    const [categoriesItemsArr, setCategoriesItemsArr] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        setCategoriesItemsArr(items || [])

        setLoading(false)

    }, [])

    if (loading) {
        return <SpinnerSm/>
    } else {
        return (
            <div>

                {
                    // itemsType === 'categories'
                    //     ?
                    <div className="list-group">
                        {categoriesItemsArr.map(function (item, index) {
                            return <FeedCategory item={item} key={index}/>
                        })}
                    </div>
                    // :
                    // <ul
                    //     className="list-group list-group-flush"
                    //     style={{padding: '0 40px'}}
                    // >
                    //     {feedItems.map(function (item, index) {
                    //         return <FeedTopic item={item} key={index}/>
                    //     })}
                    // </ul>
                }

            </div>
        );
    }
};

export default FeedItemsList;