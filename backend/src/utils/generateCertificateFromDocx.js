// src/utils/generateCertificateFromDocx.js
import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { exec } from "child_process";

// ✅ Absolute output directory
const BASE_OUTPUT_DIR = path.resolve("src/upload/generated");

export async function generateCertificateFromDocx({
  templatePath,
  data,
  reference_code,
}) {
  // 🧩 1. Validate template file
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found at: ${templatePath}`);
  }

  // 🧩 2. Ensure output directory exists
  if (!fs.existsSync(BASE_OUTPUT_DIR)) {
    fs.mkdirSync(BASE_OUTPUT_DIR, { recursive: true });
  }

  // 🧩 3. Load and render DOCX
  const content = fs.readFileSync(templatePath, "binary");
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

  try {
    doc.render(data);
  } catch (error) {
    console.error("❌ Error rendering DOCX:", error);
    throw new Error("Template rendering failed.");
  }

  // 🧩 4. Write DOCX
  const outputDocx = path.join(BASE_OUTPUT_DIR, `${reference_code}.docx`);
  const outputPdf = path.join(BASE_OUTPUT_DIR, `${reference_code}.pdf`);
  fs.writeFileSync(outputDocx, doc.getZip().generate({ type: "nodebuffer" }));

  // 🧩 5. Convert DOCX → PDF
  await convertToPdf(outputDocx, BASE_OUTPUT_DIR);

  console.log(`✅ Certificate generated at: ${outputPdf}`);
  return outputPdf;
}

/**
 * 🔹 Convert DOCX to PDF using LibreOffice
 *  - Must be installed locally
 *  - On Windows, make sure `soffice.exe` path is correct
 */
function convertToPdf(inputPath, outputDir) {
  return new Promise((resolve, reject) => {
    const librePath = `"D:\\Applications\\LibreOffice\\program\\soffice.exe"`;

    // ⚠️ Use forward slashes for Windows compatibility
    const normalizedInput = inputPath.replace(/\\/g, "/");
    const normalizedOutput = outputDir.replace(/\\/g, "/");

    const command = `${librePath} --headless --convert-to pdf --outdir "${normalizedOutput}" "${normalizedInput}"`;

    console.log("Running command:", command);

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error("❌ LibreOffice conversion error:", stderr || error);
        return reject(error);
      }
      console.log("✅ LibreOffice conversion output:", stdout);
      resolve();
    });
  });
}
