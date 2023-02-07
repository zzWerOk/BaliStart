import React, {useContext, useState} from 'react';
import {Container} from "react-bootstrap";

import classes from './LoginPage.module.css'
import SpinnerSm from "../components/SpinnerSM";
import {Context} from "../index";
import {AxiosError} from "axios";
import {getById, loginApi, registerApi} from "../http/userAPI";

const LoginPage = (props) => {

    const {onAuthFinish} = props

    const {user} = useContext(Context)

    const [isLoginPresent, setIsLoginPresent] = useState(true)
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [isError, setIsError] = useState('')
    const [isInProcess, setIsInProcess] = useState(false)

    const authFunc = async () => {
        try {
            setIsInProcess(true)

            const response = await loginApi(email, password)

            if (response.hasOwnProperty('error')) {
                setIsError(response.error)
                return
            }

            getById(response.id).then((item) => {
                console.log(item)

                setIsError('')
                user.setUser(item)
                onAuthFinish()
            }).catch(() => {
                setIsError('Error')
            })

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

    const registerFunc = async () => {
        try {

            if (password === password2) {

                setIsInProcess(true)

                const response = await registerApi(name, email, password)

                if (response.hasOwnProperty('error')) {
                    setIsError(response.error)
                    return
                }

                console.log(response)
                setIsError('')
                user.setUser(response)
                onAuthFinish()
            } else {
                setIsError('Passwords not same')
            }
        } catch (e) {
            if (e.response.data.message) {
                setIsError(e.response.data.message)
            } else if (e instanceof AxiosError) {
                setIsError(e.message)
                // } else {
                //     setIsError(e.response.data.message)
            }
        } finally {
            setIsInProcess(false)
        }
    }

    return (
        <Container className="d-flex justify-content-center align-items-center"
            // style={{height: window.innerHeight - 54}}
        >
            {
                isLoginPresent
                    ?
                    <form className="p-3 mb-5 bg-white"
                          style={{minWidth: '350px'}}>
                        <div>
                            <h4>Login</h4>
                        </div>
                        <div className={classes.div_input}>
                            <label
                                className={`${classes.input_label} form-label`}
                                htmlFor="loginEmail"
                            >Email address</label>
                            <input
                                type="email"
                                id="loginEmail"
                                className="form-control"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>

                        <div className={classes.div_input}>
                            <label
                                className={`${classes.input_label} form-label`}
                                htmlFor="loginPassword"
                            >Password</label>
                            <input
                                type="password"
                                id="loginPassword"
                                className="form-control"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="button"
                            className={`btn btn-primary btn-block mb-4 ${isInProcess ? 'disabled' : ''}`}
                            style={{width: '100%', marginTop: '45px'}}
                            onClick={authFunc}
                        >{isInProcess ? <SpinnerSm/> : 'Войти'}</button>

                        <div className={`${isError === '' ? 'd-none' : ''} hidden alert alert-danger`} role="alert">
                            {isError}
                        </div>

                        <div className="text-center">
                            <p>Not a member?
                                <span
                                    className={classes.span_link}
                                    onClick={() => {
                                        setIsLoginPresent(false)
                                    }}
                                >Register</span>
                            </p>
                        </div>
                    </form>
                    :
                    <form className="p-3 mb-5 bg-white"
                          style={{minWidth: '350px'}}
                    >
                        <div>
                            <h4>Registration</h4>
                        </div>
                        <div className={classes.div_input}>
                            <label
                                className={`${classes.input_label} form-label`}
                                htmlFor="formName"
                            >User name</label>
                            <input
                                type="name"
                                id="formName"
                                className="form-control"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </div>

                        <div className={classes.div_input}>
                            <label
                                className={`${classes.input_label} form-label`}
                                htmlFor="formLogin"
                            >Email address</label>
                            <input
                                type="email"
                                id="formLogin"
                                className="form-control"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>

                        <div className={classes.div_input}>
                            <label
                                className={`${classes.input_label} form-label`}
                                htmlFor="formPassword"
                            >Password</label>
                            <input
                                type="password"
                                id="formPassword"
                                className="form-control"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>

                        <div className={classes.div_input}>
                            <label
                                className={`${classes.input_label} form-label`}
                                htmlFor="formPassword2"
                            >Repeat password</label>
                            <input
                                type="password"
                                id="formPassword2"
                                className="form-control"
                                value={password2}
                                onChange={e => setPassword2(e.target.value)}
                            />
                        </div>

                        <button
                            type="button"
                            className={`btn btn-primary btn-block mb-4 ${isInProcess ? 'disabled' : ''}`}
                            style={{width: '100%', marginTop: '45px'}}
                            onClick={registerFunc}
                        >{isInProcess ? <SpinnerSm/> : 'Register'}</button>

                        <div className={`${isError === '' ? 'd-none' : ''} hidden alert alert-danger`} role="alert">
                            {isError}
                        </div>

                        <div className="text-center">
                            <p>Have an acc?
                                <span
                                    className={classes.span_link}
                                    onClick={() => {
                                        setIsLoginPresent(true)
                                    }}
                                >Login</span>
                            </p>
                        </div>
                    </form>
            }


        </Container>
    );
};

export default LoginPage;