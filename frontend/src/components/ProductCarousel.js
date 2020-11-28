import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Carousel, Image } from "react-bootstrap";
import Loader from "./Loader";
import Message from "./Message";
import { listTopProducts } from "../actions/productActions";

const ProductCarousel = () => {
    const dispatch = useDispatch();

    const { loading, error, products } = useSelector(
        (state) => state.productTopRated
    );

    useEffect(() => {
        dispatch(listTopProducts());
    }, [dispatch]);

    return loading ? (
        <Loader />
    ) : error ? (
        <Message variant="danger">{error}</Message>
    ) : (
        <Carousel pause="hover" className="bg-dark">
            {products.map(({ name, price, _id: id, image }) => (
                <Carousel.Item key={id}>
                    <Link to={`/product/${id}`}>
                        <Image src={image} alt={name} fluid />
                        <Carousel.Caption className="carousel-caption">
                            <h2>
                                {name} ($ {price})
                            </h2>
                        </Carousel.Caption>
                    </Link>
                </Carousel.Item>
            ))}
        </Carousel>
    );
};

export default ProductCarousel;
