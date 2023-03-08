import React from 'react';
import BaliInput from "../balicreatetopic/BaliInput";
import BaliPhoneComponent from "../balicreatetopic/elements/BaliPhoneComponent";
import BaliLinksComponent from "../balicreatetopic/elements/BaliLinksComponent";
import UserLanguageSelectComponent from "./components/UserLanguageSelectComponent";

const AgentProfile = (props) => {
    const {
        agentAbout,
        agentUserName,
        agentLanguage,
        agentPhones,
        agentLinks,
        agentActiveTill,
        onAgentLanguagesEdited,
        onAgentPhonesEdited,
        onAgentLinksEdited,
        onAgentAboutChangeHandler,
        onAgentNameChangeHandler,
    } = props

    // useEffect(() => {
    //
    // }, [])

    return (
        <div className="card-body p-4 text-black">
            <div className="mb-0">
                <div className={'d-flex justify-content-between align-bottom'}>
                    <div>
                        <p className="lead fw-normal mb-1">About</p>
                    </div>
                    <div>
                        <p className="mb-1 h5">Active until</p>
                        <p className="small text-muted mb-0">{agentActiveTill}</p>
                    </div>
                </div>
                <div className="p-4" style={{backgroundColor: '#f8f9fa'}}>
                    <BaliInput labelText={'User name'}
                               text={agentUserName}
                               onTextChangeHandler={onAgentNameChangeHandler}

                    />
                    <BaliInput labelText={'About me'}
                               text={agentAbout}
                               onTextChangeHandler={onAgentAboutChangeHandler}
                    />
                </div>
                <br/>
                <div className="p-4">
                    <small className="fw-normal py-4"
                           style={{marginTop: '25px'}}
                    >
                        Languages
                    </small>
                    <UserLanguageSelectComponent labelText={'Languages'}
                                                 guideLanguage={agentLanguage}
                                                 onLanguagesEdited={onAgentLanguagesEdited}
                    />
                    <small className="fw-normal mt-2">Phones</small>
                    <div className={'d-flex justify-content-center'}>
                        <BaliPhoneComponent item={{name: '', items: agentPhones}}
                                            noName={true}
                                            dataItemEditHandler={onAgentPhonesEdited}
                        />
                    </div>
                    <small className="fw-normal">links</small>
                    <div className={'d-flex justify-content-center'}>
                        <BaliLinksComponent item={{name: '', items: agentLinks}}
                                            noName={true}
                                            dataItemEditHandler={onAgentLinksEdited}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentProfile;