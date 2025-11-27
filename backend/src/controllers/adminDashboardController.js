import { DashboardModel } from "../models/adminDashboardModel.js";

export const getDashboardStats = async (req, res) => {
  try {
    const [households, residents, voters, certificates] = await Promise.all([
      DashboardModel.countHouseholds(),
      DashboardModel.countResidents(),
      DashboardModel.countVoters(),
      DashboardModel.countCertificates(),
    ]);

    res.json({
      households,
      residents,
      voters,
      certificates,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Failed to load dashboard stats" });
  }
};
