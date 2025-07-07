import { useState, useCallback } from "react";
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

export default function SignupForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = () => {
    setAgreed((prev) => !prev);
    setErrors((prev) => ({ ...prev, terms: "" }));
  };

  const validate = () => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: "",
    };
    let valid = true;

    if (!formData.name) {
      newErrors.name = "Name is required";
      valid = false;
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Valid email is required";
      valid = false;
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }
    if (!agreed) {
      newErrors.terms = "You must agree to the terms";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validate()) return;
      setIsSubmitting(true);

      try {
        const response = await axios.post(
          "http://localhost:3000/register",
          formData
        );

        if (response.status === 201 || response.status === 200) {
          setFormData({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
          setAgreed(false);

          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Account created successfully",
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
          text: error.response?.data?.message || "Email is already in use.",
        });
        console.error("Error: ", error.message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, agreed]
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
          <h1 className="text-3xl font-bold text-gray-800">Join TaskMaster</h1>
          <p className="text-sm text-gray-500 mt-2">
            Create your account to start managing tasks efficiently.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Full Name
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1"
              placeholder="Enter your full name"
            />
            {errors.name && <ErrorMessage message={errors.name} />}
          </div>

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

          <div>
            <Label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-gray-700"
            >
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.confirmPassword && (
              <ErrorMessage message={errors.confirmPassword} />
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="terms"
              checked={agreed}
              onChange={handleCheckbox}
              className="w-4 h-4"
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
              I agree to the{" "}
              <Link to="/terms" className="text-blue-600 hover:underline">
                Terms & Conditions
              </Link>
            </label>
          </div>
          {errors.terms && <ErrorMessage message={errors.terms} />}

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Sign Up"}
          </Button>

          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/" className="text-blue-600 hover:underline">
              Log In
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
