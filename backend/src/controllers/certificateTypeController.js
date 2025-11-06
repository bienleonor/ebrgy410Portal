import { CertificateTypeModel } from "../models/certificateTypeModel.js";

export const getAllCertificateTypes = async (req, res) => {
  try {
    const types = await CertificateTypeModel.findAll();
    res.status(200).json(types);
  } catch (error) {
    console.error("Error fetching certificate types:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
