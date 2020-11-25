import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import FormContainer from "../components/FormContainer";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { getUser, updateUser } from "../actions/userActions";
import { USER_UPDATE_RESET, USER_GET_RESET } from "../constants/userConstants";

const UserEditScreen = ({ match, history }) => {
    const userId = match.params.id;

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    const dispatch = useDispatch();

    const { loading, error, user } = useSelector((state) => state.userGet);

    const { loading: loadingUpdate, error: errorUpdate, success } = useSelector(
        (state) => state.userUpdate
    );

    useEffect(() => {
        if (success) {
            dispatch({ type: USER_UPDATE_RESET });
            dispatch({ type: USER_GET_RESET });
            history.push("/admin/userlist");
        } else if (!user || user._id !== userId) dispatch(getUser(userId));
        else {
            const { name, email, isAdmin } = user;
            setName(name);
            setEmail(email);
            setIsAdmin(isAdmin);
        }
    }, [user, dispatch, userId, history, success]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(updateUser({ _id: userId, name, email, isAdmin }));
    };

    return (
        <>
            <Link to={"/admin/userlist"} className="btn-light my-3">
                Go Back
            </Link>
            <FormContainer>
                <h1>Edit User</h1>
                {loadingUpdate && <Loader />}

                {errorUpdate && (
                    <Message variant="danger">{errorUpdate}</Message>
                )}

                {loading ? (
                    <Loader />
                ) : error ? (
                    <Message variant="danger">{error}</Message>
                ) : (
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="email">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="isAdmin">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Check
                                label="Is Admin?"
                                type="checkbox"
                                checked={isAdmin}
                                onChange={(e) => setIsAdmin(e.target.checked)}
                            />
                        </Form.Group>

                        <Button type="submit" variant="primary">
                            Update
                        </Button>
                    </Form>
                )}
            </FormContainer>
        </>
    );
};

export default UserEditScreen;
