import React from 'react';
import ChatProfile from "../components/user/ChatProfile";
import FeedTopBar from "../components/mainpage/FeedTopBar";

const MessagesPage = (props) => {

    const newChatUserId = props?.location?.state?.userId || null
    window.history.replaceState({}, document.title)

    return (
        <div>
            <div style={{marginTop: '20px'}}>

                <FeedTopBar

                />

                <div
                    className={`tab-pane fade active show px-0 px-md-5`}
                    id="chat"
                    role="tabpanel"
                    aria-labelledby="chat-tab0"
                    style={{height: 'calc(100vh - 129px'}}
                >
                    <ChatProfile newChatUserId={newChatUserId}/>
                </div>

            </div>
        </div>
    );
};

export default MessagesPage;