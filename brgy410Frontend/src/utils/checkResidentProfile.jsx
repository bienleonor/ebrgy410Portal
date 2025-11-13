/**
 * Checks if a resident profile exists and is complete.
 * Returns { exists: boolean, complete: boolean, data?: object }
 */

export async function checkResidentProfile(token) {
  try {
    const response = await fetch("http://localhost:5000/api/residents/profile/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      // 404 means no profile record found
      return { exists: false, complete: false };
    }

    const profileData = await response.json();

    const hasNames =
      profileData?.first_name?.trim() &&
      profileData?.middle_name?.trim() &&
      profileData?.last_name?.trim();

    return {
      exists: true,
      complete: !!hasNames,
      data: profileData,
    };
  } catch (error) {
    console.error("❌ Error checking resident profile:", error);
    return { exists: false, complete: false };
  }
}
