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

  const newHealthRecord = {
          ID: 1,
          patient: patientAddress,
          data: "Some data"
        };

  beforeEach(async () => {
    instance = await HRABAC.deployed();
    instanceAddress = await instance.getSender.call();
  });

  it("Test HRABAC - test doctor create and access own created health record", async () => {

        const roleDoctor = await instance.assignRole.sendTransaction(doctorAddress,"Doctor", true, {from: instanceAddress});
        const checkDoctor = await instance.checkIsActiveDoctor.call(doctorAddress);
        expect(checkDoctor, "The role is not active Doctor").to.true;
      
        const healthRecord = await instance.initHealthRecord.sendTransaction(newHealthRecord.patient,
          newHealthRecord.data,
          newHealthRecord.ID, 
          {from: doctorAddress}
          );
        const canDoctor = await instance.canAccess.call(newHealthRecord.ID, {from: doctorAddress});
        expect(canDoctor).to.be.true;
  });

it("Test HRABAC - test doctor DO NOT access NOT own created health record", async () => {

        const roleOtherDoctor = await instance.assignRole.sendTransaction(otherDoctorAddress,"Doctor", true, {from: instanceAddress});
        const checkOtherDoctor = await instance.checkIsActiveDoctor.call(otherDoctorAddress);
        expect(checkOtherDoctor, "The role is not active Doctor").to.true;
      
        const canDoctor = await instance.canAccess.call(newHealthRecord.ID, {from: otherDoctorAddress});
        expect(canDoctor).to.be.false;
  });

  it('Test HRABAC - test patient access own health record', async () => {

        const rolePatient = await instance.assignRole.sendTransaction(patientAddress,"Patient", true,  {from: instanceAddress});
        const checkPatient = await instance.checkIsActivePatient.call(patientAddress);
        expect(checkPatient, "The role is not active patient").to.true;
        const canPatient = await instance.canAccess.call(newHealthRecord.ID, {from: patientAddress});
        expect(canPatient).to.be.true;
      });

  it('Test HRABAC - test patient DO NOT access NOT own health record', async () => {

        const roleOtherPatient = await instance.assignRole.sendTransaction(otherPatientAddress,"Patient", true,  {from: instanceAddress});
        const checkOtherPatient = await instance.checkIsActivePatient.call(otherPatientAddress);
        expect(checkOtherPatient, "The role is not active patient").to.true;
        const canOtherPatient = await instance.canAccess.call(newHealthRecord.ID, {from: otherPatientAddress});
        expect(canOtherPatient).to.be.false;
    });

  it('Test HRABAC - test inactive patient DO NOT access NOT own health record', async () => {

        const rolePatient = await instance.assignRole.sendTransaction(patientAddress,"Patient", false,  {from: instanceAddress});
        const checkPatient = await instance.checkIsActivePatient.call(patientAddress);
        expect(checkPatient, "The role is not active patient").to.false;
        const canPatient = await instance.canAccess.call(newHealthRecord.ID, {from: patientAddress});
        expect(canPatient).to.be.false;
    });

  it('Test HRABAC - test admin access health record', async () => {

        const roleAdmin = await instance.assignRole.sendTransaction(adminAddress,"Admin", true,  {from: instanceAddress});
        const checkAdmin = await instance.checkIsActiveAdmin.call(adminAddress);
        expect(checkAdmin, "The role is not active admin").to.true;
        const canAdmin = await instance.canAccess.call(newHealthRecord.ID, {from: adminAddress});
        expect(canAdmin).to.be.true;
    });

   it('Test HRABAC - test inactive admin DO NOT access health record', async () => {

        const roleAdmin = await instance.assignRole.sendTransaction(adminAddress,"Admin", false,  {from: instanceAddress});
        const checkAdmin = await instance.checkIsActiveAdmin.call(adminAddress);
        expect(checkAdmin, "The role is not active admin").to.false;
        const canAdmin = await instance.canAccess.call(newHealthRecord.ID, {from: adminAddress});
        expect(canAdmin).to.be.false;
    });
});