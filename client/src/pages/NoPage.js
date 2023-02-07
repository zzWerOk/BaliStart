import React, {useContext, useState} from 'react';
import {Container} from "react-bootstrap";

import classes from './LoginPage.module.css'
import SpinnerSm from "../components/SpinnerSM";
import {Context} from "../index";
import {AxiosError} from "axios";
import {getById, loginApi, registerApi} from "../http/userAPI";

const NoPage = (props) => {

    return (
        <div>
            Error 404
        </div>
    );
};

export default NoPage;