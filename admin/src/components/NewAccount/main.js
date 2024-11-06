import React, { useEffect, useState } from "react";
import { App, Credentials } from "realm-web"; // Import the Realm App and Credentials
import Navbar from "../Navbar/main";
import Spinner from "../Spinner/main";
import { Link } from "react-router-dom";

const app = new App({ id: "application-0-emnopts" }); // Initialize Realm App

export default function Main() {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    personposition: "", // New field added
    totalmoney: 0,
    accbalance: 0,
    balused: 0,
    balremaining: 0,
    transactions: [],
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1 second loading

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const login = async () => {
    const user = await app.logIn(Credentials.anonymous()); // Use Credentials from realm-web
    return user;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // User should be logged in before saving data
    const user = await login(); // Ensure user is logged in
    const mongodb = user.mongoClient("mongodb-atlas");
    const collection = mongodb.db("cashtracker").collection("userdata");

    // Check if the username already exists
    const existingUser = await collection.findOne({
      username: formData.username,
    });

    if (existingUser) {
      // Username already exists, show alert
      window.alert("Username not available. Please choose another one.");
      return; // Exit the function
    }

    // Save the formData to MongoDB
    try {
      const result = await collection.insertOne(formData);
      window.alert("New Account Created!");
    } catch (error) {
      console.error("Error saving data:", error);
    } finally {
      // Reset form data after alert is dismissed
      setFormData({
        name: "",
        username: "",
        password: "",
        personposition: "",
        totalmoney: 0,
        accbalance: 0,
        balused: 0,
        balremaining: 0,
      });
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Spinner />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="row mb-3">
          <div className="col-md-12 text-end">
            <Link to="/dashboard">
              <button className="btn btn-primary btn-lg">
                Back to Accounts
              </button>
            </Link>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <h2 className="text-center">Create New Account</h2>
          </div>
        </div>
        <div className="row">
          <form onSubmit={handleSubmit} className="col-md-12">
            <div className="form-group mt-2">
              <label>
                <b>Person's Name</b>
                <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group mt-2">
              <label>
                <b>Person's Position</b>
                <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="personposition" // New input field for person position
                value={formData.personposition}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group mt-2">
              <label>
                <b>Username</b>
                <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group mt-2">
              <label>
                <b>Password</b>
                <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <button type="submit" className="btn btn-primary btn-lg mt-3">
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
