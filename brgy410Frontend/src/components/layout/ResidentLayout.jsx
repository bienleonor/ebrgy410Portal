import { Outlet, useLocation, useNavigate } from "react-router-dom";
import ResidentSidebar from "./ResidentSidebar";
import ResidentHeader from "../../components/layout/ResidentHeader";
import { useState, useEffect } from "react";
import AxiosInstance from "../../utils/AxiosInstance";
import { useProfileValidation } from "../../hooks/useProfileValidation"; // ✅ import our hook

const ResidentLayout = () => {
  const [profile, setProfile] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [barangays, setBarangays] = useState([]);
  const [puroks, setPuroks] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const { enforceProfileCompletion } = useProfileValidation(); // ✅ use our centralized validation

  // 🧠 Fetch all layout data (profile, address, dropdowns)
  useEffect(() => {
    const controller = new AbortController();

    const fetchLayoutData = async () => {
      try {
        // ✅ Fetch resident profile
        const { data: profileData } = await AxiosInstance.get("/residents/profile/me", {
          signal: controller.signal,
        });

        console.log("🧠 Loaded resident profile:", profileData);
        setProfile(profileData);

        // ✅ Fetch address (if exists)
        if (profileData?.address_id) {
          const { data: addressData } = await AxiosInstance.get(
            `/address/addresses/${profileData.address_id}`,
            { signal: controller.signal }
          );
          setAddress(addressData);
        }

        // ✅ Fetch barangays & puroks in parallel
        const [brgyRes, purokRes] = await Promise.all([
          AxiosInstance.get("/address/barangays", { signal: controller.signal }),
          AxiosInstance.get("/address/purok", { signal: controller.signal }),
        ]);
        setBarangays(brgyRes.data);
        setPuroks(purokRes.data);
      } catch (err) {
        if (err.name !== "CanceledError") {
          console.error("❌ Failed to fetch layout data:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLayoutData();
    return () => controller.abort();
  }, []);

  // 🚦 Validate profile *after* loading is complete
  useEffect(() => {
    if (loading) return; // ⛔ Wait for loading to finish
    if (!profile) return; // ⛔ Wait for profile to be fetched

    const isOnProfilePage = location.pathname.includes("/resident/profile");

    // ✅ Only enforce redirection if user is NOT on profile page
    if (!isOnProfilePage) {
      enforceProfileCompletion(profile, false);
    }
  }, [loading, profile, location, enforceProfileCompletion]);

  // 🌀 Loading state
  if (loading) {
    return <div className="text-center py-10">Loading your profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* 🧭 Header */}
      <ResidentHeader user={profile} />

      <div className="flex flex-1">
        {/* 🧩 Sidebar */}
        <ResidentSidebar profile={profile} /> {/* ✅ pass profile down */}

        {/* 🧱 Main Content */}
        <main className="flex-1 ml-64 w-full bg-gradient-to-b from-pink-500 to-pink-100">
          <Outlet context={{ profile, address, barangays, puroks }} />
        </main>
      </div>
    </div>
  );
};

export default ResidentLayout;
