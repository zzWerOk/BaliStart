import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import {Container} from "react-bootstrap";
import {login} from "../http/userAPI";
import {useHistory} from "react-router-dom";
import {delay, MAIN_ROUTE} from "../utils/consts";
import SpinnerSm from "../components/SpinnerSM";
import {AxiosError} from "axios";

const Auth = () => {
    const {user} = useContext(Context)
    const {navBarTitle} = useContext(Context)
    const history = useHistory()

    useEffect(() => {
        navBarTitle.navBarTitle = 'Auth Page'
    }, [])

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isError, setIsError] = useState('')
    const [isInProcess, setIsInProcess] = useState(false)

    // ;


    const authFunc = async () => {
        try {
            setIsInProcess(true)
            setIsError('')

            const response = await login(email, password)

            if (response.hasOwnProperty('error')) {
                setIsError(response.error)
                return
            }

            user.setUser(response)
            history.push(MAIN_ROUTE)

        } catch (e) {
            if (e instanceof AxiosError) {
                setIsError(e.message)
            } else {
                setIsError(e.response.data.message)
            }
        } finally {
            setIsInProcess(false)
        }
    }

    return (
        <Container className="d-flex justify-content-center align-items-center"
                   style={{height: window.innerHeight - 54}}>
            <form className="shadow p-3 mb-5 bg-white rounded"
                  style={{minWidth: '450px'}}>
                <div className="form-outline mb-4">
                    <input
                        type="email"
                        id="form2Example1"
                        className="form-control"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <label className="form-label" htmlFor="form2Example1">Email address</label>
                </div>

                <div className="form-outline mb-4">
                    <input
                        type="password"
                        id="form2Example2"
                        className="form-control"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <label className="form-label" htmlFor="form2Example2">Password</label>
                </div>

                <button
                    type="button"
                    className={`btn btn-primary btn-block mb-4 ${isInProcess ? 'disabled' : ''}`}
                    style={{width: '100%'}}
                    onClick={authFunc}
                >{isInProcess ? <SpinnerSm/> : 'Войти'}</button>

                <div className={`${isError === '' ? 'd-none' : ''} hidden alert alert-danger`} role="alert">
                    {isError}
                </div>

                <div className="text-center">
                    <p>Not a member? <a href="#">Register</a></p>
                    <p>or sign up with:</p>
                    <button type="button" className="btn btn-link btn-floating mx-1">
                        <i className="fab fa-facebook-f"></i>
                    </button>

                    <button type="button" className="btn btn-link btn-floating mx-1">
                        <i className="fab fa-google"></i>
                    </button>

                    <button type="button" className="btn btn-link btn-floating mx-1">
                        <i className="fab fa-twitter"></i>
                    </button>

                    <button type="button" className="btn btn-link btn-floating mx-1">
                        <i className="fab fa-github"></i>
                    </button>
                </div>
            </form>
        </Container>

    );
};

export default Auth;