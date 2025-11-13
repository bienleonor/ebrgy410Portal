import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

/**
 * Centralized resident profile validation logic.
 * Can be used in Layouts, Pages, or Components (like Sidebar).
 */
export const useProfileValidation = () => {
  const navigate = useNavigate();

  /**
   * Check if the profile has required fields.
   * @param {object} profile - The resident profile object.
   * @returns {boolean} - Whether profile is valid or not.
   */
  const requiredFields = ["first_name", "last_name"];
  const isProfileComplete = (profile) => {
    if (!profile) return false;
    return requiredFields.every((field) => {
      const value = profile[field];
      return value !== null && value !== undefined && String(value).trim() !== "";
    });
  };


  /**
   * Redirect user to profile page if missing fields.
   * Optionally show a toast message.
   */
  const enforceProfileCompletion = (profile, showToast = true) => {
    if (!isProfileComplete(profile)) {
      if (showToast)
        toast.error("Please complete your profile before accessing this page.");
      navigate("/resident/profile", { replace: true });
      return false;
    }
    return true;
  };

  return { isProfileComplete, enforceProfileCompletion };
};
