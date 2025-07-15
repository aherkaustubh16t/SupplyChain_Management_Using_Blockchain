import React, { useState, useEffect } from 'react';
import Web3 from "web3";
import SupplyChainABI from "./artifacts/SupplyChain.json"
import { useHistory } from "react-router-dom"
import "./AssignRoles.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AssignRoles() {
    const history = useHistory()
    useEffect(() => {
        loadWeb3();
        loadBlockchaindata();
    }, [])
    const [currentaccount, setCurrentaccount] = useState("");
    const [loader, setloader] = useState(true);
    const [SupplyChain, setSupplyChain] = useState();
    const [RMSname, setRMSname] = useState();
    const [MANname, setMANname] = useState();
    const [DISname, setDISname] = useState();
    const [RETname, setRETname] = useState();
    const [RMSplace, setRMSplace] = useState();
    const [MANplace, setMANplace] = useState();
    const [DISplace, setDISplace] = useState();
    const [RETplace, setRETplace] = useState();
    const [RMSaddress, setRMSaddress] = useState();
    const [MANaddress, setMANaddress] = useState();
    const [DISaddress, setDISaddress] = useState();
    const [RETaddress, setRETaddress] = useState();
    const [RMS, setRMS] = useState();
    const [MAN, setMAN] = useState();
    const [DIS, setDIS] = useState();
    const [RET, setRET] = useState();

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
            const supplychain = new web3.eth.Contract(SupplyChainABI.abi, networkData.address);
            setSupplyChain(supplychain);
            var i;
            const rmsCtr = await supplychain.methods.rmsCtr().call();
            const rms = {};
            for (i = 0; i < rmsCtr; i++) {
                rms[i] = await supplychain.methods.RMS(i + 1).call();
            }
            setRMS(rms);
            const manCtr = await supplychain.methods.manCtr().call();
            const man = {};
            for (i = 0; i < manCtr; i++) {
                man[i] = await supplychain.methods.MAN(i + 1).call();
            }
            setMAN(man);
            const disCtr = await supplychain.methods.disCtr().call();
            const dis = {};
            for (i = 0; i < disCtr; i++) {
                dis[i] = await supplychain.methods.DIS(i + 1).call();
            }
            setDIS(dis);
            const retCtr = await supplychain.methods.retCtr().call();
            const ret = {};
            for (i = 0; i < retCtr; i++) {
                ret[i] = await supplychain.methods.RET(i + 1).call();
            }
            setRET(ret);
            setloader(false);
        }
        else {
            window.alert('The smart contract is not deployed to current network')
        }
    }

    if (loader) {
        return (
            <div className="loader-container">
                <div className="spinner"></div>
                <h1 className="loading-text">Loading...</h1>
            </div>
        )
    }

    const redirect_to_home = () => {
        history.push('/')
    }

    // Handler functions remain the same
    const handlerChangeAddressRMS = (event) => { setRMSaddress(event.target.value); }
    const handlerChangePlaceRMS = (event) => { setRMSplace(event.target.value); }
    const handlerChangeNameRMS = (event) => { setRMSname(event.target.value); }
    const handlerChangeAddressMAN = (event) => { setMANaddress(event.target.value); }
    const handlerChangePlaceMAN = (event) => { setMANplace(event.target.value); }
    const handlerChangeNameMAN = (event) => { setMANname(event.target.value); }
    const handlerChangeAddressDIS = (event) => { setDISaddress(event.target.value); }
    const handlerChangePlaceDIS = (event) => { setDISplace(event.target.value); }
    const handlerChangeNameDIS = (event) => { setDISname(event.target.value); }
    const handlerChangeAddressRET = (event) => { setRETaddress(event.target.value); }
    const handlerChangePlaceRET = (event) => { setRETplace(event.target.value); }
    const handlerChangeNameRET = (event) => { setRETname(event.target.value); }

    const handlerSubmitRMS = async (event) => {
        event.preventDefault();
        try {
            var receipt = await SupplyChain.methods.addRMS(RMSaddress, RMSname, RMSplace).send({ from: currentaccount });
            if (receipt) {
                toast.success('Raw Material Supplier added successfully!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                loadBlockchaindata();

                // Clear form
                setRMSaddress('');
                setRMSname('');
                setRMSplace('');
            }
        }
        catch (err) {
            toast.error(`Error: ${err.message}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }

    const handlerSubmitMAN = async (event) => {
        event.preventDefault();
        try {
            var receipt = await SupplyChain.methods.addManufacturer(MANaddress, MANname, MANplace).send({ from: currentaccount });
            if (receipt) {
                toast.success('Manufacturer added successfully!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                loadBlockchaindata();
                // Clear form
                setMANaddress('');
                setMANname('');
                setMANplace('');
            }
        }
        catch (err) {
            toast.error(`Error: ${err.message}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }

    const handlerSubmitDIS = async (event) => {
        event.preventDefault();
        try {
            var receipt = await SupplyChain.methods.addDistributor(DISaddress, DISname, DISplace).send({ from: currentaccount });
            if (receipt) {
                toast.success('Distributor added successfully!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                loadBlockchaindata();
                // Clear form
                setDISaddress('');
                setDISname('');
                setDISplace('');
            }
        }
        catch (err) {
            toast.error(`Error: ${err.message}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }

    const handlerSubmitRET = async (event) => {
        event.preventDefault();
        try {
            var receipt = await SupplyChain.methods.addRetailer(RETaddress, RETname, RETplace).send({ from: currentaccount });
            if (receipt) {
                toast.success('Retailer added successfully!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                loadBlockchaindata();
                // Clear form
                setRETaddress('');
                setRETname('');
                setRETplace('');
            }
        }
        catch (err) {
            toast.error(`Error: ${err.message}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }

    return (
        <div className="assign-roles-container">
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div className="header-section">
                <div className="account-info">
                    <span className="account-address"><b>Current Account:</b> {currentaccount}</span>
                    <button onClick={redirect_to_home} className="home-btn">HOME</button>
                </div>
                <h1 className="page-title">Supply Chain Role Management</h1>
            </div>

            <div className="role-section">
                <h2 className="role-title">Raw Material Suppliers</h2>
                <form onSubmit={handlerSubmitRMS} className="role-form">
                    <input className="form-input" type="text" onChange={handlerChangeAddressRMS} value={RMSaddress || ''} placeholder="Ethereum Address" required />
                    <input className="form-input" type="text" onChange={handlerChangeNameRMS} value={RMSname || ''} placeholder="Supplier Name" required />
                    <input className="form-input" type="text" onChange={handlerChangePlaceRMS} value={RMSplace || ''} placeholder="Location" required />
                    <button className="submit-btn" type="submit">Register Supplier</button>
                </form>
                <div className="table-container">
                    <table className="role-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Location</th>
                                <th>Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(RMS).map(function (key) {
                                return (
                                    <tr key={key}>
                                        <td>{RMS[key].id}</td>
                                        <td>{RMS[key].name}</td>
                                        <td>{RMS[key].place}</td>
                                        <td className="address-cell">{RMS[key].addr}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="role-section">
                <h2 className="role-title">Manufacturers</h2>
                <form onSubmit={handlerSubmitMAN} className="role-form">
                    <input className="form-input" type="text" onChange={handlerChangeAddressMAN} value={MANaddress || ''} placeholder="Ethereum Address" required />
                    <input className="form-input" type="text" onChange={handlerChangeNameMAN} value={MANname || ''} placeholder="Manufacturer Name" required />
                    <input className="form-input" type="text" onChange={handlerChangePlaceMAN} value={MANplace || ''} placeholder="Location" required />
                    <button className="submit-btn" type="submit">Register Manufacturer</button>
                </form>
                <div className="table-container">
                    <table className="role-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Location</th>
                                <th>Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(MAN).map(function (key) {
                                return (
                                    <tr key={key}>
                                        <td>{MAN[key].id}</td>
                                        <td>{MAN[key].name}</td>
                                        <td>{MAN[key].place}</td>
                                        <td className="address-cell">{MAN[key].addr}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="role-section">
                <h2 className="role-title">Distributors</h2>
                <form onSubmit={handlerSubmitDIS} className="role-form">
                    <input className="form-input" type="text" onChange={handlerChangeAddressDIS} value={DISaddress || ''} placeholder="Ethereum Address" required />
                    <input className="form-input" type="text" onChange={handlerChangeNameDIS} value={DISname || ''} placeholder="Distributor Name" required />
                    <input className="form-input" type="text" onChange={handlerChangePlaceDIS} value={DISplace || ''} placeholder="Location" required />
                    <button className="submit-btn" type="submit">Register Distributor</button>
                </form>
                <div className="table-container">
                    <table className="role-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Location</th>
                                <th>Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(DIS).map(function (key) {
                                return (
                                    <tr key={key}>
                                        <td>{DIS[key].id}</td>
                                        <td>{DIS[key].name}</td>
                                        <td>{DIS[key].place}</td>
                                        <td className="address-cell">{DIS[key].addr}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="role-section">
                <h2 className="role-title">Retailers</h2>
                <form onSubmit={handlerSubmitRET} className="role-form">
                    <input className="form-input" type="text" onChange={handlerChangeAddressRET} value={RETaddress || ''} placeholder="Ethereum Address" required />
                    <input className="form-input" type="text" onChange={handlerChangeNameRET} value={RETname || ''} placeholder="Retailer Name" required />
                    <input className="form-input" type="text" onChange={handlerChangePlaceRET} value={RETplace || ''} placeholder="Location" required />
                    <button className="submit-btn" type="submit">Register Retailer</button>
                </form>
                <div className="table-container">
                    <table className="role-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Location</th>
                                <th>Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(RET).map(function (key) {
                                return (
                                    <tr key={key}>
                                        <td>{RET[key].id}</td>
                                        <td>{RET[key].name}</td>
                                        <td>{RET[key].place}</td>
                                        <td className="address-cell">{RET[key].addr}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default AssignRoles