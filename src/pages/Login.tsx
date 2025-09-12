import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { AxiosError } from "axios";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import api from "../services/api";

interface LoginInputs {
  email: string;
  password: string;
}

const schema = yup.object({
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
});

export default function Login() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInputs>({
    defaultValues: { email: "", password: "" },
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (data: LoginInputs) => {
    try {
      setApiError(null);
      const res = await api.post("/auth/login", data); 
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username || "");
      localStorage.setItem("role", res.data.role || "USER");
      navigate("/dashboard");
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setApiError(axiosError.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-800 via-gray-900 to-black px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-purple-600 to-purple-900 items-center justify-center p-8">
          <svg className="w-32 h-32 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
               viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
        </div>

        <div className="w-full md:w-1/2 p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-purple-700 text-center mb-6">Welcome Back</h2>
          {apiError && <p className="text-red-500 text-sm mb-4 text-center">{apiError}</p>}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input id="email" type="email" {...register("email")}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900"
                placeholder="Enter your email"/>
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input id="password" type="password" {...register("password")}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-900"
                placeholder="Enter your password"/>
              {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
            </div>

        

            <button type="submit" disabled={isSubmitting}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center disabled:opacity-50">
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-gray-600">
            Don’t have an account?{" "}
            <Link to="/register" className="text-purple-600 hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
