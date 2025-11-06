// src/services/certificateService.js
import { CertificateRequestModel } from "../models/certificateRequestModel.js";
import { getResidentWithFullAddress } from "../models/residentModel.js";
import { CertificateTypeModel } from "../models/certificateTypeModel.js";
import { CertificateAttachmentModel } from "../models/certificateAttachmentModel.js";
import { generateCertificateFromDocx } from "../utils/generateCertificateFromDocx.js";
import { CertificateTemplateModel } from "../models/certificateTemplateModel.js";
import path from "path";

export async function handleApprovedCertificate(cert_req_id) {
  try {
    // 1️⃣ Load the certificate request
    const request = await CertificateRequestModel.findById(cert_req_id);
    if (!request) throw new Error(`Request ID ${cert_req_id} not found.`);

    // 2️⃣ Fetch related data (resident, certificate type, and template)
    const [resident, certType, template] = await Promise.all([
      getResidentWithFullAddress(request.resident_id), // ✅ fixed
      CertificateTypeModel.findById(request.certificate_type_id),
      CertificateTemplateModel.findByCertType(request.certificate_type_id),
    ]);

    if (!resident) throw new Error(`Resident not found for request ID ${cert_req_id}`);
    if (!certType) throw new Error(`Certificate type not found for request ID ${cert_req_id}`);
    if (!template) throw new Error(`No active template found for certificate type: ${certType.name}`);

    // 3️⃣ Prepare placeholder data for DOCX template
    const issuedDate = new Date(request.issued_date || new Date()).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });

    const data = {
      resident_name: `${resident.first_name} ${resident.middle_name || ""} ${resident.last_name}`,
      address: resident.formatted_address  || "N/A",
      purpose: request.purpose,
      control_number: request.control_number,
      date_issued: issuedDate,
    };

    // 4️⃣ Generate the certificate file (PDF)
    const pdfPath = await generateCertificateFromDocx({
      templatePath: template.file_path,
      data,
      reference_code: request.control_number,
    });

    // 5️⃣ Save generated certificate file info in database
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
    throw error; // Let controller handle the HTTP response
  }
}
