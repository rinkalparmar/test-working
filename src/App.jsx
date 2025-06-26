import React from "react";
import "./App.css";
import Home from "./components/Home";
import About from "./components/About";
// import YupForm from "./components/YupForm";
import Form from "./components/Form";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      {/* <Route path="/formwithyup" element={<YupForm />} /> */}
      <Route path="/form" element={<Form />} />
    </Routes>
  );
}

export default App;
