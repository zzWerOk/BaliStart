import React from 'react';
import {Col, Image, Row} from "react-bootstrap";
import baliStartImg from "../../assets/img_avatar.png"
import {NavLink} from "react-router-dom";
import {dateToEpoch, epochToDate} from "../../utils/consts";

const UserPageCard = (props) => {
    const {selectedUser} = props
    let name = ''
    let email = ''
    let createdAt = '00.00.00'

    if(selectedUser) {
        name = selectedUser.name
        email = selectedUser.email
        createdAt = selectedUser.createdAt
    }

    return (
        <div>
            <div style={{display: 'flex'}}>
                <Col md={4} style={{backgroundColor: 'yellow'}}>
                    <Row className="" style={{display: 'flex'}}>
                        <div>
                            <Image width={50} height={50} src={'https://www.w3schools.com/howto/img_avatar.png'}/>
                        </div>
                        <h3>{name}</h3>
                        <h5>{email}</h5>

                    </Row>
                </Col>

                <Col md={8}>
                    <Row style={{marginLeft: '10px'}}>
                        <div>
                            <h5>User</h5>
                        </div>
                        <div style={{display: 'flex'}}>
                            <div>
                                <h4>Зарегистрирован</h4>
                                <h6>{epochToDate(dateToEpoch(createdAt) * 1000)}</h6>
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
                        <h5>Контакты с гидами</h5>
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
                        <h5>Просмотренные туры</h5>
                    </div>
                    <div style={{display: 'flex'}}>
                        <div>
                            <h6>Тур выходного дня</h6>
                        </div>
                        <div style={{marginLeft: '10px'}}>
                            <h6>02.02.2022</h6>
                        </div>
                    </div>
                    <div style={{display: 'flex'}}>
                        <div>
                            <h6>Тур "Мега тур"</h6>
                        </div>
                        <div style={{marginLeft: '10px'}}>
                            <h6>02.02.2022</h6>
                        </div>
                    </div>
                </Row>
            </div>
        </div>
    );
};

export default UserPageCard;