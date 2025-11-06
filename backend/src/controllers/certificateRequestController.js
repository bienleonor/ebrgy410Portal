// src/controllers/certificateRequestController.js
import { CertificateRequestModel } from "../models/certificateRequestModel.js";
import { CertificateTypeModel } from "../models/certificateTypeModel.js";
import {
  getResidentByUserId,
} from "../models/residentModel.js";
import { getBrgyOfficialByResidentId } from "../models/BrgyOfficialModel.js";
import { handleApprovedCertificate } from "../services/certificateService.js";
import { generateControlNumber } from "../utils/generateControlNumber.js";

export const createCertificateRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { certificate_type_id, purpose, quantity } = req.body;

    const resident = await getResidentByUserId(userId);
    if (!resident) return res.status(404).json({ message: "Resident not found." });

    // Generate unique control number
    const controlNumber = await generateControlNumber(certificate_type_id);

    // Validate certificate type
    const certType = await CertificateTypeModel.findById(certificate_type_id);
    if (!certType) return res.status(400).json({ message: "Invalid certificate type." });

    const newRequestId = await CertificateRequestModel.create({
      resident_id: resident.resident_id,
      certificate_type_id,
      purpose,
      quantity,
      control_number: controlNumber,
    });

    return res.status(201).json({
      message: "Certificate request submitted successfully.",
      control_number: controlNumber,
      request_id: newRequestId,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      console.error("⚠️ Duplicate control number detected:", error);
      return res.status(409).json({ message: "Duplicate control number. Please try again." });
    }
    console.error("❌ Error creating certificate request:", error);
    res.status(500).json({ message: error.message || "Internal server error." });
  }
};

// ✅ 2. Admin/official updates certificate request status
export const updateCertificateStatus = async (req, res) => {
  try {
    const officialUserId = req.user.id;
    const { cert_req_id } = req.params;
    const { status, remarks, denied_reason } = req.body;

    const VALID_STATUSES = ["Approved", "Rejected", "Released"];
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: `Invalid status: ${status}` });
    }

    // Get resident info of the logged-in user
    const officialResident = await getResidentByUserId(officialUserId);
    if (!officialResident && req.user.role !== "SuperAdmin") {
      return res.status(403).json({ message: "You are not authorized to perform this action." });
    }

    // Get brgy official number (if exists)
    let processedBy = null;
    if (req.user.role !== "SuperAdmin") {
      const official = await getBrgyOfficialByResidentId(officialResident.resident_id);
      if (!official) {
        return res.status(404).json({ message: "Barangay official record not found." });
      }
      processedBy = official.brgy_official_no;
    }

    await CertificateRequestModel.updateStatus({
      cert_req_id,
      status,
      remarks,
      denied_reason,
      processed_by: processedBy,
    });

    if (status === "Approved") {
      await handleApprovedCertificate(cert_req_id);
    }

    res.status(200).json({ message: `Request ${status} successfully.` });
  } catch (error) {
    console.error("Error updating certificate status:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// ✅ 3. Admin: get all requests
export const getAllCertificateRequests = async (req, res) => {
  try {
    const data = await CertificateRequestModel.findAll();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching certificate requests:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// ✅ 4. Resident: get own requests
export const getMyCertificateRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const resident = await getResidentByUserId(userId);
    if (!resident)
      return res.status(404).json({ message: "Resident record missing." });

    const requests = await CertificateRequestModel.findByResidentId(resident.resident_id);
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
