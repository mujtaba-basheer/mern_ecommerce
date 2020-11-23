/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Image, Col, Row, ListGroup, Card } from "react-bootstrap";
import { PayPalButton } from "react-paypal-button-v2";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { getOrderDetails, payOrder } from "../actions/orderActions";
import { ORDER_PAY_RESET } from "../constants/orderConstants";

const OrderScreen = ({ match }) => {
    const orderId = match.params.id;

    const [sdkReady, setSdkReady] = useState(false);

    const dispatch = useDispatch();

    const { order, loading, error } = useSelector(
        (state) => state.orderDetails
    );

    const { loading: loadingPay, success: successPay } = useSelector(
        (state) => state.orderPay
    );

    const {
        shippingAddress: { address, city, postalCode, country },
        user: { name, email },
        isPaid,
        isDelivered,
        paymentMethod,
        orderItems,
        taxPrice,
        shippingPrice,
        totalPrice,
        _id: id,
        paidAt,
        deliveredAt,
    } = order;

    const itemsPrice = orderItems.reduce(
        (acc, { qty, price }) => acc + qty * price,
        0
    );

    useEffect(() => {
        const addPayPalScript = async () => {
            const { data: clientId } = await axios.get("/api/config/paypal");
            const script = document.createElement("script");
            script.type = "text/javascript";
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
            script.async = true;
            script.onload = () => setSdkReady(true);

            document.body.appendChild(script);
        };

        if (!order || id !== orderId || successPay) {
            dispatch({ type: ORDER_PAY_RESET });
            dispatch(getOrderDetails(orderId));
        } else if (!isPaid) {
            if (!window.paypal) addPayPalScript();
            else setSdkReady(true);
        }
    }, [dispatch, orderId, order, successPay]);

    const successPaymentHandler = (paymentResult) => {
        console.log(paymentResult);
        dispatch(payOrder(orderId, paymentResult));
    };

    return loading ? (
        <Loader />
    ) : error ? (
        <Message variant="danger">{error}</Message>
    ) : (
        <>
            <h1>Order {id}</h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Name: </strong> {name}
                            </p>
                            <p>
                                <strong>Email: </strong>{" "}
                                <a href={`mailto:${email}`}>{email}</a>
                            </p>
                            <p>
                                <strong>Address: </strong>
                                {address}, {city}, {postalCode}, {country}
                            </p>
                            {isDelivered ? (
                                <Message variant="success">
                                    Delivered on {deliveredAt}
                                </Message>
                            ) : (
                                <Message variant="danger">
                                    Not Delivered
                                </Message>
                            )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p>
                                <strong>Method: </strong>
                                {paymentMethod}
                            </p>
                            {isPaid ? (
                                <Message variant="success">
                                    Paid on {paidAt}
                                </Message>
                            ) : (
                                <Message variant="danger">Not Paid</Message>
                            )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            <p>
                                {orderItems.lenth === 0 ? (
                                    <Message>Your cart is empty</Message>
                                ) : (
                                    <ListGroup variant="flush">
                                        {orderItems.map((item, index) => (
                                            <ListGroup.Item key={index}>
                                                <Row>
                                                    <Col md={1}>
                                                        <Image
                                                            src={item.image}
                                                            alt={item.name}
                                                            fluid
                                                            rounded
                                                        />
                                                    </Col>
                                                    <Col>
                                                        <Link
                                                            to={`/product/${item.product}`}
                                                        >
                                                            {item.name}
                                                        </Link>
                                                    </Col>
                                                    <Col md={3}>
                                                        {item.qty} x $
                                                        {item.price}
                                                    </Col>
                                                    <Col md={2}>
                                                        ${" "}
                                                        {(
                                                            item.qty *
                                                            item.price
                                                        ).toFixed(2)}
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                )}
                            </p>
                        </ListGroup.Item>
                    </ListGroup>
                </Col>

                <Col md={4}>
                    <Card>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Items</Col>
                                    <Col>$ {itemsPrice}</Col>
                                </Row>
                                <Row>
                                    <Col>Shipping</Col>
                                    <Col>$ {shippingPrice}</Col>
                                </Row>
                                <Row>
                                    <Col>Tax</Col>
                                    <Col>$ {taxPrice}</Col>
                                </Row>
                                <Row>
                                    <Col>Total</Col>
                                    <Col>$ {totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            {!isPaid && (
                                <ListGroup.Item>
                                    {loadingPay && <Loader />}
                                    {!sdkReady ? (
                                        <Loader />
                                    ) : (
                                        <PayPalButton
                                            amount={totalPrice}
                                            onSuccess={successPaymentHandler}
                                        />
                                    )}
                                </ListGroup.Item>
                            )}
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default OrderScreen;
