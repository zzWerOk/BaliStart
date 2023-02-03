import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import {useHistory} from "react-router-dom";
import {register} from "../http/userAPI";
import {AUTH_ROUTE, MAIN_ROUTE} from "../utils/consts";
import {AxiosError} from "axios";
import {Container} from "react-bootstrap";
import SpinnerSm from "../components/SpinnerSM";
import classes from "../components/SideBar.module.css";

const Registration = () => {
    const {user} = useContext(Context)
    const {navBarTitle} = useContext(Context)
    const history = useHistory()

    useEffect(() => {
        navBarTitle.navBarTitle = 'Registration Page'
    }, [])

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [isError, setIsError] = useState('')
    const [isInProcess, setIsInProcess] = useState(false)

    const registerFunc = async () => {
        try {

            if(password === password2) {

                setIsInProcess(true)
                setIsError('')

                const response = await register(name, email, password)

                if (response.hasOwnProperty('error')) {
                    setIsError(response.error)
                    return
                }

                user.setUser(response)
                history.push(MAIN_ROUTE)
            }else{
                setIsError('Passwords not same')

            }
        } catch (e) {
            if(e.response.data.message){
                setIsError(e.response.data.message)
            }else if (e instanceof AxiosError) {
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
                   style={{height: window.innerHeight - 54}}>
            <form className="shadow p-3 mb-5 bg-white rounded"
                  style={{minWidth: '450px'}}>
                <div>
                    <h4>Registration</h4>
                </div>
                <div className="form-outline mb-4">
                    <input
                        type="name"
                        id="formName"
                        className="form-control"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <label className="form-label" htmlFor="formName">User name</label>
                </div>

                <div className="form-outline mb-4">
                    <input
                        type="email"
                        id="formLogin"
                        className="form-control"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <label className="form-label" htmlFor="formLogin">Email address</label>
                </div>

                <div className="form-outline mb-4">
                    <input
                        type="password"
                        id="formPassword"
                        className="form-control"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <label className="form-label" htmlFor="formPassword">Password</label>
                </div>

                <div className="form-outline mb-4">
                    <input
                        type="password"
                        id="formPassword2"
                        className="form-control"
                        value={password2}
                        onChange={e => setPassword2(e.target.value)}
                        style={{marginTop: '-5px'}}
                    />
                    <label
                        className="form-label"
                        htmlFor="formPassword2"

                    >Repeat password</label>
                </div>

                <button
                    type="button"
                    className={`btn btn-primary btn-block mb-4 ${isInProcess ? 'disabled' : ''}`}
                    style={{width: '100%'}}
                    onClick={registerFunc}
                >{isInProcess ? <SpinnerSm/> : 'Register'}</button>

                <div className={`${isError === '' ? 'd-none' : ''} hidden alert alert-danger`} role="alert">
                    {isError}
                </div>

                <div className="text-center">
                    <p>Have an acc? <a href={AUTH_ROUTE}>Login</a></p>
                </div>
            </form>
        </Container>

    );
};

export default Registration;