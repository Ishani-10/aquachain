// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title CarbonRegistry
 * @dev A smart contract for a blockchain-based Blue Carbon Registry and MRV (Monitoring, Reporting, and Verification) System.
 * It allows authorized entities to register blue carbon projects, manage their lifecycle, and facilitate verification.
 * Only the contract owner (e.g., MOES/NCCR) can authorize new verifiers.
 */
contract CarbonRegistry is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    // --- State Variables ---

    Counters.Counter private _projectIdCounter; // Unique ID for each project
    Counters.Counter private _verifierIdCounter; // Unique ID for each verifier

    // Enums for project status and ecosystem types
    enum ProjectStatus { Pending, SubmittedForVerification, UnderReview, Verified, Rejected, Completed }
    enum EcosystemType { Mangrove, SaltMarsh, Seagrass, CoralReef, Other }

    // Struct to hold project details
    struct CarbonProject {
        uint256 id;
        address registrant;
        string name;
        string locationData; // Encoded GPS, coordinates, etc.
        string description;
        EcosystemType ecosystem;
        uint256 estimatedCarbonSequestration; // In tonnes of CO2e
        uint256 registrationDate;
        ProjectStatus status;
        uint256 lastStatusUpdate;
        address currentVerifier; // Address of the verifier currently reviewing
        string minioUrl; // URL to off-chain data (images, videos, detailed reports in MinIO)
        string dataHash; // IPFS/MinIO hash of the off-chain data, for integrity check
    }

    // Struct to hold verifier details
    struct Verifier {
        uint256 id;
        string name;
        address verifierAddress;
        bool isAuthorized;
        uint256 authorizedDate;
    }

    // Mappings to store projects and verifiers
    mapping(uint256 => CarbonProject) public projects;
    mapping(address => uint256) public projectIdByRegistrant; // For quick lookup of a single project by registrant
    mapping(address => Verifier) public verifiers;
    mapping(uint256 => address) public verifierAddressById;

    // --- Events ---

    event ProjectRegistered(
        uint256 indexed projectId,
        address indexed registrant,
        string name,
        EcosystemType ecosystem,
        uint256 estimatedCarbonSequestration,
        string minioUrl,
        string dataHash
    );
    event ProjectStatusUpdated(
        uint256 indexed projectId,
        ProjectStatus newStatus,
        address indexed actor,
        string reason
    );
    event VerifierAuthorized(uint256 indexed verifierId, address indexed verifierAddress, string name);
    event VerifierRevoked(uint256 indexed verifierId, address indexed verifierAddress);


    // --- Constructor ---

    constructor() Ownable(msg.sender) {
        // Owner (deployer) is typically MOES/NCCR or an authorized admin
    }


    // --- Modifiers ---

    modifier onlyVerifier() {
        require(verifiers[msg.sender].isAuthorized, "Not an authorized verifier");
        _;
    }


    // --- External / Public Functions ---

    /**
     * @dev Registers a new blue carbon restoration project.
     * @param _name Name of the project.
     * @param _locationData Encoded location details (e.g., GPS coordinates, geohash).
     * @param _description Detailed description of the project.
     * @param _ecosystemType Type of ecosystem being restored.
     * @param _estimatedCarbonSequestration Estimated CO2e sequestration in tonnes.
     * @param _minioUrl URL to off-chain data stored in MinIO.
     * @param _dataHash Hash of the off-chain data for integrity.
     */
    function registerProject(
        string memory _name,
        string memory _locationData,
        string memory _description,
        EcosystemType _ecosystemType,
        uint256 _estimatedCarbonSequestration,
        string memory _minioUrl,
        string memory _dataHash
    ) external nonReentrant returns (uint256) {
        _projectIdCounter.increment();
        uint256 newProjectId = _projectIdCounter.current();

        projects[newProjectId] = CarbonProject({
            id: newProjectId,
            registrant: msg.sender,
            name: _name,
            locationData: _locationData,
            description: _description,
            ecosystem: _ecosystemType,
            estimatedCarbonSequestration: _estimatedCarbonSequestration,
            registrationDate: block.timestamp,
            status: ProjectStatus.Pending, // Initial status
            lastStatusUpdate: block.timestamp,
            currentVerifier: address(0), // No verifier assigned initially
            minioUrl: _minioUrl,
            dataHash: _dataHash
        });

        projectIdByRegistrant[msg.sender] = newProjectId; // Link registrant to project

        emit ProjectRegistered(
            newProjectId,
            msg.sender,
            _name,
            _ecosystemType,
            _estimatedCarbonSequestration,
            _minioUrl,
            _dataHash
        );

        return newProjectId;
    }

    /**
     * @dev Allows project registrant to submit their project for verification.
     * @param _projectId The ID of the project to submit.
     */
    function submitForVerification(uint256 _projectId) external nonReentrant {
        require(projects[_projectId].registrant == msg.sender, "Only project registrant can submit for verification");
        require(
            projects[_projectId].status == ProjectStatus.Pending || projects[_projectId].status == ProjectStatus.Rejected,
            "Project not in a state to be submitted for verification"
        );

        projects[_projectId].status = ProjectStatus.SubmittedForVerification;
        projects[_projectId].lastStatusUpdate = block.timestamp;
        emit ProjectStatusUpdated(_projectId, ProjectStatus.SubmittedForVerification, msg.sender, "Project submitted for verification");
    }

    /**
     * @dev Allows an authorized verifier to mark a project as under review.
     * @param _projectId The ID of the project to review.
     */
    function markUnderReview(uint256 _projectId) external onlyVerifier nonReentrant {
        require(
            projects[_projectId].status == ProjectStatus.SubmittedForVerification,
            "Project not in 'Submitted for Verification' status"
        );
        require(projects[_projectId].currentVerifier == address(0), "Project already under review by another verifier");

        projects[_projectId].status = ProjectStatus.UnderReview;
        projects[_projectId].currentVerifier = msg.sender;
        projects[_projectId].lastStatusUpdate = block.timestamp;
        emit ProjectStatusUpdated(_projectId, ProjectStatus.UnderReview, msg.sender, "Project marked as under review");
    }

    /**
     * @dev Allows the assigned verifier to verify a project.
     * @param _projectId The ID of the project to verify.
     */
    function verifyProject(uint256 _projectId) external onlyVerifier nonReentrant {
        require(projects[_projectId].currentVerifier == msg.sender, "Only assigned verifier can verify this project");
        require(projects[_projectId].status == ProjectStatus.UnderReview, "Project not in 'Under Review' status");

        projects[_projectId].status = ProjectStatus.Verified;
        projects[_projectId].currentVerifier = address(0); // Verifier task completed
        projects[_projectId].lastStatusUpdate = block.timestamp;
        emit ProjectStatusUpdated(_projectId, ProjectStatus.Verified, msg.sender, "Project successfully verified");
    }

    /**
     * @dev Allows the assigned verifier to reject a project.
     * @param _projectId The ID of the project to reject.
     * @param _reason The reason for rejection.
     */
    function rejectProject(uint256 _projectId, string memory _reason) external onlyVerifier nonReentrant {
        require(projects[_projectId].currentVerifier == msg.sender, "Only assigned verifier can reject this project");
        require(projects[_projectId].status == ProjectStatus.UnderReview, "Project not in 'Under Review' status");

        projects[_projectId].status = ProjectStatus.Rejected;
        projects[_projectId].currentVerifier = address(0); // Verifier task completed
        projects[_projectId].lastStatusUpdate = block.timestamp;
        emit ProjectStatusUpdated(_projectId, ProjectStatus.Rejected, msg.sender, _reason);
    }

    /**
     * @dev Allows the project registrant to mark a verified project as completed.
     * This might trigger carbon credit issuance in a separate contract.
     * @param _projectId The ID of the project to mark as completed.
     */
    function markProjectCompleted(uint256 _projectId) external nonReentrant {
        require(projects[_projectId].registrant == msg.sender, "Only project registrant can mark as completed");
        require(projects[_projectId].status == ProjectStatus.Verified, "Project must be Verified to be marked as Completed");

        projects[_projectId].status = ProjectStatus.Completed;
        projects[_projectId].lastStatusUpdate = block.timestamp;
        emit ProjectStatusUpdated(_projectId, ProjectStatus.Completed, msg.sender, "Project marked as completed");
    }

    // --- Admin Functions (Owner-only) ---

    /**
     * @dev Authorizes a new verifier for the system. Only callable by the contract owner.
     * @param _verifierAddress The address of the entity to authorize as a verifier.
     * @param _name The name of the verifier (e.g., "NCCR Auditor").
     */
    function authorizeVerifier(address _verifierAddress, string memory _name) external onlyOwner {
        require(!verifiers[_verifierAddress].isAuthorized, "Verifier already authorized");

        _verifierIdCounter.increment();
        uint256 newVerifierId = _verifierIdCounter.current();

        verifiers[_verifierAddress] = Verifier({
            id: newVerifierId,
            name: _name,
            verifierAddress: _verifierAddress,
            isAuthorized: true,
            authorizedDate: block.timestamp
        });
        verifierAddressById[newVerifierId] = _verifierAddress;

        emit VerifierAuthorized(newVerifierId, _verifierAddress, _name);
    }

    /**
     * @dev Revokes authorization from an existing verifier. Only callable by the contract owner.
     * @param _verifierAddress The address of the verifier to revoke.
     */
    function revokeVerifier(address _verifierAddress) external onlyOwner {
        require(verifiers[_verifierAddress].isAuthorized, "Verifier not authorized");

        uint256 revokedVerifierId = verifiers[_verifierAddress].id;
        delete verifiers[_verifierAddress]; // Clears the verifier struct
        delete verifierAddressById[revokedVerifierId]; // Also clear from ID lookup

        emit VerifierRevoked(revokedVerifierId, _verifierAddress);
    }


    // --- View Functions (Read-only) ---

    function getProject(uint256 _projectId)
        public
        view
        returns (
            uint256 id,
            address registrant,
            string memory name,
            string memory locationData,
            string memory description,
            EcosystemType ecosystem,
            uint256 estimatedCarbonSequestration,
            uint256 registrationDate,
            ProjectStatus status,
            uint256 lastStatusUpdate,
            address currentVerifier,
            string memory minioUrl,
            string memory dataHash
        )
    {
        CarbonProject storage project = projects[_projectId];
        return (
            project.id,
            project.registrant,
            project.name,
            project.locationData,
            project.description,
            project.ecosystem,
            project.estimatedCarbonSequestration,
            project.registrationDate,
            project.status,
            project.lastStatusUpdate,
            project.currentVerifier,
            project.minioUrl,
            project.dataHash
        );
    }

    function getVerifier(address _verifierAddress)
        public
        view
        returns (
            uint256 id,
            string memory name,
            address verifierAddress,
            bool isAuthorized,
            uint256 authorizedDate
        )
    {
        Verifier storage verifier = verifiers[_verifierAddress];
        return (
            verifier.id,
            verifier.name,
            verifier.verifierAddress,
            verifier.isAuthorized,
            verifier.authorizedDate
        );
    }

    function getProjectStatus(uint256 _projectId) public view returns (ProjectStatus) {
        return projects[_projectId].status;
    }

    function getTotalProjects() public view returns (uint256) {
        return _projectIdCounter.current();
    }

    function getTotalVerifiers() public view returns (uint256) {
        return _verifierIdCounter.current();
    }

    function isVerifier(address _address) public view returns (bool) {
        return verifiers[_address].isAuthorized;
    }

    function getProjectRegistrant(uint256 _projectId) public view returns (address) {
        return projects[_projectId].registrant;
    }

    function getProjectByRegistrant(address _registrant) public view returns (uint256) {
        return projectIdByRegistrant[_registrant];
    }
}