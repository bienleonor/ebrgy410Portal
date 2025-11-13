import { getAllStatuses } from "../models/statusModel.js";

export const getAllStatusesController = async (req, res) => {
  try {
    const statuses = await getAllStatuses();
    res.status(200).json(statuses);
  } catch (error) {
    console.error("Error fetching statuses:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};