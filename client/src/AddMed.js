import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Web3 from "web3";
import SupplyChainABI from "./artifacts/SupplyChain.json";
import "./AddMed.css"; // We'll create this CSS file

function AddMed() {
  const history = useHistory();
  useEffect(() => {
    loadWeb3();
    loadBlockchaindata();
  }, []);

  const [currentaccount, setCurrentaccount] = useState("");
  const [loader, setloader] = useState(true);
  const [SupplyChain, setSupplyChain] = useState();
  const [MED, setMED] = useState();
  const [MedName, setMedName] = useState();
  const [MedDes, setMedDes] = useState();
  const [MedStage, setMedStage] = useState();

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  const loadBlockchaindata = async () => {
    setloader(true);
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    setCurrentaccount(account);
    const networkId = await web3.eth.net.getId();
    const networkData = SupplyChainABI.networks[networkId];
    if (networkData) {
      const supplychain = new web3.eth.Contract(
        SupplyChainABI.abi,
        networkData.address
      );
      setSupplyChain(supplychain);
      var i;
      const medCtr = await supplychain.methods.medicineCtr().call();
      const med = {};
      const medStage = [];
      for (i = 0; i < medCtr; i++) {
        med[i] = await supplychain.methods.MedicineStock(i + 1).call();
        medStage[i] = await supplychain.methods.showStage(i + 1).call();
      }
      setMED(med);
      setMedStage(medStage);
      setloader(false);
    } else {
      window.alert("The smart contract is not deployed to current network");
    }
  };

  if (loader) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <h1 className="loading-text">Loading...</h1>
      </div>
    );
  }

  const redirect_to_home = () => {
    history.push("/");
  };

  const handlerChangeNameMED = (event) => {
    setMedName(event.target.value);
  };

  const handlerChangeDesMED = (event) => {
    setMedDes(event.target.value);
  };

  const handlerSubmitMED = async (event) => {
    event.preventDefault();
    try {
      var reciept = await SupplyChain.methods
        .addMedicine(MedName, MedDes)
        .send({ from: currentaccount });
      if (reciept) {
        loadBlockchaindata();
      }
    } catch (err) {
      alert("An error occurred!!!");
    }
  };

  return (
    <div className="add-med-container">
      <div className="header-section">
        <div className="account-info">
          <span className="account-address"><b>Current Account:</b> {currentaccount}</span>
          <button onClick={redirect_to_home} className="home-btn">HOME</button>
        </div>
        <h1 className="page-title">Goods Order Management</h1>
      </div>

      <div className="order-section">
        <h2 className="section-title">Add New Goods Order</h2>
        <form onSubmit={handlerSubmitMED} className="order-form">
          <div className="form-group">
            <label htmlFor="goodsName">Goods Name</label>
            <input
              id="goodsName"
              className="form-input"
              type="text"
              onChange={handlerChangeNameMED}
              placeholder="Enter goods name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="goodsDescription">Goods Description</label>
            <input
              id="goodsDescription"
              className="form-input"
              type="text"
              onChange={handlerChangeDesMED}
              placeholder="Enter goods description"
              required
            />
          </div>
          <button className="submit-btn" type="submit">
            Place Order
          </button>
        </form>
      </div>

      <div className="orders-section">
        <h2 className="section-title">Current Orders</h2>
        <div className="table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Current Stage</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(MED).map(function (key) {
                return (
                  <tr key={key}>
                    <td>{MED[key].id}</td>
                    <td>{MED[key].name}</td>
                    <td>{MED[key].description}</td>
                    <td className={`stage-cell ${MedStage[key].toLowerCase().replace(/\s+/g, '-')}`}>
                      {MedStage[key]}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AddMed;