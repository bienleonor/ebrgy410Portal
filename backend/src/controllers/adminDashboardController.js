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

export const getStatistics = async (req, res) => {
  try {
    const [
      genderDistribution,
      ageBrackets,
      seniorCitizenCount,
      pwdCount,
      certificatePurposes,
      certificateTypes,
      certificateStatus,
      votersList
    ] = await Promise.all([
      DashboardModel.getGenderDistribution(),
      DashboardModel.getAgeBrackets(),
      DashboardModel.getSeniorCitizenCount(),
      DashboardModel.getPWDCount(),
      DashboardModel.getCertificatePurposes(),
      DashboardModel.getCertificateTypes(),
      DashboardModel.getCertificateStatusDistribution(),
      DashboardModel.getVotersList(),
    ]);

    res.json({
      genderDistribution,
      ageBrackets,
      seniorCitizenCount,
      pwdCount,
      certificatePurposes,
      certificateTypes,
      certificateStatus,
      votersList,
    });
  } catch (error) {
    console.error("Statistics error:", error);
    res.status(500).json({ message: "Failed to load statistics" });
  }
};
