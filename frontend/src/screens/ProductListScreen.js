import React, { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
    listProducts,
    deleteProduct,
    createProduct,
} from "../actions/productActions";
import { PRODUCT_CREATE_RESET } from "../constants/productConstants";

const ProductListScreen = ({ history }) => {
    const dispatch = useDispatch();

    const { loading, products, error } = useSelector(
        (state) => state.productList
    );

    const {
        loading: loadingDelete,
        success: successDelete,
        error: errorDelete,
    } = useSelector((state) => state.productDelete);

    const {
        loading: loadingCreate,
        success: successCreate,
        product: createdProduct,
        error: errorCreate,
    } = useSelector((state) => state.productCreate);

    const { userInfo } = useSelector((state) => state.userLogin);

    useEffect(() => {
        dispatch({ type: PRODUCT_CREATE_RESET });

        if (!userInfo || !userInfo.isAdmin) history.push("/login");

        if (successCreate)
            history.push(`/admin/product/${createdProduct._id}/edit`);
        else dispatch(listProducts());
    }, [
        dispatch,
        history,
        userInfo,
        successDelete,
        createdProduct,
        successCreate,
    ]);

    const deleteHandler = (id) => {
        if (window.confirm("Are you sure?")) dispatch(deleteProduct(id));
    };

    const createProductHandler = () => dispatch(createProduct());

    return (
        <>
            <Row className="align-items-center">
                <Col>
                    <h1>Products</h1>
                </Col>
                <Col className="text-right">
                    <Button className="my-3" onClick={createProductHandler}>
                        <i className="fas fa-plus"></i>
                        Create Product
                    </Button>
                </Col>
            </Row>
            {loadingCreate && <Loader />}
            {errorCreate && <Message variant="danger">{errorCreate}</Message>}

            {loadingDelete && <Loader />}
            {errorDelete && <Message variant="danger">{errorDelete}</Message>}

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
                            <th>PRICE</th>
                            <th>CATEGORY</th>
                            <th>BRAND</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(
                            ({ _id: id, name, price, category, brand }) => (
                                <tr key={id}>
                                    <td>{id}</td>
                                    <td>{name}</td>
                                    <td>$ {price}</td>
                                    <td>{category}</td>
                                    <td>{brand}</td>
                                    <td>
                                        <LinkContainer
                                            to={`/admin/product/${id}/edit`}
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
                            )
                        )}
                    </tbody>
                </Table>
            )}
        </>
    );
};

export default ProductListScreen;
