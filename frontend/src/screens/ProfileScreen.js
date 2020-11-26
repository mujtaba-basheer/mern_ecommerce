import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import { Form, Button, Row, Col, Table } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { getUserDetails, updateUserProfile } from "../actions/userActions";
import { listMyOrders } from "../actions/orderActions";

const ProfileScreen = ({ history }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState(null);

    const dispatch = useDispatch();

    const { userInfo } = useSelector((state) => state.userLogin);

    const { loading, error, user } = useSelector((state) => state.userDetails);

    const { loading: loadingOrders, error: errorOrders, orders } = useSelector(
        (state) => state.orderListMy
    );

    const { success } = useSelector((state) => state.userUpdateProfile);

    useEffect(() => {
        if (!userInfo) {
            history.push("/login");
        } else {
            if (!(user && user.name)) {
                dispatch(getUserDetails("profile"));
                dispatch(listMyOrders());
            } else {
                setName(user.name);
                setEmail(user.email);
            }
        }
    }, [dispatch, history, userInfo, user, orders]);

    const submitHandler = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
        } else {
            dispatch(updateUserProfile({ id: user.id, name, email, password }));
        }
    };

    return (
        <Row>
            <Col md={3}>
                <h2>User Profile</h2>

                {message && <Message variant="danger">{message}</Message>}

                {success && (
                    <Message variant="success">Profile Updated</Message>
                )}

                {error && <Message variant="danger">{error}</Message>}

                {loading && <Loader />}

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
                            value={email}
                            placeholder="Enter email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="confirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </Form.Group>

                    <Button type="submit" variant="primary">
                        Update
                    </Button>
                </Form>
            </Col>
            <Col md={9}>
                <h2>My Orders</h2>
                {loadingOrders ? (
                    <Loader />
                ) : errorOrders ? (
                    <Message variant="danger">{errorOrders}</Message>
                ) : (
                    <Table
                        striped
                        bordered
                        hover
                        responsive
                        className="table-sm"
                    >
                        <thead>
                            <th>ID</th>
                            <th>DATE</th>
                            <th>TOTAL</th>
                            <th>PAID</th>
                            <th>DELIVERED</th>
                            <th></th>
                        </thead>
                        <tbody>
                            {orders.map(
                                ({
                                    _id: id,
                                    createdAt,
                                    totalPrice,
                                    isPaid,
                                    paidAt,
                                    isDelivered,
                                    deliveredAt,
                                }) => (
                                    <tr key={id}>
                                        <td>{id}</td>
                                        <td>{createdAt.substring(0, 10)}</td>
                                        <td>{totalPrice}</td>
                                        <td>
                                            {isPaid ? (
                                                paidAt.substring(0, 10)
                                            ) : (
                                                <i
                                                    style={{ color: "red" }}
                                                    className="fas fa-times"
                                                ></i>
                                            )}
                                        </td>
                                        <td>
                                            {isDelivered ? (
                                                deliveredAt.substring(0, 10)
                                            ) : (
                                                <i
                                                    style={{ color: "red" }}
                                                    className="fas fa-times"
                                                ></i>
                                            )}
                                        </td>
                                        <td>
                                            <LinkContainer to={`/order/${id}`}>
                                                <Button
                                                    className="btn-sm"
                                                    variant="light"
                                                >
                                                    Details
                                                </Button>
                                            </LinkContainer>
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </Table>
                )}
            </Col>
        </Row>
    );
};

export default ProfileScreen;
