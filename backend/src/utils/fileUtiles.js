import fs from "fs-extra";
import path from "path";

export function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function safeDeleteFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`🗑️ Deleted: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error deleting file: ${filePath}`, error);
  }
}

export function resolvePath(...segments) {
  return path.join(process.cwd(), ...segments);
}

export function fileExists(filePath) {
  return fs.existsSync(filePath);
}
