import {
  createBrgyOfficial,
  getAllBrgyOfficials,
  getBrgyOfficialById,
  updateBrgyOfficial,
  deleteBrgyOfficial
} from '../models/BrgyOfficialModel.js';

export const getAllBrgyOfficialsController = async (_, res) => {
  try {
    const officials = await getAllBrgyOfficials();
    res.status(200).json(officials);
  } catch (error) {
    console.error('Error in getting all officials:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getBrgyOfficialByID = async (req, res) => {
  try {
    const official = await getBrgyOfficialById(req.params.id);
    if (!official) return res.status(404).json({ message: 'Official not found!' });
    res.status(200).json(official);
  } catch (error) {
    console.error('Error in finding official:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const createBrgyOfficialController = async (req, res) => {
  try {
    const id = await createBrgyOfficial(req.body);
    res.status(201).json({ message: 'Official profile created successfully', id });
  } catch (error) {
    console.error('Error in creating official:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateBrgyOfficials = async (req, res) => {
  try {
    const result = await updateBrgyOfficial(req.params.id, req.body);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Official not found" });

    res.status(200).json({ message: "Official updated successfully" });
  } catch (error) {
    console.error("Error in updating official:", error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export const deleteBrgyOfficials = async (req, res) => {
  try {
    const result = await deleteBrgyOfficial(req.params.id);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Official not found' });
    res.status(200).json({ message: 'Official deleted successfully' });
  } catch (error) {
    console.error('Error in deleting official:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
