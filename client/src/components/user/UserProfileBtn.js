import React, {useEffect, useState} from 'react';

const UserProfileBtn = (props) => {
    const {image, onClickHandler} = props

    const [avatar_img, setAvatar_img] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true)
        if (image) {
            setAvatar_img(process.env.REACT_APP_API_URL + '/static/' + image + '?' + Date.now())
        } else {
            setAvatar_img(process.env.REACT_APP_API_URL + '/static/' + 'guide_avatar.png')
        }

        setLoading(false)
    }, [])

    if(loading){

    }else {
        return (
            <div onClick={onClickHandler}
            >
                <img
                    src={avatar_img} alt="Guide avatar"
                    className={`rounded-circle img-thumbnail shadow-sm`}
                    // className={`rounded-circle shadow-sm`}
                    style={{
                        minWidth: '40px',
                        minHeight: '40px',
                        maxWidth: '40px',
                        maxHeight: '40px',
                        // minWidth: {size},
                        // minHeight: {size},
                        // maxWidth: {size},
                        // maxHeight: {size},

                        objectFit: 'cover',
                    }}
                />
            </div>
        );
    }
};

export default UserProfileBtn;