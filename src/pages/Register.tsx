import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { AxiosError } from "axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import api from "../services/api";

interface RegisterInputs {
  username: string;
  email: string;
  password: string;
  role: string;
}

const schema = yup.object({
  username: yup.string().required("Username is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
  role: yup.string().required("Role is required"),
});

export default function Register() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterInputs>({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();
  const [apiMessage, setApiMessage] = useState<string | null>(null);

  const onSubmit = async (data: RegisterInputs) => {
    try {
      setApiMessage(null);
      const res = await api.post("/auth/register", data); 
      setApiMessage(res.data.message || "User registered successfully");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setApiMessage(axiosError.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-800 via-gray-900 to-black px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-purple-700 text-center mb-6">Create an Account</h2>
        {apiMessage && <p className="text-center text-sm mb-4 text-purple-600">{apiMessage}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input type="text" {...register("username")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900"
              placeholder="Enter username"/>
            {errors.username && <p className="text-red-500 text-xs">{errors.username.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" {...register("email")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900"
              placeholder="Enter email"/>
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" {...register("password")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900"
              placeholder="Enter password"/>
            {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select {...register("role")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900">
              <option value="">Select role</option>
              <option value="ADMIN">Admin</option>
              <option value="USER">User</option>
            </select>
            {errors.role && <p className="text-red-500 text-xs">{errors.role.message}</p>}
          </div>

          <button type="submit" disabled={isSubmitting}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50">
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
