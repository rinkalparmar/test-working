import React, { useState, useEffect } from "react";
import * as yup from "yup";

function Form() {
  const [error, setError] = useState();

  const [store, setStore] = useState([]);
  const [edit, setEdit] = useState(null);
  const [data, setData] = useState({
    name: "",
    email: "",
    address: "",
    mobile: "",
    city: "",
    password: "",
    gender: "",
  });

  let nameFormate = (name) => {
    return /^[a-zA-Z]+$/.test(name);
  };
  let emailFormate = (email) => {
    return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email);
  };
  let addressFormate = (address) => {
    return /^[a-zA-Z]+$/.test(address);
  };
  let mobileFormate = (mobile) => {
    return /^\d{10}$/.test(mobile);
  };

  let passwordFormate = (password) => {
    const startwith = /^[A-Z]/.test(password);
    const leatnum = /\d/.test(password);
    const specialchar = /[@!#$%&*]/.test(password);
    return startwith && leatnum && specialchar;
  };

  const validationForm = (value) => {
    const newError = {};
    if (!value.name || !nameFormate(value.name)) {
      newError.name = "name must enter as letters";
    }
    if (!value.email || !emailFormate(value.email)) {
      newError.email = "enter valid email ";
    }
    if (!value.address || !addressFormate(value.address)) {
      newError.address = "address must enter as letters";
    }
    if (!value.mobile || !mobileFormate(value.mobile)) {
      newError.mobile = "mobile must enter only 10 digit";
    }
    if (!value.city) {
      newError.city = "must choose city";
    }
    if (!value.password || !passwordFormate(value.password)) {
      newError.password =
        "password must start with capital letters,atleast have digit and special character";
    }
    if (!value.gender) {
      newError.gender = "must choose gender";
    }

    setError(newError);
    return Object.keys(newError).length;
  };

  useEffect(() => {
    const getData = JSON.parse(localStorage.getItem("records"));
    if (getData) {
      setStore(getData);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const countError = validationForm(data);
    if (countError > 0) return;

    if (edit) {
      setStore((pre) =>
        pre.map((item) => (item.id === edit ? { ...item, ...data } : item))
      );
      setEdit(null);

      localStorage.setItem(
        "records",
        JSON.stringify(
          store.map((item) => (item.id === edit ? { ...item, ...data } : item))
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
  };

  const handleInput = async (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData({ ...data, [name]: value });
    validationForm({ ...data, [name]: value });
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
        {error?.name && <div className="error">{error.name}</div>}
        <br /> <br />
        <label>Email : </label>
        <input
          type="email"
          name="email"
          onChange={handleInput}
          value={data.email}
        />
        {error?.email && <div className="error">{error.email}</div>}
        <br /> <br />
        <label>Address : </label>
        <textarea
          name="address"
          rows="5"
          cols="20"
          onChange={handleInput}
          value={data.address}
        ></textarea>
        {error?.address && <div className="error">{error.address}</div>}
        <br /> <br />
        <label>Mobile : </label>
        <input
          type="number"
          name="mobile"
          onChange={handleInput}
          value={data.mobile}
        />
        {error?.mobile && <div className="error">{error.mobile}</div>}
        <br /> <br />
        <label>City : </label>
        <select name="city" onChange={handleInput} value={data.city}>
          <option>Choose city</option>
          <option value="surat">surat</option>
          <option value="mumbai">mumbai</option>
          <option value="rajkot">rajkot</option>
          <option value="baroda">baroda</option>
        </select>
        {error?.city && <div className="error">{error.city}</div>}
        <br /> <br />
        <label>Password : </label>
        <input
          type="password"
          name="password"
          onChange={handleInput}
          value={data.password}
        />
        {error?.password && <div className="error">{error.password}</div>}
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
        {error?.gender && <div className="error">{error.gender}</div>}
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
