import React from 'react';
import BaliInput from "../balicreatetopic/BaliInput";
import BaliPhoneComponent from "../balicreatetopic/elements/BaliPhoneComponent";
import BaliLinksComponent from "../balicreatetopic/elements/BaliLinksComponent";
import UserLanguageSelectComponent from "./components/UserLanguageSelectComponent";

const GuideProfile = (props) => {
    const {
        guideAbout,
        guideUserName,
        guideReligion,
        guideExperience,
        guideLanguage,
        guidePhones,
        guideLinks,
        guideActiveTill,
        onGuideLanguagesEdited,
        onGuidePhonesEdited,
        onGuideLinksEdited,
        onGuideExperienceChangeHandler,
        onGuideReligionChangeHandler,
        onGuideAboutChangeHandler,
        onGuideNameChangeHandler,
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
                        <p className="small text-muted mb-0">{guideActiveTill}</p>
                    </div>
                </div>
                <div className="p-4" style={{backgroundColor: '#f8f9fa'}}>
                    <BaliInput labelText={'Guide name'}
                               text={guideUserName}
                               onTextChangeHandler={onGuideNameChangeHandler}
                    />
                    <BaliInput labelText={'About me'}
                               text={guideAbout}
                               onTextChangeHandler={onGuideAboutChangeHandler}
                    />
                    <BaliInput labelText={'Religion'}
                               text={guideReligion}
                               onTextChangeHandler={onGuideReligionChangeHandler}
                    />
                </div>
                <br/>
                <div className="p-4">
                    <BaliInput labelText={'Experience as a guide (years)'}
                               text={guideExperience}
                               onTextChangeHandler={onGuideExperienceChangeHandler}
                    />
                    <small className="fw-normal py-4"
                           style={{marginTop: '25px'}}
                    >
                        Languages
                    </small>
                    <UserLanguageSelectComponent labelText={'Languages'}
                                                 guideLanguage={guideLanguage}
                                                 onLanguagesEdited={onGuideLanguagesEdited}
                    />
                    <small className="fw-normal mt-2">Phones</small>
                    <div className={'d-flex justify-content-center'}>
                        <BaliPhoneComponent item={{name: '', items: guidePhones}}
                                            noName={true}
                                            dataItemEditHandler={onGuidePhonesEdited}
                        />
                    </div>
                    <small className="fw-normal">links</small>
                    <div className={'d-flex justify-content-center'}>
                        <BaliLinksComponent item={{name: '', items: guideLinks}}
                                            noName={true}
                                            dataItemEditHandler={onGuideLinksEdited}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuideProfile;