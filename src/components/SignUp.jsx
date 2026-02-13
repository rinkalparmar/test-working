import React, { useState } from "react";
import { signup } from "../slice/authSlice";
import * as yup from "yup";
import { useSelector, useDispatch } from "react-redux";

function SignUp() {
  let formValidation = yup.object({
    name: yup
      .string()
      .required("name is not empty")
      .matches(/^[a-zA-Z]+$/, "enter only latter"),
    email: yup
      .string()
      .email("enter correct email address")
      .required("email must enter"),
    password: yup.string("enter password").required("password must required"),
  });

  const users = useSelector((state) => state.auth.users);

  const errors = useSelector((state) => state.auth.error);

  const dispatch = useDispatch();

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await formValidation.validate(data, { abortEarly: false });
      setError({});

      const findUser = users.find((user) => {
        if (user.email === data.email) {
          return user;
        }
      });

      if (findUser) {
        console.log("exits user");
        setError({ email: "User Already Exist" });
        return;
      }

      const nextId = users.length > 0 ? users[users.length - 1].id + 1 : 1;

      const newUser = {
        id: nextId,
        ...data,
      };
      const allUser = [...users, newUser];
      dispatch(signup(allUser));

      setData({
        name: "",
        email: "",
        password: "",
      });
      setError({});
    } catch (error) {
      const newError = {};
      if (error.inner && Array.isArray(error.inner)) {
        error.inner.forEach((err) => {
          newError[err.path] = err.message;
        });
      } else {
        newError.general = error.message || "Validation failed";
      }
      setError(newError);
    }
  };

  const handleInput = async (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData({ ...data, [name]: value });
    try {
      await formValidation.validate(
        {
          ...data,
          [name]: value,
        },
        { abortEarly: false }
      );
      setError({});
    } catch (error) {
      const newError = {};
      if (error.inner && Array.isArray(error.inner)) {
        error.inner.forEach((err) => {
          newError[err.path] = err.message;
        });
      } else {
        newError.general = error.message || "Validation failed";
      }
      setError(newError);
    }
  };

  return (
    <>
      {errors && <div className="error">{errors}</div>}
      <form
        action=""
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "24px",
          backgroundColor: "#f9f9f9",
          margin: "40px auto",
          boxShadow: "0 4px 12px",
        }}
      >
        <h1 style={{ textAlign: "center" }}>SignUp Form</h1>
        <label>Name : </label>
        <input
          type="text"
          name="name"
          onChange={handleInput}
          value={data.name}
        />
        {error && <div className="error">{error.name}</div>}
        <br />
        <br />
        <label>Email : </label>
        <input
          type="email"
          name="email"
          onChange={handleInput}
          value={data.email}
        />
        {error && <div className="error">{error.email}</div>}
        <br />
        <br />
        <label>Password : </label>
        <input
          type="password"
          name="password"
          onChange={handleInput}
          value={data.password}
        />
        {error && <div className="error">{error.password}</div>}
        <br />
        <br />
        <button>Submit</button>
      </form>
    </>
  );
}

export default SignUp;
