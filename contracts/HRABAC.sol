// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract HRABAC {

	struct Role {
		bytes32 name;
		bool isActive;
	}

	mapping (address => Role) roles;
	mapping (address => bool) isActive;

	bytes32 public constant PATIENT = keccak256("Patient");
	bytes32 public constant DOCTOR = keccak256("Doctor");
	bytes32 public constant ADMIN = keccak256("Admin");

	bytes32 public constant SUPERADMIN = keccak256("Super Admin");

	address owner;

	constructor()
	{
		owner = msg.sender;
	}

	function getSender() public view returns (address)  
	{  
	    return msg.sender;  
	}

	function assignRole(address _user, string memory _name, bool _isRoleActive) onlySuperAdmin external returns (Role memory) {

		roles[_user] = Role({name: keccak256(abi.encodePacked(_name)), isActive: _isRoleActive});
		return roles[_user];
	}

	function getAssignedRole(address _user) public view returns (Role memory role) {

		return roles[_user];
	}

	function setAddressIsActive(address _user, bool _isActive) onlySuperAdmin external {

		isActive[_user] = _isActive;
	}

	function checkIsActivePatient(address _user) external view returns (bool) {

		return PATIENT == roles[_user].name && roles[_user].isActive;
	}

	function checkIsActiveAdmin(address _user) external view returns (bool) {

		return ADMIN == roles[_user].name && roles[_user].isActive;
	}

	function checkIsActiveDoctor(address _user) external view returns (bool) {

		return DOCTOR == roles[_user].name && roles[_user].isActive;
	}

	modifier onlySuperAdmin {
       require(msg.sender == owner, "The user is not active SuperAdmin!");
       _;
   }
}