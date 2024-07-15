// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HealthCare {
    address public hospitalAdmin;
    address public labAdmin;
    address public insuranceAdmin;

    struct Record {
        uint256 ID;
        uint256 price; // This stores the amount entered by the patient
        uint256 signatureCount;
        string testName;
        string date;
        string hospitalName;
        bool isValue;
        bool hospitalApproved;
        bool labApproved;
        address pAddr;
        mapping (address => uint256) signatures;
    }

    constructor(address _labAdmin, address _insuranceAdmin) {
        hospitalAdmin = msg.sender;
        labAdmin = _labAdmin;
        insuranceAdmin = _insuranceAdmin;
    }

    // Mapping to store records
    mapping (uint256=> Record) public _records;
    uint256 public recordsCount;

    event recordCreated(uint256 ID, string testName, string date, string hospitalName, uint256 price);
    event recordSigned(uint256 ID, string testName, string date, string hospitalName, uint256 price);
    event claimSubmitted(uint256 ID, address patient);
    event claimProcessed(uint256 ID, address patient, uint256 amount);

    modifier signOnly {
        require (msg.sender == hospitalAdmin || msg.sender == labAdmin, "You are not authorized to sign this.");
        _;
    }

    modifier checkAuthBeforeSign(uint256 _ID) {
        require(_records[_ID].isValue, "Record does not exist");
        require(address(0) != _records[_ID].pAddr, "Address is zero");
        require(msg.sender != _records[_ID].pAddr, "You are not authorized to perform this action");
        require(_records[_ID].signatures[msg.sender] != 1, "Same person cannot sign twice.");
        _;
    }

    modifier validateRecord(uint256 _ID) {
        // Only allows new records to be created
        require(!_records[_ID].isValue, "Record with this ID already exists");
        _;
    }

    // Create new record
    function newRecord (
        uint256 _ID,
        uint256 price, // Added the price parameter here
        string memory _tName,
        string memory _date,
        string memory hName
    )
    validateRecord(_ID) public {
        Record storage _newrecord = _records[_ID];
        _newrecord.pAddr = msg.sender;
        _newrecord.ID = _ID;
        _newrecord.testName = _tName;
        _newrecord.date = _date;
        _newrecord.hospitalName = hName;
        _newrecord.price = price; // Store the patient's entered amount
        _newrecord.isValue = true;
        _newrecord.signatureCount = 0;

        recordsCount++;
        emit recordCreated(_newrecord.ID, _tName, _date, hName, price);
    }

    // Function to sign a record
    function signRecord(uint256 _ID) signOnly checkAuthBeforeSign(_ID) public {
        Record storage records = _records[_ID];
        records.signatures[msg.sender] = 1;
        records.signatureCount++;

        // Check if the record has been signed by both the authorities to process insurance claim
        if (msg.sender == hospitalAdmin) {
            records.hospitalApproved = true;
        } else if (msg.sender == labAdmin) {
            records.labApproved = true;
        }

        if (records.hospitalApproved && records.labApproved) {
            emit recordSigned(records.ID, records.testName, records.date, records.hospitalName, records.price);
        }
    }

    // Function for patient to submit a claim
    function submitClaim(uint256 _ID) public {
        Record storage record = _records[_ID];
        require(record.isValue, "Record does not exist");
        require(record.hospitalApproved && record.labApproved, "Record not fully approved");
        emit claimSubmitted(_ID, msg.sender);
    }

    // Function for insurance admin to process claim and transfer funds to patient
    function processClaim(uint256 _ID) public payable {
        Record storage record = _records[_ID];
        require(record.isValue, "Record does not exist");
        require(msg.sender == insuranceAdmin, "Only insurance admin can process claim");

        // Retrieve the claim amount from the record
        uint256 claimAmount = record.price;

        // Transfer funds from insurance admin to patient
        address payable patientAddr = payable(record.pAddr);
        patientAddr.transfer(claimAmount);

        // Emit claim processed event
        emit claimProcessed(_ID, record.pAddr, claimAmount);

        // Reset record data
        delete _records[_ID];
    }
}

