import React from "react";
import ReactDOM from "react-dom";
import HealthCare from "./HealthCare";
import web3 from "./web3";

export default class Patient extends React.Component {
  constructor(props) {
    super(props);
    this.handleRecordSubmit = this.handleRecordSubmit.bind(this);
    this.handleClaimSubmit = this.handleClaimSubmit.bind(this);
    this.state = {
      recID: "",
      price: "",
      tname: "",
      dDate: "",
      hname: "",
      message: "",
      records: [], // Initialize with an empty array
    };
  }

  async componentDidMount() {
    // Fetch existing records
    await this.fetchRecords();
  }

  async fetchRecords() {
    try {
      const accounts = await web3.eth.getAccounts();
      const patientAddress = accounts[0];
      const recordsCount = await HealthCare.methods.recordsCount().call();
      const records = [];
      for (let i = 1; i <= recordsCount; i++) {
        const record = await HealthCare.methods._records(i).call();
        if (record.isValue && record.pAddr === patientAddress) {
          records.push(record);
        }
      }
      this.setState({ records });
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  }

  async handleRecordSubmit(event) {
    event.preventDefault();
    try {
      const accounts = await web3.eth.getAccounts();
      await HealthCare.methods
        .newRecord(
          this.state.recID,
          this.state.price,
          this.state.tname,
          this.state.dDate,
          this.state.hname
        )
        .send({ from: accounts[0], gas: 2100000 });

      // Reset ID and price fields after submission
      this.setState({
        message: "Record created",
        recID: "",
        price: "",
        tname: "",
        dDate: "",
        hname: "",
      });

      // Fetch the newly created record from the contract
      const newRecord = await HealthCare.methods
        ._records(this.state.recID)
        .call();

      // Update state with the new record
      this.setState({
        recID: newRecord.ID,
        price: newRecord.price,
        tname: newRecord.testName,
        dDate: newRecord.date,
        hname: newRecord.hospitalName,
      });

      // Fetch updated records after submitting new record
      await this.fetchRecords();
    } catch (error) {
      console.error("Error creating record:", error);
      this.setState({ message: "Error creating record" });
    }
  }

  async handleClaimSubmit(event, recordId) {
    event.preventDefault();
    try {
      const accounts = await web3.eth.getAccounts();
      const record = this.state.records.find(
        (record) => record.ID === recordId
      );
      if (record && record.hospitalApproved && record.labApproved) {
        await HealthCare.methods
          .submitClaim(recordId)
          .send({ from: accounts[0], gas: 2100000 });
        this.setState({ message: "Claim submitted" });
        // Fetch updated records after submitting claim
        await this.fetchRecords();
      } else {
        this.setState({ message: "Record not signed by both authorities" });
      }
    } catch (error) {
      console.error("Error submitting claim:", error);
      this.setState({ message: "Error submitting claim" });
    }
  }

  render() {
    return (
      <div className="container container-fluid login-conatiner">
        <div className="col-md-4">
          <div className="login-form">
            <form method="post" autoComplete="off">
              <h2 className="text-center">New Record</h2>
              <div className="form-group">
                <input
                  type="text"
                  value={this.state.recID}
                  onChange={(event) =>
                    this.setState({ recID: event.target.value })
                  }
                  className="form-control"
                  placeholder="ID"
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  value={this.state.price}
                  onChange={(event) =>
                    this.setState({ price: event.target.value })
                  }
                  className="form-control"
                  placeholder="Price"
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  value={this.state.tname}
                  onChange={(event) =>
                    this.setState({ tname: event.target.value })
                  }
                  className="form-control"
                  placeholder="Name"
                />
              </div>
              <div className="form-group">
                <input
                  type="Date"
                  value={this.state.dDate}
                  onChange={(event) =>
                    this.setState({ dDate: event.target.value })
                  }
                  className="form-control"
                  placeholder="Date"
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  value={this.state.hname}
                  onChange={(event) =>
                    this.setState({ hname: event.target.value })
                  }
                  className="form-control"
                  placeholder="Hospital Name"
                />
              </div>

              <div className="form-group">
                <button
                  className="btn btn-primary btn-block"
                  onClick={this.handleRecordSubmit}
                >
                  Record Submit
                </button>
              </div>
              {this.state.message && (
                <p className="alert alert-danger fade in">
                  {this.state.message}
                </p>
              )}
              <div className="clearfix" />
            </form>
          </div>
        </div>

        {/* Display records if available */}
        {this.state.records.length > 0 && (
          <div className="col-md-6 col-md-offset-2">
            <div className="c-list">
              <h2 className="text-center">Records</h2>
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Price</th>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Hospital Name</th>
                    <th>Sign Count</th>
                    <th>Actions</th> {/* Add column for claim submission */}
                  </tr>
                </thead>
                <tbody>
                  {this.state.records.map((record, index) => (
                    <tr key={index}>
                      <td>{record.ID}</td>
                      <td>{record.price}</td>
                      <td>{record.testName}</td>
                      <td>{record.date}</td>
                      <td>{record.hospitalName}</td>
                      <td>{record.signatureCount}</td>
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={(event) =>
                            this.handleClaimSubmit(event, record.ID)
                          }
                          disabled={
                            !record.hospitalApproved || !record.labApproved
                          }
                        >
                          Submit Claim
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }
}
