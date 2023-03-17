import React from 'react';
import ChatProfile from "../components/user/ChatProfile";
import FeedTopBar from "../components/mainpage/FeedTopBar";
import {sortTours} from "../utils/consts";

const MessagesPage = () => {
    return (
        <div>
            <div style={{marginTop: '20px'}}>

                <FeedTopBar
                    isSearch={true}
                    // setSearchHandler={setSearchHandler}
                    // setSort={setSortHandler}
                    // isLoading={isLoadingSorted}
                    // selectedSortCode={selectedSortCode}
                    sortCodes={sortTours}
                />

                <div
                    className={`tab-pane fade active show px-0 px-md-5`}
                    id="chat"
                    role="tabpanel"
                    aria-labelledby="chat-tab0"
                    style={{height: 'calc(100vh - 129px'}}
                >
                    <ChatProfile/>
                </div>

            </div>
        </div>
    );
};

export default MessagesPage;