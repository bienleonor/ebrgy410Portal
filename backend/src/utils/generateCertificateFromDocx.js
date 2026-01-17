// src/utils/generateCertificateFromDocx.js
import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { exec, spawn } from "child_process";
import os from "os";

// ✅ Absolute output directory
const BASE_OUTPUT_DIR = path.resolve("src/upload/generated");

// ✅ LibreOffice configuration
const LIBRE_OFFICE_PATH = `D:\\Applications\\LibreOffice\\program\\soffice.exe`;
const LIBRE_OFFICE_PORT = 2002;
const LIBRE_OFFICE_PROFILE = path.join(os.tmpdir(), "libreoffice-daemon");

let libreOfficeProcess = null;
let isLibreOfficeReady = false;

/**
 * 🔹 Start LibreOffice in daemon/listener mode (runs once, reuses for all conversions)
 */
export async function startLibreOfficeDaemon() {
  if (libreOfficeProcess && isLibreOfficeReady) {
    console.log("✅ LibreOffice daemon already running");
    return;
  }

  // Create dedicated profile directory
  if (!fs.existsSync(LIBRE_OFFICE_PROFILE)) {
    fs.mkdirSync(LIBRE_OFFICE_PROFILE, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    console.log("🚀 Starting LibreOffice daemon...");

    const profileUri = `file:///${LIBRE_OFFICE_PROFILE.replace(/\\/g, "/")}`;

    libreOfficeProcess = spawn(LIBRE_OFFICE_PATH, [
      "--headless",
      "--invisible",
      "--nodefault",
      "--nofirststartwizard",
      "--norestore",
      "--nologo",
      `-env:UserInstallation=${profileUri}`,
      `--accept=socket,host=127.0.0.1,port=${LIBRE_OFFICE_PORT};urp;StarOffice.ServiceManager`,
    ], {
      detached: true,
      stdio: ["ignore", "ignore", "ignore"],
      windowsHide: true,
    });

    libreOfficeProcess.unref();

    libreOfficeProcess.on("error", (err) => {
      console.error("❌ Failed to start LibreOffice daemon:", err);
      isLibreOfficeReady = false;
      reject(err);
    });

    // Check if process is still alive after startup
    setTimeout(() => {
      if (libreOfficeProcess && !libreOfficeProcess.killed) {
        isLibreOfficeReady = true;
        console.log(`✅ LibreOffice daemon ready on port ${LIBRE_OFFICE_PORT}`);
        resolve();
      } else {
        console.log("⚠️ LibreOffice daemon failed to stay alive");
        reject(new Error("LibreOffice daemon exited"));
      }
    }, 2000);
  });
}

/**
 * 🔹 Stop LibreOffice daemon
 */
export function stopLibreOfficeDaemon() {
  if (libreOfficeProcess) {
    console.log("🛑 Stopping LibreOffice daemon...");
    exec(`taskkill /pid ${libreOfficeProcess.pid} /T /F`, () => {});
    libreOfficeProcess = null;
    isLibreOfficeReady = false;
  }
}

/**
 * 🔹 Convert DOCX to PDF using the running LibreOffice daemon
 */
function convertToPdfViaDaemon(inputPath, outputDir) {
  return new Promise((resolve, reject) => {
    const normalizedInput = inputPath.replace(/\\/g, "/");
    const normalizedOutput = outputDir.replace(/\\/g, "/");
    const profileUri = `file:///${LIBRE_OFFICE_PROFILE.replace(/\\/g, "/")}`;

    // Use same profile to connect to running daemon
    const command = `"${LIBRE_OFFICE_PATH}" --headless --norestore "-env:UserInstallation=${profileUri}" --convert-to pdf --outdir "${normalizedOutput}" "${normalizedInput}"`;

    console.log("📄 Converting via daemon...");

    exec(command, { timeout: 30000 }, (error, stdout, stderr) => {
      if (error) {
        console.error("❌ LibreOffice conversion error:", stderr || error);
        return reject(error);
      }
      console.log("✅ Conversion complete");
      resolve();
    });
  });
}

/**
 * 🔹 Alternative: Queue-based conversion with connection pooling
 *    For high-volume conversions, use this approach
 */
let conversionQueue = [];
let isProcessing = false;

async function queueConversion(inputPath, outputDir) {
  return new Promise((resolve, reject) => {
    conversionQueue.push({ inputPath, outputDir, resolve, reject });
    processQueue();
  });
}

async function processQueue() {
  if (isProcessing || conversionQueue.length === 0) return;

  isProcessing = true;
  const { inputPath, outputDir, resolve, reject } = conversionQueue.shift();

  try {
    await convertToPdfViaDaemon(inputPath, outputDir);
    resolve();
  } catch (error) {
    reject(error);
  } finally {
    isProcessing = false;
    processQueue(); // Process next in queue
  }
}

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

  // 🧩 5. Convert DOCX → PDF (uses queue for sequential processing)
  await queueConversion(outputDocx, BASE_OUTPUT_DIR);

  console.log(`✅ Certificate generated at: ${outputPdf}`);
  return outputPdf;
}
