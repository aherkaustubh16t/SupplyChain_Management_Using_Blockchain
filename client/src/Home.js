import React from "react";
import { useHistory } from "react-router-dom";
import "./Home.css";

function Home() {
  const history = useHistory();
  const redirect_to_roles = () => {
    history.push("/roles");
  };
  const redirect_to_addmed = () => {
    history.push("/addmed");
  };
  const redirect_to_supply = () => {
    history.push("/supply");
  };
  const redirect_to_track = () => {
    history.push("/track");
  };

  return (
    <div className="home-container">
      <div className="header">
        <h2 className="title">Supply Chain Management System</h2>
        <p className="subtitle">
          Manage your Goods supply chain efficiently on the blockchain
        </p>
      </div>

      <div className="note-box">
        <p>
          <strong>Note:</strong> Here <u>Owner</u> is the person who deployed the smart contract
          on the blockchain
        </p>
      </div>

      <div className="workflow">
        <div className="step-card">
          <div className="step-header">
            <span className="step-number">1</span>
            <h4 className="step-title">Register Supply Chain Participants</h4>
          </div>
          <p className="step-description">
            Owner should register Raw Material Suppliers, Manufacturers,
            Distributors and Retailers
          </p>
          <p className="step-note">
            (Note: This is a one time step. Skip to step 2 if already done)
          </p>
          <button
            onClick={redirect_to_roles}
            className="step-button"
          >
            Register Participants
          </button>
        </div>

        <div className="step-card">
          <div className="step-header">
            <span className="step-number">2</span>
            <h4 className="step-title">Order Goods</h4>
          </div>
          <p className="step-description">
            Owner should order goods to initiate the supply chain process
          </p>
          <button
            onClick={redirect_to_addmed}
            className="step-button"
          >
            Create Order
          </button>
        </div>

        <div className="step-card">
          <div className="step-header">
            <span className="step-number">3</span>
            <h4 className="step-title">Control Supply Chain</h4>
          </div>
          <p className="step-description">
            Manage the flow of goods through the supply chain
          </p>
          <button
            onClick={redirect_to_supply}
            className="step-button"
          >
            Manage Supply Chain
          </button>
        </div>
      </div>

      <div className="track-section">
        <h3 className="track-title">Track Goods in Supply Chain</h3>
        <p className="track-description">
          Monitor the movement and status of goods throughout the supply chain
        </p>
        <button
          onClick={redirect_to_track}
          className="track-button-outline"
        >
          Track Goods
        </button>
      </div>
    </div>
  );
}

export default Home;