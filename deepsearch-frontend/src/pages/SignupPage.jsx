// src/pages/SignupPage.jsx
import React, { useState, useEffect, useContext } from "react"; // Added useEffect and useContext
import { useNavigate } from "react-router-dom";
import { GalleryVerticalEnd } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext
import { authAPI } from "../services/api";
import { Typewriter } from "react-simple-typewriter";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // Get user and authLoading from AuthContext for redirect logic
  const { user, loading: authLoading } = useContext(AuthContext); 

  // useEffect hook to handle redirection if the user is already authenticated
  useEffect(() => {
    console.log('SignupPage useEffect: Checking auth status for redirect. User:', user ? user.email : 'null', 'AuthLoading:', authLoading);
    // If authentication check is complete and a user is found, redirect to dashboard
    if (!authLoading && user) {
      console.log('SignupPage useEffect: User already authenticated, redirecting to /dashboard.');
      navigate('/dashboard', { replace: true }); // Use replace to prevent going back to signup via browser history
    }
  }, [user, authLoading, navigate]); // Dependencies: user, authLoading, and navigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await authAPI.signup(name, email, password);
      setSuccess(res.data.message || "Registration successful!");
      // After successful signup, redirect to login page after a delay
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("Signup error:", err.response ? err.response.data : err.message);
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side: Signup Form */}
      <div className="flex flex-col px-6 py-8 md:px-20">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-semibold text-2xl">
            <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="h-6 w-6" />
            </div>
            DeepSearch
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
              <p className="text-muted-foreground">
                Enter your information below to create your account
              </p>
            </div>

            {error && (
              <div className="bg-destructive/15 text-destructive p-4 rounded-md text-center">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-100 text-green-700 p-4 rounded-md text-center">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={loading}
                variant="default"
              >
                {loading ? "Creating account..." : "Create account"}
              </Button>

              <div className="text-center">
                <p className="text-muted-foreground">
                  Already have an account?{" "}
                  <Button
                    variant="link"
                    onClick={() => navigate("/login")}
                    className="text-primary font-medium p-0 cursor-pointer"
                  >
                    Login
                  </Button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right side: Title section with Typewriter */}
      <div className="bg-gray-100 relative hidden lg:flex items-center justify-center p-10 text-center">
        <div className="max-w-md space-y-4">
          <h2 className="text-4xl font-bold text-gray-800">
            Your Knowledge Hub Starts Here
          </h2>
          <div className="text-2xl font-semibold text-gray-700">
            Smart{" "}
            <span className="text-primary">
              <Typewriter
                words={["Upload", "Search", "Discovery"]}
                loop={true}
                cursor
                cursorStyle="|"
                typeSpeed={80}
                deleteSpeed={50}
                delaySpeed={1000}
              />
            </span>{" "}
            with AI
          </div>
          <p className="text-muted-foreground text-base">
            Upload documents, explore key insights, and search smarter with DeepSearch's AI capabilities.
          </p>
          <p className="text-sm text-gray-500">
            Powered by MERN · Machine Learning · NLP Intelligence · Semantic Search
          </p>
        </div>
      </div>
    </div>
  );
}
