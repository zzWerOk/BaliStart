import React, {useEffect, useState} from 'react';
import './BaliTextArea.css'

const BaliFileUpload = (props) => {
    const {image, onFileChooseHandler} = props

    const [itemImage, setItemImage] = useState('')

    useEffect(() => {

        if (image) {
            setItemImage(process.env.REACT_APP_API_URL + '/static/' + image)
        } else {
            setItemImage(process.env.REACT_APP_API_URL + '/static/nophoto_s.jpg?')
        }

    }, [])

    const onFileSelectHandler = (fileName) => {

        const objectUrl = URL.createObjectURL(fileName)
        setItemImage(objectUrl)

        onFileChooseHandler(fileName, objectUrl)
    }

    return (
        <div className={'d-flex justify-content-center align-content-center mt-4 mb-3 '}
            style={{
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundImage: `url(${itemImage})`,
                height: '250px'
            }}>
            <div className="form-group col-6 "
                 style={{top: '125px', marginTop: '80px'}}
            >
                <label className={'topicLabel'} htmlFor="formFileMultiple">Topic image</label>
                <input className="form-control"
                       type="file"
                       id="formFileMultiple"
                       onChange={e => {
                           onFileSelectHandler(e.target.files[0])
                       }}
                />
            </div>
        </div>
    );
};

export default BaliFileUpload;