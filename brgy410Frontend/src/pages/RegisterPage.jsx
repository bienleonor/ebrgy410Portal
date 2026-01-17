import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../utils/AxiosInstance";
import TextInput from "../components/common/TextInput";
import PrimaryButton from "../components/common/PrimaryButton";
import AlertBox from "../components/common/AlertBox";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Personal Info, 2: OTP Sent, 3: OTP Verify, 4: Create Account
  const [verifiedConstituentId, setVerifiedConstituentId] = useState(null);
  const [form, setForm] = useState({
    // Step 1 - Personal Info
    first_name: "",
    last_name: "",
    birthdate: "",
    // Step 3 - OTP
    otp: "",
    // Step 4 - Account Creation
    username: "",
    password: "",
    confirmPassword: ""
  });
  const [alert, setAlert] = useState({ message: "", type: "success" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Step 1: Check if constituent exists
  const handleCheckConstituent = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ message: "", type: "success" });

    try {
      const { data } = await axiosInstance.post("/auth/check-constituent", {
        first_name: form.first_name,
        last_name: form.last_name,
        birthdate: form.birthdate
      });

      setVerifiedConstituentId(data.verified_id);
      setAlert({ message: "Verified constituent found! Sending OTP to your email...", type: "success" });
      
      // Auto-proceed to send OTP
      setTimeout(() => handleSendOTP(data.verified_id), 1000);
    } catch (error) {
      setAlert({ 
        message: error.response?.data?.message || "Constituent not found. Please verify your information.", 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Send OTP
  const handleSendOTP = async (constituentId) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.post("/auth/send-otp", {
        verified_id: constituentId || verifiedConstituentId
      });

      toast.success(data.message || "OTP sent to your email!");
      setStep(3);
      setAlert({ message: "", type: "success" });
    } catch (error) {
      setAlert({ 
        message: error.response?.data?.message || "Failed to send OTP. Please try again.", 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ message: "", type: "success" });

    try {
      const { data } = await axiosInstance.post("/auth/verify-otp", {
        verified_id: verifiedConstituentId,
        otp: form.otp
      });

      toast.success(data.message || "OTP verified successfully!");
      setStep(4);
      setAlert({ message: "", type: "success" });
    } catch (error) {
      setAlert({ 
        message: error.response?.data?.message || "Invalid or expired OTP.", 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 4: Create Account
  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ message: "", type: "success" });

    // Validate password match
    if (form.password !== form.confirmPassword) {
      setAlert({ message: "Passwords do not match", type: "error" });
      setLoading(false);
      return;
    }

    try {
      const { data } = await axiosInstance.post("/auth/create-account", {
        verified_id: verifiedConstituentId,
        username: form.username,
        password: form.password
      });

      setAlert({ message: "Account created successfully! Redirecting to login...", type: "success" });
      toast.success("Registration complete!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setAlert({ 
        message: error.response?.data?.message || "Failed to create account.", 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    handleSendOTP();
  };

  return (
    <div className="bg-base-300 flex items-center justify-center min-h-screen py-8">
      <div className="bg-base-200-muted p-8 rounded-lg shadow-black shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-2">Register</h2>
        <p className="text-sm text-gray-400 mb-4">
          Step {step} of 4
        </p>
        
        <AlertBox message={alert.message} type={alert.type} />

        {/* Step 1: Personal Information */}
        {step === 1 && (
          <form onSubmit={handleCheckConstituent}>
            <p className="text-sm mb-4">Enter your personal information to verify your identity</p>
            <TextInput 
              name="first_name" 
              placeholder="First Name" 
              value={form.first_name} 
              onChange={handleChange} 
              className="mt-2" 
              required
            />
            <TextInput 
              name="last_name" 
              placeholder="Last Name" 
              value={form.last_name} 
              onChange={handleChange} 
              className="my-2" 
              required
            />
            <TextInput 
              name="birthdate" 
              type="date" 
              placeholder="Birthdate" 
              value={form.birthdate} 
              onChange={handleChange} 
              className="mb-5" 
              required
            />
            <PrimaryButton text={loading ? "Verifying..." : "Verify Identity"} disabled={loading} />
          </form>
        )}

        {/* Step 3: OTP Verification */}
        {step === 3 && (
          <form onSubmit={handleVerifyOTP}>
            <p className="text-sm mb-4">Enter the 6-character OTP sent to your email</p>
            <TextInput 
              name="otp" 
              placeholder="Enter OTP" 
              value={form.otp} 
              onChange={handleChange} 
              className="mt-2 mb-5" 
              maxLength={6}
              required
            />
            <PrimaryButton text={loading ? "Verifying..." : "Verify OTP"} disabled={loading} />
            <button 
              type="button" 
              onClick={handleResendOTP} 
              className="mt-3 text-sm text-blue-500 hover:underline w-full text-center"
              disabled={loading}
            >
              Resend OTP
            </button>
          </form>
        )}

        {/* Step 4: Create Account */}
        {step === 4 && (
          <form onSubmit={handleCreateAccount}>
            <p className="text-sm mb-4">Create your account credentials</p>
            <TextInput 
              name="username" 
              placeholder="Username" 
              value={form.username} 
              onChange={handleChange} 
              className="mt-2" 
              required
            />
            <TextInput 
              name="password" 
              type="password" 
              placeholder="Password" 
              value={form.password} 
              onChange={handleChange} 
              className="my-2" 
              required
            />
            <TextInput 
              name="confirmPassword" 
              type="password" 
              placeholder="Confirm Password" 
              value={form.confirmPassword} 
              onChange={handleChange} 
              className="mb-5" 
              required
            />
            <PrimaryButton text={loading ? "Creating..." : "Create Account"} disabled={loading} />
          </form>
        )}

        <p className="mt-4 text-sm">
          Already have an account? <Link to="/Login" className="text-blue-500">Login</Link>
        </p>
      </div>
    </div>
  );
}
