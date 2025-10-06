import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/UseAuth";
import TextInput from "../components/common/TextInput";
import PrimaryButton from "../components/common/PrimaryButton";
import AlertBox from "../components/common/AlertBox";

export default function AdminRegister() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", role: 1 });
  const [alert, setAlert] = useState({ message: "", type: "success" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "role" ? parseInt(value, 10) : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await register(form); 
    if (res.success) {
      setAlert({ message: "Registration successful! Redirecting to login...", type: "success" });
      setTimeout(() => navigate("/AdminLogin"), 1500);
    } else {
      setAlert({ message: res.message, type: "error" });
    }
  };

  return (
    <div className="bg-base-300 flex items-center justify-center h-screen">
      <div className="bg-base-200-muted p-8 rounded-lg shadow-black shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-6">Register</h2>
        <AlertBox message={alert.message} type={alert.type} />
        <form onSubmit={handleSubmit}>
          <TextInput name="username" placeholder="Username" value={form.username} onChange={handleChange} required/>
          <TextInput name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required/>
          <TextInput name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required/>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Role</label>
            <select name="role" value={form.role} onChange={handleChange} className="w-full border border-base-200-dim rounded px-3 py-2">
              <option value="1">Super Admin</option>
              <option value="2">Chairman/Chairwoman</option>
              <option value="3">Councilor</option>
              <option value="4">Secretary</option>
              <option value="5">Treasurer</option>
              <option value="6">Staff</option>
              <option value="7">Resident</option>
            </select>
          </div>
          <PrimaryButton text="Register" />
        </form>
        <p className="mt-4 text-sm">
          Already have an account? <Link to="/AdminLogin" className="text-blue-500">Login</Link>
        </p>
      </div>
    </div>
  );
}
