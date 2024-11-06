import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/main";
import Spinner from "../Spinner/main";

export default function Main() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 1 second delay
  }, []);

  const handleAddNewCompany = () => {
    navigate("/add-new-company-in-map");
  };

  return (
    <>
      <Navbar />
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center mt-5">
                <h1
                  data-aos="fade-up"
                  data-aos-delay="500"
                  data-aos-once="true"
                >
                  Lorem ipsum dolor sit amet consectetur.
                </h1>
              </div>
            </div>
            <div className="row mt-5">
              <div className="col-md-10"></div>
              <div className="col-md-2">
                <Link to="/new-account">
                  <button className="btn btn-primary btn-lg">
                    <i class="fa-solid fa-plus"></i> Add Person
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
