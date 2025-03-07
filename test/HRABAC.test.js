const chai = require("chai");
const assert = require("chai").assert;
const { expect } = require("chai");

const truffleAssert = require('truffle-assertions');
const HRABAC = artifacts.require("AccessControl");
contract('HRABAC', (accounts) => {

  let instance
  let patientAddress = accounts[0];
  let doctorAddress = accounts[1];
  let adminAddress = accounts[2];
  let otherPatientAddress = accounts[3];
  let otherDoctorAddress = accounts[4];
  let instanceAddress;
  let secondPatientAddress = accounts[5];
  let secondAdminAddress = accounts[6];

  const newHealthRecord = {
          ID: 1,
          patient: patientAddress,
          data: "Some data"
        };

  beforeEach(async () => {
    instance = await HRABAC.deployed();
    instanceAddress = await instance.getSender.call();

    //assign an address to role PATIENT
    const rolePatient = await instance.assignRole.sendTransaction(patientAddress,"Patient", true, true, {from: instanceAddress});
    
    //assign an address to role DOCTOR
    const roleDoctor = await instance.assignRole.sendTransaction(doctorAddress,"Doctor", true, true, {from: instanceAddress});
    
     //create a health record
    const healthRecord = await instance.createHealthRecord.sendTransaction(newHealthRecord.patient,
          newHealthRecord.data,
          newHealthRecord.ID, 
          {from: doctorAddress}
          );
    //assign another address to role DOCTOR
     const roleOtherDoctor = await instance.assignRole.sendTransaction(otherDoctorAddress,"Doctor", true, true, {from: instanceAddress});
    //assign other address to role PATIENT
    const roleOtherPatient = await instance.assignRole.sendTransaction(otherPatientAddress,"Patient", true, true, {from: instanceAddress});
    //assign another address to role PATIENT
    const roleSecondPatient = await instance.assignRole.sendTransaction(secondPatientAddress,"Patient", false, true, {from: instanceAddress});
    //assign an address to role ADMIN
    const roleAdmin = await instance.assignRole.sendTransaction(adminAddress,"Admin", true, true, {from: instanceAddress});
    //assign another address to role ADMIN
    const roleSecondAdmin = await instance.assignRole.sendTransaction(secondAdminAddress,"Admin", false,  true, {from: instanceAddress});
  });

  it(" 1. - Test HRABAC - test whether doctor can create and access own created health record", async () => {
        const checkDoctor = await instance.checkIsActive.call(doctorAddress);
        expect(checkDoctor, "The role is not active Doctor").to.true;
        const canDoctor = await instance.seeHealthRecordData.call(newHealthRecord.ID, {from: doctorAddress});
        expect(canDoctor).equal('Some data');
  });

it("2. - Test HRABAC - test whether doctor CANNOT access NOT own patient's created health record", async () => {
        const checkOtherDoctor = await instance.checkIsActive.call(otherDoctorAddress);
        expect(checkOtherDoctor, "The role is not active Doctor").to.true;
      
        const canDoctor = await instance.seeHealthRecordData.call(newHealthRecord.ID, {from: otherDoctorAddress});
        expect(canDoctor).equal('');
  });

  it('3. - Test HRABAC - test whether patient can access own health record', async () => {    
        const checkPatient = await instance.checkIsActive.call(patientAddress);
        expect(checkPatient, "The role is not active patient").to.true;
        const canPatient = await instance.seeHealthRecordData.call(newHealthRecord.ID, {from: patientAddress});
        expect(canPatient).equal('Some data');
      });

  it('4. - Test HRABAC - test whether patient CANNOT access NOT own health record', async () => {
        const checkOtherPatient = await instance.checkIsActive.call(otherPatientAddress);
        expect(checkOtherPatient, "The role is not active patient").to.true;
        const canOtherPatient = await instance.seeHealthRecordData.call(newHealthRecord.ID, {from: otherPatientAddress});
        expect(canOtherPatient).equal('');
    });

  it('5. - Test HRABAC - test whether inactive patient CANNOT access own health record', async () => {
        const checkSecondPatient = await instance.checkIsActive.call(secondPatientAddress);
        expect(checkSecondPatient, "The role is not active patient").to.false;
        const canSecondPatient = await instance.seeHealthRecordData.call(newHealthRecord.ID, {from: secondPatientAddress});
        expect(canSecondPatient).equal('')
    });

  it('6. - Test HRABAC - test whether admin can access health record', async () => {
        const checkAdmin = await instance.checkIsActive.call(adminAddress);
        expect(checkAdmin, "The role is not active admin").to.true;
        const canAdmin = await instance.seeHealthRecordData.call(newHealthRecord.ID, {from: adminAddress});
        expect(canAdmin).equal('Some data');
    });

   it('7. - Test HRABAC - test whether inactive admin CANNOT access health record', async () => {
        const checkSecondAdmin = await instance.checkIsActive.call(secondAdminAddress);
        expect(checkSecondAdmin, "The role is not active admin").to.false;
        const canSecondAdmin = await instance.seeHealthRecordData.call(newHealthRecord.ID, {from: secondAdminAddress});
        expect(canSecondAdmin).equal('');
    });
});