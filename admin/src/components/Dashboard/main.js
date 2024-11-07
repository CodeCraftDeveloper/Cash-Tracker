import React, { useEffect, useState } from "react";
import { App, Credentials } from "realm-web"; // Import the Realm App and Credentials
import Navbar from "../Navbar/main";
import Spinner from "../Spinner/main";
import { Link } from "react-router-dom";

const app = new App({ id: "application-0-emnopts" }); // Initialize Realm App

export default function Main() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Log in anonymously
        const user = await app.logIn(Credentials.anonymous());
        const mongodb = user.mongoClient("mongodb-atlas");
        const collection = mongodb.db("cashtracker").collection("userdata");

        // Fetch data from the collection
        const results = await collection.find({}); // Adjust the query as needed

        // Update state with fetched data
        setData(results);
        console.log(results);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
            <Link
              to="/new-account"
              data-aos="fade-up"
              data-aos-delay="500"
              data-aos-once="true"
            >
              <button className="btn btn-primary btn-lg">
                <i className="fa-solid fa-plus"></i> Create Account
              </button>
            </Link>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <h2 className="text-center">Current Accounts</h2>
          </div>
        </div>
        <div className="row pb-5 mb-5">
          <div className="col-md-12">
            {/* Display fetched data */}
            {data.length > 0 ? (
              data.map((item) => (
                <div key={item._id} className="user-data-item">
                  <div className="card shadow-sm mt-3">
                    {/* <div className="card-header">Featured</div> */}
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-4 text-center">
                          <h3 className="card-title">{item.name}</h3>
                          <p className="card-text">
                            User ID:{" "}
                            <b style={{ fontSize: "18px" }}>{item.username}</b>
                          </p>
                          <br />
                          <p>{item.personposition}</p>
                        </div>
                        <div className="col-md-4 text-center">
                          <h4 className="card-title">Total Money Recieved</h4>
                          <p style={{ fontSize: "17px", fontWeight: "bold" }}>
                            ₹{" "}
                            <span style={{ fontSize: "22px", color: "green" }}>
                              {item.totalmoney}
                            </span>
                          </p>
                          <h4 className="card-title">
                            Current Account Balance
                          </h4>
                          <p style={{ fontSize: "17px", fontWeight: "bold" }}>
                            ₹{" "}
                            <span style={{ fontSize: "22px", color: "green" }}>
                              {item.accbalance}
                            </span>
                          </p>
                        </div>
                        <div className="col-md-2 d-flex flex-column align-items-center justify-content-center mt-2">
                          <button className="btn btn-outline-success w-100">
                            <i class="fa-solid fa-money-bill"></i> Add Money
                          </button>
                          <button className="btn btn-outline-primary w-100 mt-2">
                            <i class="fa-solid fa-comments-dollar"></i>{" "}
                            Transaction Details
                          </button>
                          <button className="btn btn-outline-primary w-100 mt-2">
                            <i class="fa-solid fa-gear"></i> Account Details
                          </button>
                        </div>
                        <div className="col-md-2 d-flex flex-column align-items-center justify-content-center mt-2">
                          <button className="btn btn-danger w-100">
                            <i class="fa-solid fa-trash"></i> Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Add other fields as necessary */}
                </div>
              ))
            ) : (
              <p className="text-center mt-5" style={{ fontSize: "18px" }}>
                <span className="text-danger" style={{ fontWeight: "bold" }}>
                  404! No Account Available.
                </span>{" "}
                <br />{" "}
                <Link to="/new-account" style={{ textDecoration: "none" }}>
                  Create One{" "}
                  <i class="fa-solid fa-arrow-up-right-from-square"></i>
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
