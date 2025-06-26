import React, { useState, useEffect } from "react";
import * as yup from "yup";

function Form() {
  let formValidation = yup.object({
    name: yup
      .string()
      .required("name is not empty")
      .matches(/^[a-zA-Z]+$/, "enter only latter"),
    email: yup
      .string()
      .email("enter correct email address")
      .required("email must enter"),
    address: yup.string("enter address").required("address not empty"),
    mobile: yup
      .string()
      .matches(/^\d{10}$/, "Mobile number must be exactly 10 digits")
      .required("Mobile number is required"),
    city: yup.string("city must select").required("must select city"),
    password: yup.string("enter password").required("password must required"),
    gender: yup.string("select gender").required("must select gender"),
  });

  const [error, setError] = useState();

  const [data, setData] = useState({
    name: "",
    email: "",
    address: "",
    mobile: "",
    city: "",
    password: "",
    gender: "",
  });

  const [store, setStore] = useState([]);
  const [edit, setEdit] = useState(null);

  useEffect(() => {
    const getData = JSON.parse(localStorage.getItem("records"));
    if (getData) {
      setStore(getData);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await formValidation.validate(data, { abortEarly: false });
      setError({});

      if (edit) {
        setStore((pre) =>
          pre.map((item) => (item.id === edit ? { ...item, ...data } : item))
        );
        setEdit(null);

        localStorage.setItem(
          "records",
          JSON.stringify(
            store.map((item) =>
              item.id === edit ? { ...item, ...data } : item
            )
          )
        );
      } else {
        const nextId = store.length > 0 ? store[store.length - 1].id + 1 : 1;

        const newrecord = { ...data, id: nextId };

        const updaterecord = [...store, newrecord];

        setStore(updaterecord);
        localStorage.setItem("records", JSON.stringify(updaterecord));
      }
      setData({
        name: "",
        email: "",
        address: "",
        mobile: "",
        city: "",
        password: "",
        gender: "",
      });
    } catch (error) {
      let newError = {};
      error.inner.map((err) => {
        newError[err.path] = err.message;
      });
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
      error.inner.map((err) => {
        newError[err.path] = err.message;
      });
      setError(newError);
    }
  };

  const handleDelete = (id) => {
    console.log("id", id);
    const deleteId = store.filter((item) => item.id !== id);
    // const deleteId = store.splice(1);
    setStore(deleteId);
    localStorage.setItem("records", JSON.stringify(deleteId));
  };
  const handleUpdate = (id) => {
    console.log("id", id);
    const findUpdateId = store.find((item) => item.id === id);
    console.log("find", findUpdateId);
    setData(findUpdateId);
    setEdit(id);
  };

  return (
    <>
      <h1 style={{ textAlign: "center" }}>Crud Operations</h1>
      <form onSubmit={handleSubmit}>
        <label>Name : </label>
        <input
          type="text"
          name="name"
          onChange={handleInput}
          value={data.name}
        />
        {error && <div className="error">{error.name}</div>}
        <br /> <br />
        <label>Email : </label>
        <input
          type="email"
          name="email"
          onChange={handleInput}
          value={data.email}
        />
        {error && <div className="error">{error.email}</div>}
        <br /> <br />
        <label>Address : </label>
        <textarea
          name="address"
          rows="5"
          cols="20"
          onChange={handleInput}
          value={data.address}
        ></textarea>
        {error && <div className="error">{error.address}</div>}
        <br /> <br />
        <label>Mobile : </label>
        <input
          type="number"
          name="mobile"
          onChange={handleInput}
          value={data.mobile}
        />
        {error && <div className="error">{error.mobile}</div>}
        <br /> <br />
        <label>City : </label>
        <select name="city" onChange={handleInput} value={data.city}>
          <option>Choose city</option>
          <option value="surat">surat</option>
          <option value="mumbai">mumbai</option>
          <option value="rajkot">rajkot</option>
          <option value="baroda">baroda</option>
        </select>
        {error && <div className="error">{error.city}</div>}
        <br /> <br />
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
        <label>Gender : </label>
        <input
          type="radio"
          name="gender"
          value="male"
          onChange={handleInput}
          checked={data.gender === "male"}
        />
        male
        <input
          type="radio"
          name="gender"
          value="female"
          onChange={handleInput}
          checked={data.gender === "female"}
        />
        female
        {error && <div className="error">{error.gender}</div>}
        <br />
        <br />
        <button>{edit ? "Edit" : "Submit"}</button>
      </form>
      <br />
      <br />
      {store && (
        <table border="3px">
          <thead>
            <tr>
              <th>name</th>
              <th>email</th>
              <th>address</th>
              <th>mobile</th>
              <th>city</th>
              <th>password</th>
              <th>gender</th>
              <th colSpan={2}>Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(store) &&
              store.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.address}</td>
                  <td>{item.mobile}</td>
                  <td>{item.city}</td>
                  <td>{item.password}</td>
                  <td>{item.gender}</td>
                  <td>
                    <button
                      style={{ backgroundColor: "green", color: "white" }}
                      onClick={() => handleUpdate(item.id)}
                    >
                      Update
                    </button>
                    <button
                      style={{ backgroundColor: "red", color: "white" }}
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </>
  );
}

export default Form;
