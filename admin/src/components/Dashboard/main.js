import React, { useEffect, useState } from "react";
import { App, Credentials } from "realm-web";
import Navbar from "../Navbar/main";
import Spinner from "../Spinner/main";
import { Link } from "react-router-dom";

const app = new App({ id: "application-0-emnopts" });

export default function Main() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [accountDetails, setAccountDetails] = useState(null);
  const [accounttransactions, setAccountTransactions] = useState(null);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [showTransactionPopup, setShowtransactionPopup] = useState(false);
  const [ShowmoneyPopup, setShowmoneyPopup] = useState(false);
  const [moneyDetails, setmoneyDetails] = useState(null);
  const [amountToAdd, setAmountToAdd] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await app.logIn(Credentials.anonymous());
        const mongodb = user.mongoClient("mongodb-atlas");
        const collection = mongodb.db("cashtracker").collection("userdata");

        const results = await collection.find({});
        setData(results);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowPopup(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const user = await app.logIn(Credentials.anonymous());
      const mongodb = user.mongoClient("mongodb-atlas");
      const collection = mongodb.db("cashtracker").collection("userdata");

      await collection.deleteOne({ _id: userToDelete._id });

      const results = await collection.find({});
      setData(results);
      setShowPopup(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleCancel = () => {
    setShowPopup(false);
    setUserToDelete(null);
    setShowDetailsPopup(false);
    setAccountDetails(null);
    setShowmoneyPopup(false);
    setmoneyDetails(null);
    setAccountTransactions(null);
    setShowtransactionPopup(false);
  };
  const handleAddMoneyClick = (user) => {
    // add money logic here
    setmoneyDetails(user);
    setShowmoneyPopup(true);
  };

  const handleAccountDetailsClick = (user) => {
    setAccountDetails(user);
    setShowDetailsPopup(true);
  };

  const handleTransactionsClick = (user) => {
    setAccountTransactions(user);
    setShowtransactionPopup(true);
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-12 text-end">
            <Link to="/new-account">
              <button className="btn btn-primary btn-lg">
                <i class="fa-solid fa-plus"></i> Add New Account
              </button>
            </Link>
          </div>
        </div>
        {/* ... existing code ... */}
        <div className="row pb-5 mb-5">
          <div className="col-md-12">
            {data.length > 0 ? (
              data.map((item) => (
                <div key={item._id} className="user-data-item">
                  <div className="card shadow-sm mt-3">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-4 text-center">
                          <h3 className="card-title">{item.name}</h3>
                          <p className="card-text">
                            User ID:{" "}
                            <b style={{ fontSize: "18px" }}>{item.username}</b>
                          </p>
                          <p>{item.personposition}</p>
                        </div>
                        <div className="col-md-4 text-center">
                          <h4 className="card-title">Total Money Received</h4>
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
                          <button
                            className="btn btn-outline-success w-100"
                            onClick={() => handleAddMoneyClick(item)}
                          >
                            <i className="fa-solid fa-money-bill"></i> Add Money
                          </button>
                          <button
                            className="btn btn-outline-primary w-100 mt-2"
                            onClick={() => handleTransactionsClick(item)}
                          >
                            <i className="fa-solid fa-comments-dollar"></i>{" "}
                            Transactions
                          </button>
                          <button
                            className="btn btn-outline-primary w-100 mt-2"
                            onClick={() => handleAccountDetailsClick(item)}
                          >
                            <i className="fa-solid fa-gear"></i> Account
                            Settings
                          </button>
                        </div>
                        <div className="col-md-2 d-flex flex-column align-items-center justify-content-center mt-2">
                          <button
                            className="btn btn-danger w-100"
                            onClick={() => handleDeleteClick(item)}
                          >
                            <i className="fa-solid fa-trash"></i> Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
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
                  <i className="fa-solid fa-arrow-up-right-from-square"></i>
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Popup */}
      {showPopup && (
        <>
          <div
            className="backdrop"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 999,
            }}
            onClick={handleCancel}
          ></div>

          <div
            className="modal fade show"
            style={{ display: "block", zIndex: 1000 }}
            tabIndex="-1"
            role="dialog"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Deletion</h5>
                  <button
                    type="button"
                    className="btn close"
                    onClick={handleCancel}
                  >
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body text-center">
                  <p>
                    Are you sure you want to delete this account? <br />
                    <strong>{userToDelete?.name}</strong> <br /> (User ID:{" "}
                    <strong>{userToDelete?.username}</strong>)
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleDeleteConfirm}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {/* Transaction Popup */}
      {showTransactionPopup && (
        <>
          <div
            className="backdrop"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 999,
            }}
            onClick={handleCancel}
          ></div>
          <div
            className="modal fade show"
            style={{ display: "block", zIndex: 1000 }}
            tabIndex="-1"
            role="dialog"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Transaction Details</h5>
                  <button
                    type="button"
                    className="btn close"
                    onClick={handleCancel}
                  >
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body text-center">
                  <p>Coming Soon!</p>
                  {/* Add any other details you want to show */}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleCancel}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {/* Money details Popup */}
      {ShowmoneyPopup && (
        <>
          <div
            className="backdrop"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 999,
            }}
            onClick={handleCancel}
          ></div>
          <div
            className="modal fade show"
            style={{ display: "block", zIndex: 1000 }}
            tabIndex="-1"
            role="dialog"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add Money</h5>
                  <button
                    type="button"
                    className="btn close"
                    onClick={handleCancel}
                  >
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body text-center">
                  <p>
                    Username: <strong>{moneyDetails?.username}</strong>
                  </p>
                  <p>
                    Password: <strong>{moneyDetails?.password}</strong>
                  </p>
                  <p>
                    Name: <strong>{moneyDetails?.name}</strong>
                  </p>
                  {/* Add any other details you want to show */}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleCancel}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {/* Account Details Popup */}
      {showDetailsPopup && (
        <>
          <div
            className="backdrop"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 999,
            }}
            onClick={handleCancel}
          ></div>

          <div
            className="modal fade show"
            style={{ display: "block", zIndex: 1000 }}
            tabIndex="-1"
            role="dialog"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title">Account Details</h5>
                  <button
                    type="button"
                    className="btn close"
                    onClick={handleCancel}
                  >
                    <span className="text-white" style={{ fontSize: "20px" }}>
                      &times;
                    </span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <span className="text-primary">Name: </span>
                      <span style={{ fontSize: "20px" }}>
                        {accountDetails?.name}
                      </span>
                    </div>
                    <div className="col-md-6">
                      <span className="text-primary">Username: </span>
                      <span style={{ fontSize: "20px" }}>
                        {accountDetails?.username}
                      </span>
                    </div>
                    <div className="col-md-12 mt-2">
                      <span className="text-primary">Password: </span>
                      <span style={{ fontSize: "20px" }}>
                        {accountDetails?.password}
                      </span>
                    </div>
                    <div className="col-md-12 mt-2">
                      <span className="text-primary">About Person: </span>
                      <span style={{ fontSize: "20px" }}>
                        {accountDetails?.personposition}
                      </span>
                    </div>
                    <div className="col-md-12 mt-2">
                      <span className="text-primary">Created At: </span>
                      <span style={{ fontSize: "20px" }}>
                        {accountDetails?.createdAt
                          ? accountDetails.createdAt.toString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleCancel}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
