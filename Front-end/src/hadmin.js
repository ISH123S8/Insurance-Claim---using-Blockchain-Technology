import React, { useState, useEffect } from "react";
import HealthCare from "./HealthCare";
import web3 from "./web3";

const Hadmin = () => {
  const [recID, setRecID] = useState("");
  const [message, setMessage] = useState("");
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      const recordsCount = await HealthCare.methods.recordsCount().call();
      const records = [];
      for (let i = 1; i <= recordsCount; i++) {
        const record = await HealthCare.methods._records(i).call();
        if (record.isValue && record.pAddr === accounts[0]) {
          records.push(record);
        }
      }
      setRecords(records);
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  const handleClick = async (event) => {
    event.preventDefault();
    try {
      const accounts = await web3.eth.getAccounts();
      await HealthCare.methods
        .signRecord(recID)
        .send({ from: accounts[0], gas: 2100000 });
      setMessage("Record approved!");
      fetchRecords(); // Fetch records again after approval
    } catch (error) {
      console.error("Error approving record:", error);
      setMessage("Error approving record");
    }
  };

  return (
    <div className="container container-fluid login-conatiner">
      <div className="col-md-4">
        <h3 className="text-center">Hospital Admin</h3>
        <div className="login-form">
          <h4 className="text-center">Approve Medical Record</h4>
          <div className="form-group">
            <input
              type="number"
              value={recID}
              onChange={(event) => setRecID(event.target.value)}
              className="form-control"
              placeholder="ID"
            />
          </div>
          <div className="form-group">
            <button className="btn btn-primary btn-block" onClick={handleClick}>
              Approve
            </button>
          </div>
          {message && <p className="alert alert-danger fade in">{message}</p>}
        </div>
      </div>
      <div className="col-md-6 col-md-offset-2">
        <div className="c-list">
          <h2 className="text-center">Records</h2>
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Date</th>
                <th>Hospital Name</th>
                <th>Price</th>
                <th>Sign Count</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <tr key={index}>
                  <td>{record.ID}</td>
                  <td>{record.testName}</td>
                  <td>{record.date}</td>
                  <td>{record.hospitalName}</td>
                  <td>{record.price}</td>
                  <td>{record.signatureCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Hadmin;
