import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import Product from "./../components/Product";
import Message from "./../components/Message";
import Loader from "./../components/Loader";
import Paginate from "../components/Paginate";
import Meta from "../components/Meta";
import { listProducts } from "../actions/productActions";
import ProductCarousel from "../components/ProductCarousel";

const HomeScreen = ({ match }) => {
    const { keyword } = match.params;
    const page = match.params.page || 1;

    const dispatch = useDispatch();

    const productList = useSelector((state) => state.productList);
    const { loading, error, products, page: pageNo, pages } = productList;

    useEffect(() => {
        dispatch(listProducts(keyword, page));
    }, [dispatch, keyword, page]);

    return (
        <>
            <Meta />
            {!keyword ? (
                <ProductCarousel />
            ) : (
                <Link to="/" className="btn btn-light">
                    Go Back
                </Link>
            )}
            <h1>Latest Products</h1>
            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant="danger">{error}</Message>
            ) : (
                <>
                    <Row>
                        {products.map((product) => (
                            <Col
                                sm={12}
                                md={6}
                                lg={4}
                                xl={3}
                                key={product.name}
                            >
                                <Product product={product} />
                            </Col>
                        ))}
                    </Row>
                    <Paginate
                        page={pageNo}
                        pages={pages}
                        keyword={keyword ? keyword : ""}
                    />
                </>
            )}
        </>
    );
};

export default HomeScreen;
