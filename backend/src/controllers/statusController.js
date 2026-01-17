import allStatus from "../models/statusModel.js";

export const getAllBrgyOficialStatus = async (req, res) => {
  try {
    const data = await allStatus.getStatusByType('OFFICIAL');
    res.status(200).json({ message: "BARANGAY OFFICIAL STATUSES FOUND", data });
  } catch {
    res.status(500).json({ message: "ERROR GETTING BRGY OFFICIAL STATUS" });
  }
};

export const getAllDocumentStatus = async (req, res) => {
  try {
    const data = await allStatus.getStatusByType('DOCUMENT');
    res.status(200).json({ message: "DOCUMENT STATUSES FOUND", data });
  } catch {
    res.status(500).json({ message: "ERROR GETTING DOCUMENT STATUS" });
  }
};

export const getAllCensusStatus = async (req, res) => {
  try {
    const data = await allStatus.getStatusByType('CENSUS');
    res.status(200).json({ message: "CENSUS STATUSES FOUND", data });
  } catch {
    res.status(500).json({ message: "ERROR GETTING CENSUS STATUS" });
  }
};

export const getAllCivilStatus = async (req, res) => {
  try {
    const data = await allStatus.getStatusByType('CIVIL');
    res.status(200).json({ message: "CIVIL STATUSES FOUND", data });
  } catch {
    res.status(500).json({ message: "ERROR GETTING CIVIL STATUS" });
  }
};

export const statusById = async (req, res) => {
  try {
    const status = await allStatus.getStatusById(req.params.id);
    if (!status) {
      return res.status(404).json({ message: "STATUS NOT FOUND" });
    }
    res.status(200).json({ message: "STATUS FOUND", status });
  } catch {
    res.status(500).json({ message: "FAILED TO GET STATUS BY ID" });
  }
};

export const createStatus = async (req, res) => {
  try {
    const id = await allStatus.postStatus(req.body);
    res.status(201).json({ message: "STATUS CREATED", status_id: id });
  } catch {
    res.status(500).json({ message: "DID NOT INSERT NEW STATUS" });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const rows = await allStatus.putStatus(req.params.id, req.body);
    if (rows === 0) {
      return res.status(404).json({ message: "STATUS NOT FOUND" });
    }
    res.json({ message: "STATUS UPDATED SUCCESSFULLY!" });
  } catch {
    res.status(500).json({ message: "STATUS HAS NOT BEEN UPDATED" });
  }
};

export const deleteStatus = async (req, res) => {
  try {
    const rows = await allStatus.deleteStatus(req.params.id);
    if (rows === 0) {
      return res.status(404).json({ message: "STATUS NOT FOUND" });
    }
    res.json({ message: "SATATUS HAS BEEN DELETED" });
  } catch {
    res.status(500).json({ message: "FAILED TO DELETE STATUS" });
  }
};
