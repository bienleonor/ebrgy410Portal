// src/controllers/certificateRequestController.js
import { CertificateRequestModel } from "../models/certificateRequestModel.js";
import { CertificateTypeModel } from "../models/certificateTypeModel.js";
import { getVerifiedConstituentIdByUserId } from "../models/User.js";
import { getBrgyOfficialByResidentId } from "../models/BrgyOfficialModel.js";
import { handleApprovedCertificate } from "../services/certificateService.js";
import { generateControlNumber } from "../utils/generateControlNumber.js";
import lookupModel from "../models/lookupModel.js";

export const createCertificateRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { certificate_type_id, purpose, quantity } = req.body;

    const verified_id = await getVerifiedConstituentIdByUserId(userId);
    if (!verified_id) return res.status(404).json({ message: "Verified constituent not found." });

    // Generate unique control number
    const controlNumber = await generateControlNumber(certificate_type_id);

    // Validate certificate type
    const certType = await CertificateTypeModel.findById(certificate_type_id);
    if (!certType) return res.status(400).json({ message: "Invalid certificate type." });

    const newRequestId = await CertificateRequestModel.create({
      verified_id,
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
    const { statusId, denied_reason } = req.body;

    // Get all certificate statuses from lookup
    const statuses = await lookupModel.getCertificateStatus();
    
    // Validate that the statusId exists
    const statusRecord = statuses.find(s => s.stat_id === parseInt(statusId));
    if (!statusRecord) {
      return res.status(400).json({ message: `Invalid status ID: ${statusId}` });
    }

    // Get verified_id of the logged-in user
    const verified_id = await getVerifiedConstituentIdByUserId(officialUserId);
    if (!verified_id && req.user.role !== "SuperAdmin") {
      return res.status(403).json({ message: "You are not authorized to perform this action." });
    }

    // Get brgy official number (if exists)
    let processedBy = null;
    if (req.user.role !== "SuperAdmin") {
      const official = await getBrgyOfficialByResidentId(verified_id);
      if (!official) {
        return res.status(404).json({ message: "Barangay official record not found." });
      }
      processedBy = official.brgy_official_no;
    }

    await CertificateRequestModel.updateStatus({
      cert_req_id,
      statusId,
      denied_reason: denied_reason || null,
      processed_by: processedBy,
    });

    // Generate certificate asynchronously (don't wait for completion)
    // Check if status is "Approved" by comparing status name (case-insensitive)
    if (statusRecord.status_name.toUpperCase() === "APPROVED") {
      handleApprovedCertificate(cert_req_id).catch(err => {
        console.error("❌ Background certificate generation failed:", err);
      });
    }

    res.status(200).json({ message: `Request ${statusRecord.status_name} successfully.` });
  } catch (error) {
    console.error("Error updating certificate status:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      message: "Internal server error.",
      error: error.message 
    });
  }
};

// ✅ 5. Release certificate
export const releaseCertificate = async (req, res) => {
  try {
    const officialUserId = req.user.id;
    const { cert_req_id } = req.params;
    const { statusId } = req.body;

    // Get verified_id of the logged-in user
    const verified_id = await getVerifiedConstituentIdByUserId(officialUserId);
    if (!verified_id && req.user.role !== "SuperAdmin") {
      return res.status(403).json({ message: "You are not authorized to perform this action." });
    }

    // Get brgy official number (if exists)
    let officialClaimAssist = null;
    if (req.user.role !== "SuperAdmin") {
      const official = await getBrgyOfficialByResidentId(verified_id);
      if (!official) {
        return res.status(404).json({ message: "Barangay official record not found." });
      }
      officialClaimAssist = official.brgy_official_no;
    }

    await CertificateRequestModel.releaseCertificate({
      cert_req_id,
      statusId,
      official_claim_assist: officialClaimAssist,
    });

    res.status(200).json({ message: "Certificate released successfully." });
  } catch (error) {
    console.error("Error releasing certificate:", error);
    res.status(500).json({ 
      message: "Internal server error.",
      error: error.message 
    });
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
    const verified_id = await getVerifiedConstituentIdByUserId(userId);
    if (!verified_id)
      return res.status(404).json({ message: "Verified constituent not found." });

    const requests = await CertificateRequestModel.findByResidentId(verified_id);
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
