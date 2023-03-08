import React, {useEffect, useState} from 'react';
import {ToggleButton, ToggleButtonGroup} from "react-bootstrap";

const UserLanguageSelectComponent = (props) => {
    const {guideLanguage, onLanguagesEdited} = props

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [guideLanguages, setGuideLanguages] = useState([])

    useEffect(() => {
        setLoading(true)

        setGuideLanguages(guideLanguage)

        setLoading(false)
    }, [])
    const onLanguageSelectHandler = (value) => {
        if (!saving) {
            const currLangArr = guideLanguages
            const found = currLangArr.find(element => element === value)
            if (found) {
                const filtered = currLangArr.filter(function (value) {
                    return value !== found;
                })
                setGuideLanguages(filtered)
                onLanguagesEdited(filtered)
            } else {
                setGuideLanguages([...currLangArr, value])
                onLanguagesEdited([...currLangArr, value])
            }

            // setGuideEdited(isGuideChanged())
        }
    }

    const checkIfSwitchedOn = (language) => {
        return guideLanguages.find(element => element === language)
    }

    if(loading){
    }else {
        return (
            <div className={'d-flex flex-column align-items-center'}>
                <ToggleButtonGroup type="checkbox" name="activity"
                                   defaultValue={guideLanguages}
                                   disabled={!!saving}
                >
                    <ToggleButton
                        variant={checkIfSwitchedOn('en') ? 'primary' : 'outline-primary'}
                        id={`language-check-1`}
                        value={'en'}
                        onClick={() => {

                            onLanguageSelectHandler('en')
                        }}
                    >
                        English
                    </ToggleButton>
                    <ToggleButton
                        variant={checkIfSwitchedOn('ru') ? 'primary' : 'outline-primary'}
                        id={`language-check-2`}
                        value={'ru'}
                        onClick={() => {
                            onLanguageSelectHandler('ru')
                        }}
                    >
                        Russian
                    </ToggleButton>
                    <ToggleButton
                        variant={checkIfSwitchedOn('id') ? 'primary' : 'outline-primary'}
                        id={`language-check-3`}
                        value={'id'}
                        onClick={() => {
                            onLanguageSelectHandler('id')
                        }}
                    >
                        Indonesian
                    </ToggleButton>

                </ToggleButtonGroup>

            </div>
        );
    }
};

export default UserLanguageSelectComponent;