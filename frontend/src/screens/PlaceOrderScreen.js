/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Image, Button, Col, Row, ListGroup, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import CheckoutSteps from "../components/CheckoutSteps";
import { createOrder } from "../actions/orderActions";

const PlaceOrderScreen = ({ history }) => {
    const dispatch = useDispatch();

    const [taxPrice, setTaxPrice] = useState(0);
    const [itemsPrice, setItemsPrice] = useState(0);
    const [shippingPrice, setShippingPrice] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    const {
        shippingAddress: { address, city, postalCode, country },
        cartItems,
        paymentMethod,
    } = useSelector((state) => state.cart);

    const { order, success, error } = useSelector((state) => state.orderCreate);

    const addDecimal = (num) => (Math.round(num * 100) / 100).toFixed(2);

    useEffect(() => {
        const setPrice = () => {
            // calculate prices

            setItemsPrice(
                addDecimal(
                    cartItems.reduce(
                        (acc, { qty, price }) => acc + qty * price,
                        0
                    )
                )
            );
            setShippingPrice(addDecimal(itemsPrice > 100 ? 0 : 25));
            setTaxPrice(addDecimal(Number(0.15 * itemsPrice).toFixed(2)));
            setTotalPrice(addDecimal(+itemsPrice + +taxPrice + +shippingPrice));
        };
        setPrice();

        if (success) {
            history.push(`/order/${order._id}`);
        }
    }, [
        cartItems,
        setTotalPrice,
        setItemsPrice,
        setTaxPrice,
        setShippingPrice,
        itemsPrice,
        taxPrice,
        shippingPrice,
        history,
        success,
    ]);

    const placeOrderHandler = () => {
        dispatch(
            createOrder({
                orderItems: cartItems,
                shippingAddress: { address, city, postalCode, country },
                paymentMethod,
                itemsPrice,
                shippingPrice,
                taxPrice,
                totalPrice,
            })
        );
    };

    return (
        <>
            <CheckoutSteps step1 step2 step3 step4 />
            <Row>
                <Col md={8}>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Address: </strong>
                                {address}, {city}, {postalCode}, {country}
                            </p>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p>
                                <strong>Method: </strong>
                                {paymentMethod}
                            </p>
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            <p>
                                {cartItems.lenth === 0 ? (
                                    <Message>Your cart is empty</Message>
                                ) : (
                                    <ListGroup variant="flush">
                                        {cartItems.map((item, index) => (
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

                            <ListGroup.Item>
                                {error && (
                                    <Message variant="danger">{error}</Message>
                                )}
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Button
                                    type="button"
                                    className="btn-block"
                                    disabled={cartItems.lenth === 0}
                                    onClick={placeOrderHandler}
                                >
                                    Place Order
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default PlaceOrderScreen;
