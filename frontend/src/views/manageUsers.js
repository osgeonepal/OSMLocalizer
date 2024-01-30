import React, { useEffect, useState } from "react";
import { fetchLocalJSONAPI, pushToLocalJSONAPI } from "../utills/fetch";
import { useSelector } from "react-redux";

import userAvatar from "../assets/icons/user_avatar.png";

const RoleSelect = ({ name, onChange, value }) => {

    const options = [
        { value: 1, label: "Admin" },
        { value: 0, label: "Mapper" }
    ]
    return (
        <select
            className="form-select form-select-sm"
            name={name}
            onChange={(e) => onChange(e)}
            value={value}
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    )
}


const ManageUsers = () => {

    const jwt_token = useSelector((state) => state.auth.jwtToken);

    const onRoleChange = async (user_id, role) => {
        const url = `user/${user_id}/update/role/${role}/`
        await pushToLocalJSONAPI(url, null, jwt_token)
        fetchLocalJSONAPI("users/", jwt_token, "GET")
            .then((res) => {
                setUsers(res.users)
            })
    }

    const [users, setUsers] = useState();

    useEffect(() => {
        const token = localStorage.getItem("jwt_token");
        token &&
            fetchLocalJSONAPI("users/", token, "GET")
                .then((res) => {
                    setUsers(res.users)
                })
    }, []);

    return (
        <div className="table-responsive">
            {users ? (
                <table
                    className="table table-borderless"
                    style={{ borderSpacing: "0 15px", borderCollapse: "separate" }}
                >
                    <thead>
                        <tr className="text-body-tertiary">
                            <th className="align-middle" scope="col">Id</th>
                            <th className="align-middle" scope="col"></th>
                            <th className="align-middle" scope="col">
                                User
                            </th>
                            <th className="align-middle" scope="col">
                                role
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr className="align-middle shadow-sm rounded">
                                <th
                                    className="text-body-tertiary align-middle"
                                    width="5%"
                                    scope="row"
                                    key={index}
                                >
                                    {user.id}
                                </th>
                                <td className="align-middle" width="5%">
                                    <div className="d-flex align-items-center">
                                        <img
                                            src={user.picture_url ? user.picture_url : userAvatar}
                                            className="me-2 border border-3 border-white rounded-circle shadow"
                                            height="55px"
                                            width="55px"
                                            alt="User Img"
                                        />
                                    </div>
                                </td>
                                <td className="align-middle">
                                    <div className="user-info__basic">
                                        <h5 className="mb-0">{user.username}</h5>
                                    </div>
                                </td>
                                <td className="align-middle">
                                    <RoleSelect
                                        name={user.username}
                                        id={user.id}
                                        value={user.role}
                                        onChange={(e) => onRoleChange(user.id, e.target.value)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div>
                    Loading...
                </div>
            )}
        </div>
    )
}

export default ManageUsers;