// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Record} from "./Record.sol";
import {HRABAC} from "./HRABAC.sol";


contract AccessControl is HRABAC, Record{

	function patientPolicy(address _user, uint256 healthRecordID) public view returns (bool) {

		return this.checkIsActivePatient(_user) && healthRecords[healthRecordID].patient == _user;
	}


	function doctorPolicy(address _user, uint256 healthRecordID) public view returns (bool) {

		return (this.checkIsActiveDoctor(_user) && healthRecords[healthRecordID].doctor == _user);
	}

	function adminPolicy(address _user) public view returns (bool) {

		return this.checkIsActiveAdmin(_user);
	}

	function canAccess(uint256 healthRecordID) public view returns (bool) {
		return this.patientPolicy(msg.sender, healthRecordID) ||
			this.doctorPolicy(msg.sender, healthRecordID) ||
			this.adminPolicy(msg.sender);
	}


	modifier onlyDoctor {
       require(this.checkIsActiveDoctor(msg.sender), "The user is not active doctor!");
       _;
   }

	function initHealthRecord(address _patientAddress,  string memory _data,  uint256 _ID) onlyDoctor external returns 		(uint256) {

	    healthRecords[_ID] = HealthRecord({patient: _patientAddress, doctor: msg.sender, data: _data, ID:_ID});
	    return _ID;
	}
}