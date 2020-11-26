import React, { useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { listOrders, deliverOrder } from "../actions/orderActions";
import { ORDER_DELIVER_RESET } from "../constants/orderConstants";

const OrderListScreen = ({ history }) => {
    const dispatch = useDispatch();

    const { loading, error, orders } = useSelector((state) => state.orderList);

    const {
        loading: loadingDeliver,
        error: errorDeliver,
        success,
    } = useSelector((state) => state.orderDeliver);

    const { userInfo } = useSelector((state) => state.userLogin);

    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) history.push("/login");
        else dispatch(listOrders());
    }, [userInfo, history, dispatch, success]);

    const deliverHandler = (id) => {
        dispatch(deliverOrder(id));
        dispatch({ type: ORDER_DELIVER_RESET });
    };

    return (
        <>
            <h1>Products</h1>

            {loadingDeliver && <Loader />}
            {errorDeliver && <Message variant="danger">{errorDeliver}</Message>}

            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : (
                <Table striped bordered hover responsive className="table-sm">
                    <thead>
                        <tr>
                            <th>ORDER ID</th>
                            <th>USER</th>
                            <th>TOTAL PRICE</th>
                            <th>IS PAID?</th>
                            <th>PAID AT</th>
                            <th>PAYMENT ID</th>
                            <th>IS DELIVERED?</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(
                            ({
                                _id: id,
                                user: { name: username },
                                totalPrice,
                                isPaid,
                                paidAt,
                                paymentResult: { id: paymentId },
                                isDelivered,
                            }) => (
                                <tr key={id}>
                                    <td>{id}</td>
                                    <td>{username}</td>
                                    <td>$ {totalPrice}</td>
                                    <td>
                                        {isPaid ? (
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
                                        {paidAt ? (
                                            paidAt.substring(0, 10)
                                        ) : (
                                            <i
                                                className="fas fa-times"
                                                style={{ color: "red" }}
                                            ></i>
                                        )}
                                    </td>
                                    <td>
                                        {paymentId ? (
                                            paymentId.substring(0, 10)
                                        ) : (
                                            <i
                                                className="fas fa-times"
                                                style={{ color: "red" }}
                                            ></i>
                                        )}
                                    </td>
                                    <td>
                                        {isDelivered ? (
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
                                        <Button
                                            variant="light"
                                            disabled={isDelivered}
                                            className="btn-sm"
                                            onClick={() => deliverHandler(id)}
                                        >
                                            Mark Delivered{" "}
                                            <i className="fas fa-truck"></i>
                                        </Button>
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </Table>
            )}
        </>
    );
};

export default OrderListScreen;
