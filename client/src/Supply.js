import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Web3 from "web3";
import SupplyChainABI from "./artifacts/SupplyChain.json";
import "./Supply.css"; // We'll create this CSS file

function Supply() {
  const history = useHistory();
  useEffect(() => {
    loadWeb3();
    loadBlockchaindata();
  }, []);

  const [currentaccount, setCurrentaccount] = useState("");
  const [loader, setloader] = useState(true);
  const [SupplyChain, setSupplyChain] = useState();
  const [MED, setMED] = useState();
  const [MedStage, setMedStage] = useState();
  const [ID, setID] = useState();

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

  const handlerChangeID = (event) => {
    setID(event.target.value);
  };

  const handleStageAction = async (actionFunction) => {
    try {
      const receipt = await actionFunction(ID).send({ from: currentaccount });
      if (receipt) {
        loadBlockchaindata();
      }
    } catch (err) {
      alert("An error occurred: " + err.message);
    }
  };

  return (
    <div className="supply-container">
      <div className="header-section">
        <div className="account-info">
          <span className="account-address"><b>Current Account:</b> {currentaccount}</span>
          <button onClick={redirect_to_home} className="home-btn">HOME</button>
        </div>
        <h1 className="page-title">Supply Chain Flow Management</h1>
      </div>

      <div className="flow-diagram">
        <div className="flow-steps">
          <div className="flow-step">1. Goods Order</div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">2. Raw Material Supply</div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">3. Manufacturing</div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">4. Distribution</div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">5. Retail</div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">6. Consumer</div>
        </div>
      </div>

      <div className="goods-section">
        <h2 className="section-title">Current Goods in Supply Chain</h2>
        <div className="table-container">
          <table className="goods-table">
            <thead>
              <tr>
                <th>Goods ID</th>
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

      <div className="actions-section">
        <div className="action-card">
          <h3 className="action-title">Step 1: Supply Raw Materials</h3>
          <p className="action-description">Only a registered Raw Material Supplier can perform this step</p>
          <form onSubmit={(e) => { e.preventDefault(); handleStageAction(SupplyChain.methods.RMSsupply); }}>
            <input
              className="form-input"
              type="text"
              onChange={handlerChangeID}
              placeholder="Enter Goods ID"
              required
            />
            <button className="action-btn" type="submit">
              Supply Materials
            </button>
          </form>
        </div>

        <div className="action-card">
          <h3 className="action-title">Step 2: Manufacture</h3>
          <p className="action-description">Only a registered Manufacturer can perform this step</p>
          <form onSubmit={(e) => { e.preventDefault(); handleStageAction(SupplyChain.methods.Manufacturing); }}>
            <input
              className="form-input"
              type="text"
              onChange={handlerChangeID}
              placeholder="Enter Goods ID"
              required
            />
            <button className="action-btn" type="submit">
              Manufacture
            </button>
          </form>
        </div>

        <div className="action-card">
          <h3 className="action-title">Step 3: Distribute</h3>
          <p className="action-description">Only a registered Distributor can perform this step</p>
          <form onSubmit={(e) => { e.preventDefault(); handleStageAction(SupplyChain.methods.Distribute); }}>
            <input
              className="form-input"
              type="text"
              onChange={handlerChangeID}
              placeholder="Enter Goods ID"
              required
            />
            <button className="action-btn" type="submit">
              Distribute
            </button>
          </form>
        </div>

        <div className="action-card">
          <h3 className="action-title">Step 4: Retail</h3>
          <p className="action-description">Only a registered Retailer can perform this step</p>
          <form onSubmit={(e) => { e.preventDefault(); handleStageAction(SupplyChain.methods.Retail); }}>
            <input
              className="form-input"
              type="text"
              onChange={handlerChangeID}
              placeholder="Enter Goods ID"
              required
            />
            <button className="action-btn" type="submit">
              Retail
            </button>
          </form>
        </div>

        <div className="action-card">
          <h3 className="action-title">Step 5: Mark as Sold</h3>
          <p className="action-description">Only a registered Retailer can perform this step</p>
          <form onSubmit={(e) => { e.preventDefault(); handleStageAction(SupplyChain.methods.sold); }}>
            <input
              className="form-input"
              type="text"
              onChange={handlerChangeID}
              placeholder="Enter Goods ID"
              required
            />
            <button className="action-btn" type="submit">
              Mark as Sold
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Supply;