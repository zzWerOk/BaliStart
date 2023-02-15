import React, {useEffect, useState} from "react";

const TopicLineComponent = (props) => {
    const {item, dataItemEditHandler} = props

    const [textStyle, setTextStyle] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setTextStyle(item.style)
        setLoading(false)
    }, [])

    const handleStyle = (value) => {
        item.style = value
        setTextStyle(value)
        dataItemEditHandler(item)
    }

    if (loading) {
        // return <SpinnerSM/>
    } else {

        return (
            <div>
                <div className={'col-12'}>
                    <select className="form-select"
                        // disabled={!!isSaving}
                            aria-label="Default select example"
                            value={item.style}
                            onChange={e => handleStyle(e.target.value)}
                    >
                        <option disabled>Выбери тип связи</option>
                        <option value="solid">Solid</option>
                        <option value="dashed">Dashed</option>
                        <option value="dotted">Dotted</option>
                        <option value="empty">Empty</option>
                    </select>
                </div>

            </div>

        );
    }
};

export default TopicLineComponent;