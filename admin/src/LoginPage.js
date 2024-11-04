import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Realm from "realm-web";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar/main";

const LoginPage = () => {
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Initialize Realm app
    const app = new Realm.App({ id: "application-0-emnopts" });
    const credentials = Realm.Credentials.anonymous();

    try {
      const user = await app.logIn(credentials);
      const mongo = user.mongoClient("mongodb-atlas");
      const collection = mongo.db("cashtracker").collection("admin");

      // Fetch user data from the database
      const userData = await collection.findOne({ username: userID });

      // Validate password
      if (userData && userData.password === password) {
        // Fetch the token from the database
        const tokenData = await mongo
          .db("cashtracker")
          .collection("tokens")
          .findOne({});
        const fakeToken = tokenData.admin; // Assuming the token is stored in a collection named 'tokens'

        localStorage.setItem("jwtToken", fakeToken); // Save JWT token
        toast.success("Welcome Back Admin");
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000); // wait 2 seconds before navigating
      } else {
        toast.error("Invalid username or password");
      }
    } catch (err) {
      console.error("Failed to log in", err);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="container d-flex flex-column align-items-center justify-content-center mt-5 pt-5">
        <h2
          className="mb-4"
          data-aos="fade-up"
          data-aos-delay="500"
          data-aos-once="true"
        >
          Admin Login
        </h2>

        {/* Show "Go to Dashboard" button if the user is already logged in */}

        {/* Login form */}
        <form onSubmit={handleLogin} className="w-50">
          <div
            className="mb-3"
            data-aos="fade-up"
            data-aos-delay="600"
            data-aos-once="true"
          >
            <label htmlFor="userID" className="form-label">
              Username:
            </label>
            <input
              type="text"
              className="form-control"
              id="userID"
              value={userID}
              onChange={(e) => setUserID(e.target.value)}
              required
            />
          </div>
          <div
            className="mb-3"
            data-aos="fade-up"
            data-aos-delay="700"
            data-aos-once="true"
          >
            <label htmlFor="password" className="form-label">
              Password:
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-success w-100"
            data-aos="fade-up"
            data-aos-delay="800"
            data-aos-once="true"
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
};

export default LoginPage;
