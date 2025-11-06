import fs from "fs";
import path from "path";
import { PDFDocument, StandardFonts } from "pdf-lib";

export async function generatePersonalizedCertificate({ 
  templatePath, 
  resident, 
  certType, 
  reference_code 
}) {
  const templateBytes = fs.readFileSync(templatePath);
  const pdfDoc = await PDFDocument.load(templateBytes);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const textColor = rgb(0, 0, 0);

  // Example overlay text positions (adjust to your template layout)
  firstPage.drawText(`${resident.first_name} ${resident.last_name}`, {
    x: 220,
    y: 420,
    size: 14,
    font,
    color: textColor,
  });

  firstPage.drawText(`Reference Code: ${reference_code}`, {
    x: 400,
    y: 100,
    size: 10,
    font,
    color: textColor,
  });

  const outputDir = path.join("uploads", "certificates");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const outputPath = path.join(outputDir, `${reference_code}.pdf`);
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, pdfBytes);

  return outputPath;
}
