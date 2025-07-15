import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Web3 from "web3";
import SupplyChainABI from "./artifacts/SupplyChain.json";
import "./Track.css"; // We'll create this CSS file

function Track() {
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
  const [RMS, setRMS] = useState();
  const [MAN, setMAN] = useState();
  const [DIS, setDIS] = useState();
  const [RET, setRET] = useState();
  const [currentTrackView, setCurrentTrackView] = useState(null);

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
        med[i + 1] = await supplychain.methods.MedicineStock(i + 1).call();
        medStage[i + 1] = await supplychain.methods.showStage(i + 1).call();
      }
      setMED(med);
      setMedStage(medStage);

      const rmsCtr = await supplychain.methods.rmsCtr().call();
      const rms = {};
      for (i = 0; i < rmsCtr; i++) {
        rms[i + 1] = await supplychain.methods.RMS(i + 1).call();
      }
      setRMS(rms);

      const manCtr = await supplychain.methods.manCtr().call();
      const man = {};
      for (i = 0; i < manCtr; i++) {
        man[i + 1] = await supplychain.methods.MAN(i + 1).call();
      }
      setMAN(man);

      const disCtr = await supplychain.methods.disCtr().call();
      const dis = {};
      for (i = 0; i < disCtr; i++) {
        dis[i + 1] = await supplychain.methods.DIS(i + 1).call();
      }
      setDIS(dis);

      const retCtr = await supplychain.methods.retCtr().call();
      const ret = {};
      for (i = 0; i < retCtr; i++) {
        ret[i + 1] = await supplychain.methods.RET(i + 1).call();
      }
      setRET(ret);

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

  const renderTrackView = () => {
    if (!currentTrackView) return null;

    const stage = MED[ID].stage;
    const stageComponents = [];

    // Always show the medicine info
    stageComponents.push(
      <div key="medicine-info" className="track-info-card">
        <h3 className="track-title">Goods Information</h3>
        <div className="track-details">
          <p><span className="detail-label">Goods ID:</span> {MED[ID].id}</p>
          <p><span className="detail-label">Name:</span> {MED[ID].name}</p>
          <p><span className="detail-label">Description:</span> {MED[ID].description}</p>
          <p><span className="detail-label">Current Stage:</span>
            <span className={`stage-badge ${MedStage[ID].toLowerCase().replace(/\s+/g, '-')}`}>
              {MedStage[ID]}
            </span>
          </p>
        </div>
      </div>
    );

    // Show RMS if available
    if (stage >= 1 && RMS[MED[ID].RMSid]) {
      stageComponents.push(
        <div key="rms" className="track-stage-card">
          <div className="stage-arrow">↓</div>
          <div className="track-info-card">
            <h4 className="track-subtitle">Raw Materials Supplied by</h4>
            <div className="track-details">
              <p><span className="detail-label">Supplier ID:</span> {RMS[MED[ID].RMSid].id}</p>
              <p><span className="detail-label">Name:</span> {RMS[MED[ID].RMSid].name}</p>
              <p><span className="detail-label">Location:</span> {RMS[MED[ID].RMSid].place}</p>
            </div>
          </div>
        </div>
      );
    }

    // Show Manufacturer if available
    if (stage >= 2 && MAN[MED[ID].MANid]) {
      stageComponents.push(
        <div key="man" className="track-stage-card">
          <div className="stage-arrow">↓</div>
          <div className="track-info-card">
            <h4 className="track-subtitle">Manufactured by</h4>
            <div className="track-details">
              <p><span className="detail-label">Manufacturer ID:</span> {MAN[MED[ID].MANid].id}</p>
              <p><span className="detail-label">Name:</span> {MAN[MED[ID].MANid].name}</p>
              <p><span className="detail-label">Location:</span> {MAN[MED[ID].MANid].place}</p>
            </div>
          </div>
        </div>
      );
    }

    // Show Distributor if available
    if (stage >= 3 && DIS[MED[ID].DISid]) {
      stageComponents.push(
        <div key="dis" className="track-stage-card">
          <div className="stage-arrow">↓</div>
          <div className="track-info-card">
            <h4 className="track-subtitle">Distributed by</h4>
            <div className="track-details">
              <p><span className="detail-label">Distributor ID:</span> {DIS[MED[ID].DISid].id}</p>
              <p><span className="detail-label">Name:</span> {DIS[MED[ID].DISid].name}</p>
              <p><span className="detail-label">Location:</span> {DIS[MED[ID].DISid].place}</p>
            </div>
          </div>
        </div>
      );
    }

    // Show Retailer if available
    if (stage >= 4 && RET[MED[ID].RETid]) {
      stageComponents.push(
        <div key="ret" className="track-stage-card">
          <div className="stage-arrow">↓</div>
          <div className="track-info-card">
            <h4 className="track-subtitle">Retailed by</h4>
            <div className="track-details">
              <p><span className="detail-label">Retailer ID:</span> {RET[MED[ID].RETid].id}</p>
              <p><span className="detail-label">Name:</span> {RET[MED[ID].RETid].name}</p>
              <p><span className="detail-label">Location:</span> {RET[MED[ID].RETid].place}</p>
            </div>
          </div>
        </div>
      );
    }

    // Show Sold if applicable
    if (stage >= 5) {
      stageComponents.push(
        <div key="sold" className="track-stage-card">
          <div className="stage-arrow">↓</div>
          <div className="track-info-card">
            <h4 className="track-subtitle">Sold to Consumer</h4>
            <div className="track-details">
              <p>This item has been sold to the end consumer.</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="track-view-container">
        <div className="track-flow">
          {stageComponents}
        </div>
        <div className="track-actions">
          <button onClick={() => setCurrentTrackView(null)} className="action-btn">
            Track Another Item
          </button>
          <button onClick={() => history.push("/")} className="home-btn">
            HOME
          </button>
        </div>
      </div>
    );
  };

  const handlerChangeID = (event) => {
    setID(event.target.value);
  };

  const redirect_to_home = () => {
    history.push("/");
  };

  const handlerSubmit = async (event) => {
    event.preventDefault();
    try {
      const ctr = await SupplyChain.methods.medicineCtr().call();
      if (!(ID > 0 && ID <= ctr)) {
        alert("Invalid Goods ID!!!");
        return;
      }
      setCurrentTrackView(MED[ID].stage);
    } catch (err) {
      alert("An error occurred: " + err.message);
    }
  };

  if (currentTrackView !== null) {
    return renderTrackView();
  }

  return (
    <div className="track-container">
      <div className="header-section">
        <div className="account-info">
          <span className="account-address"><b>Current Account:</b> {currentaccount}</span>
          <button onClick={redirect_to_home} className="home-btn">HOME</button>
        </div>
        <h1 className="page-title">Goods Tracking System</h1>
      </div>

      <div className="goods-list-section">
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
                  <tr key={key} onClick={() => setID(key)} className="clickable-row">
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

      <div className="track-form-section">
        <h2 className="section-title">Track Goods by ID</h2>
        <form onSubmit={handlerSubmit} className="track-form">
          <div className="form-group">
            <label htmlFor="goodsId" className="form-label">Enter Goods ID</label>
            <input
              id="goodsId"
              className="form-input"
              type="text"
              onChange={handlerChangeID}
              placeholder="Enter Goods ID"
              required
              value={ID || ''}
            />
          </div>
          <button className="submit-btn" type="submit">
            Track Goods
          </button>
        </form>
      </div>
    </div>
  );
}

export default Track;