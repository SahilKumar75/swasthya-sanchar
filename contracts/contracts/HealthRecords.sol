// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title HealthRecords
 * @dev Minimal smart contract for Swasthya Sanchar healthcare records
 */
contract HealthRecords {
    struct Patient {
        address patientAddress;
        string name;
        uint256 dateOfBirth;
        string emergencyProfileHash;
        bool isRegistered;
        uint256 registeredAt;
    }

    struct MedicalRecord {
        uint256 recordId;
        address patient;
        address doctor;
        string recordHash; // IPFS hash or encrypted data reference
        uint256 timestamp;
        bool isActive;
    }

    // State variables
    mapping(address => Patient) public patients;
    mapping(address => bool) public authorizedDoctors; // Global doctor authorization (admin-controlled)
    mapping(uint256 => MedicalRecord) public medicalRecords;
    mapping(address => uint256[]) public patientRecords;
    
    // Patient-controlled access permissions
    mapping(address => mapping(address => bool)) public patientAuthorizedDoctors; // patient => doctor => authorized
    mapping(address => mapping(address => uint256)) public accessGrantedAt; // patient => doctor => timestamp
    mapping(address => address[]) private patientDoctorList; // patient => list of authorized doctors
    
    uint256 public recordCounter;
    address public admin;

    // Events
    event PatientRegistered(address indexed patient, string name, uint256 timestamp);
    event PatientUpdated(address indexed patient, string name, uint256 timestamp);
    event DoctorAuthorized(address indexed doctor, uint256 timestamp);
    event DoctorAccessGranted(address indexed patient, address indexed doctor, uint256 timestamp);
    event DoctorAccessRevoked(address indexed patient, address indexed doctor, uint256 timestamp);
    event RecordCreated(uint256 indexed recordId, address indexed patient, address indexed doctor);
    event RecordUpdated(uint256 indexed recordId, string newRecordHash);

    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this");
        _;
    }

    modifier onlyAuthorizedDoctor() {
        require(authorizedDoctors[msg.sender], "Only authorized doctors");
        _;
    }

    modifier onlyPatient() {
        require(patients[msg.sender].isRegistered, "Only registered patients");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    /**
     * @dev Register a new patient
     */
    function registerPatient(
        string memory _name,
        uint256 _dateOfBirth,
        string memory _emergencyProfileHash
    ) external {
        require(!patients[msg.sender].isRegistered, "Patient already registered");
        
        patients[msg.sender] = Patient({
            patientAddress: msg.sender,
            name: _name,
            dateOfBirth: _dateOfBirth,
            emergencyProfileHash: _emergencyProfileHash,
            isRegistered: true,
            registeredAt: block.timestamp
        });

        emit PatientRegistered(msg.sender, _name, block.timestamp);
    }

    /**
     * @dev Update patient information (only registered patients can update their own data)
     */
    function updatePatient(
        string memory _name,
        uint256 _dateOfBirth,
        string memory _emergencyProfileHash
    ) external {
        require(patients[msg.sender].isRegistered, "Patient not registered");
        
        patients[msg.sender].name = _name;
        patients[msg.sender].dateOfBirth = _dateOfBirth;
        patients[msg.sender].emergencyProfileHash = _emergencyProfileHash;

        emit PatientUpdated(msg.sender, _name, block.timestamp);
    }

    /**
     * @dev Authorize a doctor (admin only)
     */
    function authorizeDoctor(address _doctor) external onlyAdmin {
        require(!authorizedDoctors[_doctor], "Doctor already authorized");
        authorizedDoctors[_doctor] = true;
        emit DoctorAuthorized(_doctor, block.timestamp);
    }

    /**
     * @dev Grant access to a doctor (patient-controlled)
     */
    function grantDoctorAccess(address _doctor) external onlyPatient {
        require(_doctor != address(0), "Invalid doctor address");
        require(!patientAuthorizedDoctors[msg.sender][_doctor], "Doctor already authorized");
        
        patientAuthorizedDoctors[msg.sender][_doctor] = true;
        accessGrantedAt[msg.sender][_doctor] = block.timestamp;
        patientDoctorList[msg.sender].push(_doctor);
        
        emit DoctorAccessGranted(msg.sender, _doctor, block.timestamp);
    }

    /**
     * @dev Revoke access from a doctor (patient-controlled)
     */
    function revokeDoctorAccess(address _doctor) external onlyPatient {
        require(patientAuthorizedDoctors[msg.sender][_doctor], "Doctor not authorized");
        
        patientAuthorizedDoctors[msg.sender][_doctor] = false;
        
        emit DoctorAccessRevoked(msg.sender, _doctor, block.timestamp);
    }

    /**
     * @dev Check if a doctor is authorized by a specific patient
     */
    function isDoctorAuthorized(address _patient, address _doctor) public view returns (bool) {
        return patientAuthorizedDoctors[_patient][_doctor];
    }

    /**
     * @dev Get list of doctors authorized by a patient
     */
    function getAuthorizedDoctors(address _patient) external view returns (address[] memory) {
        return patientDoctorList[_patient];
    }

    /**
     * @dev Create a new medical record (requires patient-specific authorization)
     */
    function createRecord(
        address _patient,
        string memory _recordHash
    ) external returns (uint256) {
        require(patients[_patient].isRegistered, "Patient not registered");
        require(patientAuthorizedDoctors[_patient][msg.sender], "Not authorized by patient");
        
        recordCounter++;
        
        medicalRecords[recordCounter] = MedicalRecord({
            recordId: recordCounter,
            patient: _patient,
            doctor: msg.sender,
            recordHash: _recordHash,
            timestamp: block.timestamp,
            isActive: true
        });

        patientRecords[_patient].push(recordCounter);
        
        emit RecordCreated(recordCounter, _patient, msg.sender);
        return recordCounter;
    }

    /**
     * @dev Get patient information
     */
    function getPatient(address _patient) external view returns (Patient memory) {
        require(patients[_patient].isRegistered, "Patient not registered");
        return patients[_patient];
    }

    /**
     * @dev Get all record IDs for a patient
     */
    function getPatientRecords(address _patient) external view returns (uint256[] memory) {
        return patientRecords[_patient];
    }

    /**
     * @dev Get specific medical record
     */
    function getRecord(uint256 _recordId) external view returns (MedicalRecord memory) {
        require(medicalRecords[_recordId].isActive, "Record does not exist");
        return medicalRecords[_recordId];
    }
}
