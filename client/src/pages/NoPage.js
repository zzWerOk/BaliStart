import React, {useEffect} from 'react';

const NoPage = () => {


    useEffect(() => {
        document.title = 'Oops, 404';
    }, []);

    return (
        <div>
            Error 404
        </div>
    );
};

export default NoPage;