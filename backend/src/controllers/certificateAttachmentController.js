import { CertificateAttachmentModel } from "../models/certificateAttachmentModel.js";
import { CertificateRequestModel } from "../models/certificateRequestModel.js";
import path from "path";
import fs from "fs";

import pool from "../config/pool.js";

// ✅ Download/Print certificate PDF
export const downloadCertificate = async (req, res) => {
  try {
    const { request_id } = req.params;

    // Get the attachment record
    const attachment = await CertificateAttachmentModel.findByRequestId(request_id);
    
    if (!attachment) {
      return res.status(404).json({ message: "Certificate file not found." });
    }

    // Get the certificate request to verify ownership (optional security check)
    const certRequest = await CertificateRequestModel.findById(request_id);
    
    if (!certRequest) {
      return res.status(404).json({ message: "Certificate request not found." });
    }

    // Build absolute file path
    const filePath = path.resolve(attachment.file_path);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "PDF file does not exist on server." });
    }

    // Set headers for download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${attachment.file_name}"`);

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on("error", (error) => {
      console.error("❌ Error streaming file:", error);
      res.status(500).json({ message: "Error reading file." });
    });

  } catch (error) {
    console.error("❌ Error downloading certificate:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// ✅ Get certificate info (without downloading)
export const getCertificateInfo = async (req, res) => {
  try {
    const { request_id } = req.params;

    const attachment = await CertificateAttachmentModel.findByRequestId(request_id);
    
    if (!attachment) {
      return res.status(404).json({ message: "Certificate not found." });
    }

    res.status(200).json(attachment);
  } catch (error) {
    console.error("❌ Error fetching certificate info:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// ✅ Get all certificates for a resident
export const getResidentCertificates = async (req, res) => {
  try {
    const { resident_id } = req.params;

    const query = `
      SELECT 
        ca.*,
        cr.certificate_type_id,
        cr.purpose,
        cr.status,
        cr.control_number,
        ct.name as certificate_name
      FROM certificate_attachments ca
      JOIN certificate_requests cr ON ca.request_id = cr.cert_req_id
      JOIN certificate_types ct ON cr.certificate_type_id = ct.cert_type_id
      WHERE cr.resident_id = ?
      ORDER BY ca.uploaded_at DESC
    `;

    const [rows] = await pool.execute(query, [resident_id]);
    res.status(200).json(rows);

  } catch (error) {
    console.error("❌ Error fetching resident certificates:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};