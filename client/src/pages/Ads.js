import React, {useState} from 'react';
import SpinnerSm from "../components/SpinnerSM";
import FeedTopBar from "../components/mainpage/FeedTopBar";

const Ads = () => {

    const [loading, setLoading] = useState(true)


    if (loading) {
        return <SpinnerSm/>
    } else {

        return (<div>
                <div style={{marginTop: '20px'}}>

                    <FeedTopBar
                        isSearch={true}
                        backBtnTitle={'Back'}

                    />



                </div>
            </div>
        );
    }};

export default Ads;