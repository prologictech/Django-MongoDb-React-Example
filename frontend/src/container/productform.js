/***
 * Product submit and listing page
 */

import { Container, TextField } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProduct,
  ProductAdd,
  ProductList,
} from "../redux/actions/ProductAction";
import { useState } from "react";
import swal from "sweetalert";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";

const Productform = (history) => {
  // dispatch used for action calling
  const dispatch = useDispatch();

  // constant initialization for name,price,quantity
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  // columns to map
  const columns = [
    { title: "Name", field: "name" },
    { title: "Quantity", field: "quantity" },

    { title: "Price", field: "price" },
    { title: "Created At", field: "createdAt" },
    { title: "Updated At", field: "updatedAt" },
  ];

  // get product details from state
  const product = useSelector((state) => state.ProductReducer);
  const { message, products } = product;

  // delete button handler
  const deleteHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  // submit button handler
  const submitHandler = async () => {
    // Get User Details
    const success = await dispatch(
      ProductAdd({
        name,

        quantity,

        price,
      })
    );

    if (success) {
      swal({
        icon: "success",
        text: "You have been registered successfully. An account activation mail has been sent to your email",
      }).then((e) => {
        window.location = "/productform";
      });

      return;
    }
  };

  useEffect(() => {
    dispatch(ProductList());
  }, [dispatch, history]);

  return (
    <Container>
      {message && <h4>{message}</h4>}
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label htmlFor="exampleInputName">Name</label>
          <TextField
            type="text"
            className="form-control"
            id="exampleInputName"
            placeholder="Enter Name"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputQuantity">Quantity</label>
          <TextField
            type="text"
            className="form-control"
            id="exampleInputQuantity"
            placeholder="Quantity"
            onChange={(e) => {
              setQuantity(e.target.value);
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPrice">Price</label>
          <TextField
            type="text"
            className="form-control"
            id="exampleInputPrice"
            placeholder="Price"
            onChange={(e) => {
              setPrice(e.target.value);
            }}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
      <br />
      <br />
      <br />
      <br />

      <table className="table">
        <thead>
          <tr>
            {columns?.map(({ title, field }) => (
              <th key={title}>
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products?.map((prod) => (
            <tr key={prod._id}>
              <td>{prod.name}</td>
              <td>{prod.quantity}</td>
              <td>{prod.price}</td>
              <td>{moment(prod.createdAt).format("MM-DD-yyyy")}</td>
              <td>{moment(prod.updatedAt).format("MM-DD-yyyy")}</td>
              <td>
                <Link to={`/productedit/${prod._id}/edit`}>
                  <button variant="" className="btn-sm">
                    Edit
                  </button>
                </Link>
                <button
                  variant=""
                  className="btn-sm"
                  onClick={() => deleteHandler(prod._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Container>
  );
};

export default Productform;
