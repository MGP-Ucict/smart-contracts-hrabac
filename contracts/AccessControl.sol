//SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Record} from "./Record.sol";
import {HRABAC} from "./HRABAC.sol";

contract AccessControl is HRABAC, Record {

	function patientPolicy(address _user, uint256 healthRecordID) public view returns (bool) {

		return PATIENT == roles[_user].name && healthRecords[healthRecordID].patient == _user;
	}


	function doctorPolicy(address _user, uint256 healthRecordID) public view returns (bool) {

		return DOCTOR == roles[_user].name && healthRecords[healthRecordID].doctor == _user;
	}

	function canAccess(uint256 healthRecordID) public view returns (bool) {
		return this.checkIsActive(msg.sender) && (this.patientPolicy(msg.sender, healthRecordID) ||
			this.doctorPolicy(msg.sender, healthRecordID) || ADMIN == roles[msg.sender].name);
	}


	modifier onlyDoctor {
      	require(DOCTOR == roles[msg.sender].name, "The user is not active doctor!");
       _;
   }

	function createHealthRecord(address _patientAddress,  string memory _medicalData,  uint256 _id) external  onlyDoctor {

	    healthRecords[_id] = HealthRecord({patient: _patientAddress, doctor: msg.sender, data: _medicalData, id:_id});
	}
}