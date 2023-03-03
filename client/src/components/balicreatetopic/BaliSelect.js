import React, {useEffect, useState} from 'react';
import './BaliTextArea.css'

const BaliSelect = (props) => {
    const {items = [],
        selectedItemCode,
        onItemSelectHandler,
        labelText} = props

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)

        setLoading(false)
    }, [])

    const handleChange = (event) => {
        event.target.setAttribute('value', event.target.value)
        onItemSelectHandler(event.target.value)
    };

    if (loading) {

    } else {
        return (
            <div>
                <div className="form-group input-material">
                    <select className="form-control"
                            id="selection"
                            onChange={handleChange}
                            required
                            value={selectedItemCode}
                    >
                        {
                            items.map(function (item, index) {
                                return <option
                                    key={item.code + " " + index}
                                    value={item.code}
                                    // selected={selectedItemCode === item.code}
                                >
                                    {
                                        item.name
                                    }
                                </option>
                            })
                        }

                    </select>
                    {
                        labelText
                            ?
                            <label htmlFor="selection">{labelText}</label>
                            :
                            null
                    }
                </div>
            </div>
        );
    }
};

export default BaliSelect;