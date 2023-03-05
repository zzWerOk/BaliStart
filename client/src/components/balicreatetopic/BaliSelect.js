import React, {useEffect, useRef} from 'react';
import './BaliTextArea.css'

const BaliSelect = (props) => {
    const {
        items = [],
        selectedItemCode,
        onItemSelectHandler,
        labelText,
        isError,
    } = props

    const refSelect = useRef(null);

    useEffect(() => {

        if (refSelect !== null && refSelect !== undefined && selectedItemCode) {
            if (refSelect.current !== null && refSelect.current !== undefined) {
                refSelect.current.setAttribute('value', selectedItemCode);
            }
        }

    }, [])

    const handleChange = (event) => {
        event.target.setAttribute('value', event.target.value)
        onItemSelectHandler(event.target.value)
    };

    return (
        <div>
            <div className="form-group input-material">
                <select className={`form-control ${isError ? 'invalid' : ''}`}
                    id="selection"
                        onChange={handleChange}
                        required
                        value={selectedItemCode}
                        ref={refSelect}
                >
                    {
                        items.map(function (item, index) {
                            return <option
                                key={item.code + " " + index}
                                value={item.code}
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
};

export default BaliSelect;