import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import hre from "hardhat";
import { getAddress } from "viem";

describe("HealthRecords", function () {
  async function deployHealthRecordsFixture() {
    const [admin, doctor, patient, otherAccount] = await hre.viem.getWalletClients();
    
    const healthRecords = await hre.viem.deployContract("HealthRecords");
    const publicClient = await hre.viem.getPublicClient();

    return {
      healthRecords,
      publicClient,
      admin,
      doctor,
      patient,
      otherAccount,
    };
  }

  describe("Deployment", function () {
    it("Should set the right admin", async function () {
      const { healthRecords, admin } = await loadFixture(deployHealthRecordsFixture);
      
      expect(await healthRecords.read.admin()).to.equal(
        getAddress(admin.account.address)
      );
    });

    it("Should start with zero records", async function () {
      const { healthRecords } = await loadFixture(deployHealthRecordsFixture);
      
      expect(await healthRecords.read.recordCounter()).to.equal(0n);
    });
  });

  describe("Patient Registration", function () {
    it("Should register a new patient", async function () {
      const { healthRecords, patient } = await loadFixture(deployHealthRecordsFixture);
      
      const name = "John Doe";
      const dob = BigInt(Date.parse("1990-01-01") / 1000);
      const emergencyHash = "QmEmergencyHash123";

      await healthRecords.write.registerPatient(
        [name, dob, emergencyHash],
        { account: patient.account }
      );

      const patientData = await healthRecords.read.getPatient([patient.account.address]);
      
      expect(patientData.name).to.equal(name);
      expect(patientData.dateOfBirth).to.equal(dob);
      expect(patientData.isRegistered).to.equal(true);
    });

    it("Should not allow duplicate registration", async function () {
      const { healthRecords, patient } = await loadFixture(deployHealthRecordsFixture);
      
      const name = "John Doe";
      const dob = BigInt(Date.parse("1990-01-01") / 1000);
      const emergencyHash = "QmEmergencyHash123";

      await healthRecords.write.registerPatient(
        [name, dob, emergencyHash],
        { account: patient.account }
      );

      await expect(
        healthRecords.write.registerPatient(
          [name, dob, emergencyHash],
          { account: patient.account }
        )
      ).to.be.rejected;
    });
  });

  describe("Doctor Authorization", function () {
    it("Should allow admin to authorize doctors", async function () {
      const { healthRecords, admin, doctor } = await loadFixture(deployHealthRecordsFixture);
      
      await healthRecords.write.authorizeDoctor(
        [doctor.account.address],
        { account: admin.account }
      );

      expect(
        await healthRecords.read.authorizedDoctors([doctor.account.address])
      ).to.equal(true);
    });

    it("Should not allow non-admin to authorize doctors", async function () {
      const { healthRecords, doctor, otherAccount } = await loadFixture(deployHealthRecordsFixture);
      
      await expect(
        healthRecords.write.authorizeDoctor(
          [doctor.account.address],
          { account: otherAccount.account }
        )
      ).to.be.rejected;
    });
  });

  describe("Medical Records", function () {
    it("Should allow authorized doctor to create records", async function () {
      const { healthRecords, admin, doctor, patient } = await loadFixture(deployHealthRecordsFixture);
      
      // Register patient
      await healthRecords.write.registerPatient(
        ["John Doe", BigInt(Date.parse("1990-01-01") / 1000), "QmHash"],
        { account: patient.account }
      );

      // Authorize doctor
      await healthRecords.write.authorizeDoctor(
        [doctor.account.address],
        { account: admin.account }
      );

      // Create record
      const recordHash = "QmMedicalRecordHash123";
      await healthRecords.write.createRecord(
        [patient.account.address, recordHash],
        { account: doctor.account }
      );

      const patientRecords = await healthRecords.read.getPatientRecords([
        patient.account.address
      ]);
      
      expect(patientRecords.length).to.equal(1);
      expect(patientRecords[0]).to.equal(1n);
    });
  });
});
