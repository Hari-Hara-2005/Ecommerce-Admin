import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const ErrorMessage = ({ message }) => {
  return <p className="text-red-500 text-xs mt-1">{message}</p>;
};

export default function SignInForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {
      email: "",
      password: "",
    };
    let valid = true;

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Valid email is required";
      valid = false;
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("http://localhost:3000/verify-token", {
          withCredentials: true,
        });
        if (response.status == 200) {
          navigate("/home", { replace: true });
        }
      } catch (error) {
        setIsAuth(false);
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validate()) return;
      setIsSubmitting(true);

      try {
        const response = await axios.post(
          "http://localhost:3000/login",
          formData,
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          const { username, useremail, role } = response.data;
          localStorage.setItem(
            "user",
            JSON.stringify({ username, useremail, role })
          );
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Signed in successfully",
            confirmButtonText: "OK",
          });
          navigate("/home", { replace: true });
        } else {
          throw new Error("Unexpected response status: " + response.status);
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.response?.data?.message || "Invalid credentials.",
        });
        console.error("Error: ", error.message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, navigate]
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-500 to-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-sm text-gray-500 mt-2">Sign in to continue</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1"
              placeholder="Enter your email"
            />
            {errors.email && <ErrorMessage message={errors.email} />}
          </div>

          <div>
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className="mt-1"
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.password && <ErrorMessage message={errors.password} />}
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </Button>
          <p className="text-sm text-center text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
