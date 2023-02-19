import React, {useEffect, useState} from 'react';
import './TopicDetailLineComponent.css'
const TopicDetailLineComponent = (props) => {
    const {element} = props

    const [loading, setLoading] = useState(true)
    const [elementStyle, setElementStyle] = useState('')

    useEffect(() => {
        setLoading(true)

        if (element.hasOwnProperty('style')) {
            if (element.style !== '') {
                setElementStyle(element.style)
            }
        }

        setLoading(false)
    }, [])

    if(loading){

    }else {

        return (
            <div>
                <hr className={`${elementStyle}`}/>
            </div>
        );

    }
};

export default TopicDetailLineComponent;