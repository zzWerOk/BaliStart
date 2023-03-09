import React, {useEffect, useState} from 'react';

const SortCardComponent = (props) => {

    const {setSort, selectedSortCode, isLoading, sortCodes} = props

    const [loading, setLoading] = useState(true)
    const [sortCode, setSortCode] = useState('alpha')
    const [sortItems, setSortItems] = useState([])

    useEffect(() => {
        setLoading(true)

        if (selectedSortCode) {
            setSortCode(selectedSortCode)
        }

        setSortItems(sortCodes)

        setLoading(false)
    }, [])

    const setSortCodeHandler = (value) => {
        if (!isLoading) {
            setSortCode(value)
            if (setSort) {
                setSort(value)
            }
        }
    }

    if (loading) {

    } else {
        return (
            <div className={'d-flex justify-content-center'}>
                <div className={'col-md-4 col-sm-9 d-flex flex-column'}>

                    {
                        sortItems.map(function (item, index) {
                            return <div key={item.code + '' + index}
                                        className="form-check py-2"
                            >
                                <input className="form-check-input" type="radio" name="exampleRadios"
                                       id={"exampleRadios" + index}
                                       value="option1"
                                       checked={sortCode === item.code}
                                       onChange={() => {
                                           setSortCodeHandler(item.code)
                                       }}
                                />

                                {

                                    item.code === 'alpha'
                                        ?
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                             fill="currentColor" className="bi bi-sort-alpha-down" viewBox="0 0 16 16">
                                            <path fillRule="evenodd"
                                                  d="M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371h-1.781zm1.57-.785L11 2.687h-.047l-.652 2.157h1.351z"/>
                                            <path
                                                d="M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V14zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z"/>
                                        </svg>
                                        :
                                        item.code === 'realpha'
                                            ?
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                 fill="currentColor" className="bi bi-sort-alpha-up"
                                                 viewBox="0 0 16 16">
                                                <path fillRule="evenodd"
                                                      d="M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371h-1.781zm1.57-.785L11 2.687h-.047l-.652 2.157h1.351z"/>
                                                <path
                                                    d="M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V14zm-8.46-.5a.5.5 0 0 1-1 0V3.707L2.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.498.498 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L4.5 3.707V13.5z"/>
                                            </svg>
                                            :
                                            item.sort === 'down'
                                                ?
                                                // <svg xmlns="http://www.w3.org/2000/svg"
                                                //      width="16" height="16"
                                                //      fill="currentColor"
                                                //      className="bi bi-sort-up-alt"
                                                //      viewBox="0 0 16 16"
                                                //      style={{marginBottom: '3px', marginLeft: '3px', marginRight: '3px'}}
                                                // >
                                                //     <path
                                                //         d="M3.5 13.5a.5.5 0 0 1-1 0V4.707L1.354 5.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.498.498 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L3.5 4.707V13.5zm4-9.5a.5.5 0 0 1 0-1h1a.5.5 0 0 1 0 1h-1zm0 3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 0 1h-3zm0 3a.5.5 0 0 1 0-1h5a.5.5 0 0 1 0 1h-5zM7 12.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7a.5.5 0 0 0-.5.5z"/>
                                                // </svg>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                     fill="currentColor" className="bi bi-sort-numeric-up"
                                                     viewBox="0 0 16 16">
                                                    <path
                                                        d="M12.438 1.668V7H11.39V2.684h-.051l-1.211.859v-.969l1.262-.906h1.046z"/>
                                                    <path fillRule="evenodd"
                                                          d="M11.36 14.098c-1.137 0-1.708-.657-1.762-1.278h1.004c.058.223.343.45.773.45.824 0 1.164-.829 1.133-1.856h-.059c-.148.39-.57.742-1.261.742-.91 0-1.72-.613-1.72-1.758 0-1.148.848-1.835 1.973-1.835 1.09 0 2.063.636 2.063 2.687 0 1.867-.723 2.848-2.145 2.848zm.062-2.735c.504 0 .933-.336.933-.972 0-.633-.398-1.008-.94-1.008-.52 0-.927.375-.927 1 0 .64.418.98.934.98z"/>
                                                    <path
                                                        d="M4.5 13.5a.5.5 0 0 1-1 0V3.707L2.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.498.498 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L4.5 3.707V13.5z"/>
                                                </svg>
                                                :
                                                // <svg xmlns="http://www.w3.org/2000/svg"
                                                //      width="16" height="16"
                                                //      fill="currentColor"
                                                //      className="bi bi-sort-down-alt" viewBox="0 0 16 16"
                                                //      style={{marginBottom: '3px', marginLeft: '3px', marginRight: '3px'}}
                                                // >
                                                //     <path
                                                //         d="M3.5 3.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 12.293V3.5zm4 .5a.5.5 0 0 1 0-1h1a.5.5 0 0 1 0 1h-1zm0 3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 0 1h-3zm0 3a.5.5 0 0 1 0-1h5a.5.5 0 0 1 0 1h-5zM7 12.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7a.5.5 0 0 0-.5.5z"/>
                                                // </svg>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                     fill="currentColor" className="bi bi-sort-numeric-down"
                                                     viewBox="0 0 16 16">
                                                    <path
                                                        d="M12.438 1.668V7H11.39V2.684h-.051l-1.211.859v-.969l1.262-.906h1.046z"/>
                                                    <path fillRule="evenodd"
                                                          d="M11.36 14.098c-1.137 0-1.708-.657-1.762-1.278h1.004c.058.223.343.45.773.45.824 0 1.164-.829 1.133-1.856h-.059c-.148.39-.57.742-1.261.742-.91 0-1.72-.613-1.72-1.758 0-1.148.848-1.835 1.973-1.835 1.09 0 2.063.636 2.063 2.687 0 1.867-.723 2.848-2.145 2.848zm.062-2.735c.504 0 .933-.336.933-.972 0-.633-.398-1.008-.94-1.008-.52 0-.927.375-.927 1 0 .64.418.98.934.98z"/>
                                                    <path
                                                        d="M4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z"/>
                                                </svg>

                                }

                                <label className="form-check-label" htmlFor={"exampleRadios" + index}>
                                    {item.name}
                                </label>
                            </div>
                        })
                    }

                </div>
            </div>
        );
    }
};

export default SortCardComponent;