import React, { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { listUsers, deleteUser } from "../actions/userActions";

const UserListScreen = ({ history }) => {
    const dispatch = useDispatch();

    const { loading, error, users } = useSelector((state) => state.userList);

    const { success } = useSelector((state) => state.userDelete);

    const { userInfo } = useSelector((state) => state.userLogin);

    useEffect(() => {
        if (userInfo && userInfo.isAdmin) dispatch(listUsers());
        else history.push("/login");
    }, [dispatch, history, userInfo, success]);

    const deleteHandler = (id) => {
        if (window.confirm("Are you sure?")) {
            dispatch(deleteUser(id));
        }
    };

    return (
        <>
            <h1>Users</h1>
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : (
                <Table striped bordered hover responsive className="table-sm">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>EMAIL</th>
                            <th>ADMIN</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(({ _id: id, name, email, isAdmin }) => (
                            <tr key={id}>
                                <td>{id}</td>
                                <td>{name}</td>
                                <td>
                                    <a href={`mailto:${email}`}>{email}</a>
                                </td>
                                <td>
                                    {isAdmin ? (
                                        <i
                                            className="fas fa-check"
                                            style={{ color: "green" }}
                                        ></i>
                                    ) : (
                                        <i
                                            className="fas fa-times"
                                            style={{ color: "red" }}
                                        ></i>
                                    )}
                                </td>
                                <td>
                                    <LinkContainer
                                        to={`/admin/user/${id}/edit`}
                                    >
                                        <Button
                                            variant="light"
                                            className="btn-sm"
                                        >
                                            Edit
                                            <i className="fas fa-edit"></i>
                                        </Button>
                                    </LinkContainer>
                                    <Button
                                        variant="danger"
                                        className="btn-sm"
                                        onClick={() => deleteHandler(id)}
                                    >
                                        <i className="fas fa-trash"></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </>
    );
};

export default UserListScreen;
