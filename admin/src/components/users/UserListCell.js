import React, {useContext, useMemo, useState} from 'react';
import classes from './UserListCell.module.css'
import {dateToEpoch, delay, epochToDate} from "../../utils/consts";
import {setRoleAPI, setIsActiveAPI} from "../../http/userAPI";
import {Context} from "../../index";
import ModalPopUp from "../modal/ModalPopUp";
import UserPageCard from "./UserPageCard";

const UserListCell = (currUser) => {
    const selectedUser = currUser.currUser
    const {userList} = useContext(Context)
    const [isActive, setIsActive] = useState(false)
    const [loading_isActive, setLoadingIsActive] = useState(false)

    const [loading_setRole, setLoadingSetRole] = useState(false)
    const [userRole, setUserRole] = useState('')
    const [selectedUserRole, setSelectedUserRole] = useState(0)
    const userRoleList = [
        {id: 1, role: 'User'},
        {id: 2, role: 'Guide'},
        {id: 3, role: 'Admin'},
    ]

    const [showModal, setShowModal] = useState(false)

    let userPageCardComponent = () => ( <UserPageCard selectedUser={selectedUser} /> );

    /**
     Изменение активен ли пользователь API
     **/
    const setIsActive_server = (isActiveValue) => {
        delay(0).then(() => {

            setIsActiveAPI(selectedUser.id, isActiveValue).then(data => {
                try {
                    if (data.hasOwnProperty('status')) {
                        if (data.status === 'ok') {
                            setIsActive(isActiveValue)
                            userList.setUserActiveById(selectedUser.id, isActiveValue)
                        }
                    }
                } catch (e) {
                }

            }).finally(() => {
                setLoadingIsActive(false)
            })
        })
    }
    const handleRoleSelect = value => {
        setLoadingSetRole(true)

        let selectedNewRole = selectedUserRole

        userRoleList.map(newRole => {
            if (parseInt(newRole.id) === parseInt(value)) {
                selectedNewRole = newRole.role
            }
        })

        /**
         Изменение роли пользователя API
         **/
        delay(0).then(r => {
            setRoleAPI(selectedUser.id, selectedNewRole).then(data => {
                if (data.hasOwnProperty('status')) {
                    if (data.status === 'ok') {
                        setSelectedUserRole(value)
                        setUserRole(selectedNewRole)
                        userList.setUserRoleById(selectedUser.id, selectedNewRole)
                    }
                }

            }).finally(() => {
                setLoadingSetRole(false)
            })
        })
    };

    useMemo(
        () => {
            setIsActive(selectedUser.is_active)
            const selectedUserRole = selectedUser.is_admin ? 'Admin' : selectedUser.is_guide ? 'Guide' : 'User'

            userRoleList.map(currRole => {
                if (currRole.role === selectedUserRole) {
                    setSelectedUserRole(currRole.id)
                    setUserRole(selectedUserRole)
                }
            })

        }
        , []
    );

    return (
        <div className="container">

            <div className={`row ${classes.row}`}>
                <div className={`col-md-auto ${classes.cell}`}>
                    {selectedUser.id}
                </div>
                <div className={`col-2 ${classes.cell}`}>
                    [img]
                </div>
                <div className={`col-3 ${classes.cell}`}>
                    <div>
                        {selectedUser.name}
                    </div>
                    <div>
                        {selectedUser.email}
                    </div>
                </div>
                <div className={`col-3 ${classes.cell}`}>
                    <div className="form-check form-switch">
                        <input className="form-check-input"
                               type="checkbox"
                               id="flexSwitchCheckDefault"
                               checked={!!isActive}
                               disabled={!!loading_isActive}
                               onChange={e => setIsActive_server(e.target.checked)}
                        />
                        <label
                            className="form-check-label" id="flexSwitchCheckDefault">{
                            isActive ? 'Активен' : 'Неактивен'
                        }</label>
                    </div>

                </div>
                <div className={`col-3 ${classes.cell}`}>
                    <select className="form-select"
                            disabled={!!loading_setRole}
                            aria-label="Default select example"
                            value={selectedUserRole}
                            onChange={e => handleRoleSelect(e.target.value)}
                    >
                        <option disabled>Выбери роль пользователя</option>
                        <option value="1">User</option>
                        <option value="2">Guide</option>
                        <option value="3">Admin</option>
                    </select>
                    {userRole}
                </div>
                <div className={`col-3 ${classes.cell}`}>
                    {epochToDate(dateToEpoch(selectedUser.createdAt) * 1000)}
                </div>
                <div className={`col-3 ${classes.cell}`}>
                    {epochToDate(selectedUser.date_last_login)}
                </div>
                <div className={`col-3 ${classes.cell}`}>
                    <button
                        type="button"
                        className="btn btn-info btn-sm"
                        onClick={() => {
                            setShowModal(true)
                        }}
                    >Открыть
                    </button>
                </div>

            </div>

            <ModalPopUp
                show={showModal}
                onHide={() => {
                    setShowModal(false)
                }}
                selectedUser={selectedUser}
                title={'Просмотр объекта'}
                child={userPageCardComponent}
            />
        </div>
    );
};

export default UserListCell;