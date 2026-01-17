import { CertificateRequestModel } from "../models/certificateRequestModel.js";
import { getResidentWithFullAddress } from "../models/residentModel.js";
import { CertificateTypeModel } from "../models/certificateTypeModel.js";
import { CertificateAttachmentModel } from "../models/certificateAttachmentModel.js";
import { CertificateTemplateModel } from "../models/certificateTemplateModel.js";
import { generateCertificateFromDocx } from "../utils/generateCertificateFromDocx.js";
import { getBrgyOfficialById, getFullBrgyOfficialById } from "../models/BrgyOfficialModel.js";


import pool from "../config/pool.js";
import path from "path";

export async function handleApprovedCertificate(cert_req_id) {
  try {
    // 1️⃣ Load certificate request
    const request = await CertificateRequestModel.findById(cert_req_id);
    if (!request) throw new Error(`Request ID ${cert_req_id} not found.`);

    // 2️⃣ Load resident, type, template
    const [resident, certType, template] = await Promise.all([
      getResidentWithFullAddress(request.verified_id),
      CertificateTypeModel.findById(request.certificate_type_id),
      CertificateTemplateModel.findByCertType(request.certificate_type_id),
    ]);

    if (!resident) throw new Error(`Resident not found`);
    if (!certType) throw new Error(`Certificate type not found`);
    if (!template) throw new Error(`No template found`);

    // 3️⃣ Fetch Barangay Captain
    const [captainRows] = await pool.execute(`
      SELECT 
        vc.first_name, vc.middle_name, vc.last_name,
        p.position_name
      FROM brgy_officials bo
      JOIN verified_constituent vc ON vc.verified_id = bo.verified_id
      JOIN positions p ON p.position_id = bo.position_id
      WHERE bo.position_id = 1
      ORDER BY bo.start_term DESC
      LIMIT 1
    `);

    const captain = captainRows[0] || null;
    const captainName = captain
      ? `${captain.first_name} ${captain.middle_name || ""} ${captain.last_name}`
      : "Barangay Captain";

    // 4️⃣ Fetch approving official using processed_by
    let signatoryName = "";
    let signatoryPosition = "";

    if (request.processed_by) {
      const officiating = await getFullBrgyOfficialById(request.processed_by);

      if (officiating) {
        signatoryName = `${officiating.first_name} ${officiating.middle_name || ""} ${officiating.last_name}`;
        signatoryPosition = officiating.position_name;
      }
    }

    // 5️⃣ Prepare data for DOCX
    const issuedDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });

    const data = {
      resident_name: `${resident.first_name} ${resident.middle_name || ""} ${resident.last_name}`,
      address: resident.formatted_address || "N/A",
      purpose: request.purpose,
      control_number: request.control_number,
      date_issued: issuedDate,

      // New placeholders:
      captain_name: captainName,
      signatory_name: signatoryName,
      signatory_position: signatoryPosition,
    };

    // 6️⃣ Generate PDF from DOCX
    const pdfPath = await generateCertificateFromDocx({
      templatePath: template.file_path,
      data,
      reference_code: request.control_number,
    });

    // 7️⃣ Save certificate file
    await CertificateAttachmentModel.create({
      request_id: cert_req_id,
      file_name: path.basename(pdfPath),
      file_path: pdfPath,
      file_type: "generated",
    });

    console.log(`✅ Certificate successfully generated for request #${cert_req_id}`);
    return pdfPath;

  } catch (error) {
    console.error("❌ Error in handleApprovedCertificate:", error);
    throw error;
  }
}
