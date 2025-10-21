import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/UseAuth";
import TextInput from "../components/common/TextInput";
import PrimaryButton from "../components/common/PrimaryButton";
import AlertBox from "../components/common/AlertBox";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
  const [alert, setAlert] = useState({ message: "", type: "success" });

  const roleRedirectMap = {
    superadmin: '/admin/dashboard',
    chairman: '/admin/dashboard',
    councilor: '/admin/dashboard',
    secretary: '/admin/dashboard',
    treasurer: '/admin/dashboard',
    staff: '/admin/dashboard',
    resident: '/resident/dashboard'
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await login(form);

    if (res.success) {
      const userRole = res.user?.role?.trim().toLowerCase();
      const redirectPath = roleRedirectMap[userRole];

      if (redirectPath) {
        setAlert({ message: "Login successful! Redirecting...", type: "success" });
        setTimeout(() => navigate(redirectPath), 1500);
      } else {
        setAlert({ message: `No dashboard mapped for role: ${userRole}`, type: "warning" });
      }
    } else {
      setAlert({ message: res.message || "Login failed", type: "error" });
    }
  };

  return (
    <div className="bg-base-200 flex items-center justify-center h-screen">
      <div className="bg-base-100 text-base-content p-8 rounded-lg shadow-xl shadow-cyan-950 w-96">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        <AlertBox message={alert.message} type={alert.type} />
        <form onSubmit={handleSubmit}>
          <TextInput name="username" placeholder="Username" value={form.username} onChange={handleChange} />
          <TextInput type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} />
          <PrimaryButton text="Login" />
        </form>
        <p className="mt-4 text-sm">
          Don't have an account? <Link to="/Register" className="text-blue-500">Register</Link>
        </p>
      </div>
    </div>
  );
}
