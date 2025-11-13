import { getAllPositions } from "../models/positionModel.js";

export const getAllPositionsController = async (req, res) => {
  try {
    const positions = await getAllPositions();
    res.status(200).json(positions);
  } catch (error) {
    console.error("Error fetching positions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};