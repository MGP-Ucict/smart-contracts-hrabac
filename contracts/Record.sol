// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
contract Record {
	struct HealthRecord {
		address patient;
		address doctor;
		string data;
		uint256 ID;
	}

	mapping (uint256 => HealthRecord) healthRecords;
}