import React, {useContext, useEffect} from 'react';
import {Context} from "../index";
import {Col, Image, Row} from "react-bootstrap";
import {NavLink} from "react-router-dom";

const GuidePage = () => {
    const {navBarTitle} = useContext(Context)

    useEffect(() => {
        navBarTitle.navBarTitle = 'Guide Page'
    }, [])

    return (
        <div>
            <div style={{display: 'flex'}}>
                <Col md={4} style={{backgroundColor: 'yellow'}}>
                    <Row className="" style={{display: 'flex'}}>
                        <div>
                            <Image width={50} height={50} src={'https://www.w3schools.com/howto/img_avatar.png'}/>
                        </div>
                        <h3>User Name</h3>
                        <h5>user@email.com</h5>

                    </Row>
                </Col>

                <Col md={8}>
                    <Row style={{marginLeft: '10px'}}>
                        <div>
                            <h5>Guide</h5>
                        </div>
                        <div style={{display: 'flex'}}>
                            <div>
                                <h4>Зарегистрирован</h4>
                                <h6>01.01.2022</h6>
                            </div>
                            <div style={{marginLeft: '10px'}}>
                                <h4>Телефон</h4>
                                <h6>+62 0856-356-435</h6>
                            </div>
                        </div>
                    </Row>
                    <Row style={{marginLeft: '10px'}}>
                        <div>
                            <h5>Данные</h5>
                        </div>
                        <div style={{display: 'flex'}}>
                            <div>
                                <h4>Туры</h4>
                                <NavLink to={'#'}>Тур выходного дня</NavLink>
                            </div>
                            <div style={{marginLeft: '10px'}}>
                                <h4>Самый популярный</h4>
                                <NavLink to={'#'}>Тур "Мега тур"</NavLink>
                            </div>
                        </div>
                    </Row>

                </Col>
            </div>
            <div>
                <Row style={{
                    marginLeft: '10px',
                    overflow: 'auto',
                    height: '250px',
                    alignContent: 'flex-start'
                }}>
                    <div>
                        <h5>Контакты с пользователями</h5>
                    </div>
                    <div style={{display: 'flex'}}>
                        <div>
                            <h6>02.02.2022</h6>
                            <h6>Просмотр контакта</h6>
                        </div>
                        <div style={{marginLeft: '10px'}}>
                            <h6>02.02.2022</h6>
                            <h6>Нажал "показать номер телефона"</h6>
                        </div>
                    </div>
                    <div style={{display: 'flex'}}>
                        <div>
                            <h6>03.02.2022</h6>
                            <h6>Просмотр контакта</h6>
                        </div>
                    </div>
                    <div style={{display: 'flex'}}>
                        <div>
                            <h6>03.02.2022</h6>
                            <h6>Просмотр контакта</h6>
                        </div>
                        <div style={{marginLeft: '10px'}}>
                            <h6>03.02.2022</h6>
                            <h6>Нажал "показать номер телефона"</h6>
                        </div>
                    </div>
                </Row>
                <Row style={{
                    marginLeft: '10px',
                    overflow: 'auto',
                    height: '250px',
                    alignContent: 'flex-start'
                }}>
                    <div>
                        <h5>Созданные туры</h5>
                    </div>
                    <div style={{display: 'flex'}}>
                        <div>
                            <h6>Тур выходного дня</h6>
                        </div>
                        <div style={{marginLeft: '10px'}}>
                            <h6>522 просмотров / 12 заказов</h6>
                        </div>
                    </div>
                    <div style={{display: 'flex'}}>
                        <div>
                            <h6>Тур "Мега тур"</h6>
                        </div>
                        <div style={{marginLeft: '10px'}}>
                            <h6>1534 просмотров / 120 заказов</h6>
                        </div>
                    </div>
                </Row>
            </div>
        </div>
    );
};

export default GuidePage;