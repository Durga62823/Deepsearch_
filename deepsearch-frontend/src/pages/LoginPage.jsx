// src/pages/LoginPage.jsx
import React, { useState, useEffect, useContext } from "react"; // Added useEffect
import { useNavigate } from "react-router-dom";
import { GalleryVerticalEnd } from "lucide-react"; // lucide-react icon
import { Input } from "@/components/ui/input"; // shadcn/ui Input
import { Button } from "@/components/ui/button"; // shadcn/ui Button
import { Label } from "@/components/ui/label"; // shadcn/ui Label
import { AuthContext } from "../context/AuthContext"; // Corrected path for AuthContext
import { authAPI } from "../services/api"; // Corrected path for authAPI
import { Typewriter } from "react-simple-typewriter"; // Typewriter component

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // Destructure user and authLoading from AuthContext for redirect logic
  const { user, loading: authLoading, login } = useContext(AuthContext); 
  const navigate = useNavigate();

  // useEffect hook to handle redirection if the user is already authenticated
  useEffect(() => {
    console.log('LoginPage useEffect: Checking auth status for redirect. User:', user ? user.email : 'null', 'AuthLoading:', authLoading);
    // If authentication check is complete and a user is found, redirect to dashboard
    if (!authLoading && user) {
      console.log('LoginPage useEffect: User already authenticated, redirecting to /dashboard.');
      navigate('/dashboard', { replace: true }); // Use replace to prevent going back to login via browser history
    }
  }, [user, authLoading, navigate]); // Dependencies: user, authLoading, and navigate to ensure hook runs when these change

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await authAPI.login(email, password);
      // Check if both token and user data are present in the response
      if (res.data?.token && res.data?.user) {
        login(res.data.token, res.data.user); // Update AuthContext state and localStorage
        // The useEffect above will now automatically handle the navigation
        // based on the updated 'user' state in AuthContext.
      } else {
        setError("Login successful but missing token or user data in response.");
        console.error("Login response missing data:", res.data);
      }
    } catch (err) {
      console.error("Login failed:", err.response || err.message);
      // Display error message from backend or a generic one
      setError(err.response?.data?.message || "Login failed. Check credentials.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Panel (Login Form) */}
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
              <h1 className="text-3xl font-bold tracking-tight">Welcome to DeepSearch</h1>
              <p className="text-muted-foreground">
                Enter your credentials to access your account
              </p>
            </div>

            {error && (
              <div className="bg-destructive/15 text-destructive p-4 rounded-md text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                variant="default"
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Button
                  variant="link"
                  onClick={() => navigate("/signup")}
                  className="text-primary font-medium p-0"
                >
                  Sign up
                </Button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Text with Typewriter Effect */}
      <div className="bg-gray-100 relative hidden lg:flex items-center justify-center p-10 text-center">
        <div className="max-w-md space-y-4">
          <div className="text-3xl font-semibold text-gray-700">
            Smart{" "}
            <span className="text-primary">
              <Typewriter
                words={["Search", "Insights", "Tagging"]}
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
            Log in to explore intelligent document understanding powered by NLP & ML.
          </p>
          <p className="text-sm text-gray-500">
            Built with MERN Stack · Entity Extraction · Semantic Match
          </p>
        </div>
      </div>
    </div>
  );
}



// import { GalleryVerticalEnd } from "lucide-react"
// import { LoginForm } from "@/components/login-form"
// export default function LoginPage() {
//   return (
//     <div className="grid min-h-svh lg:grid-cols-2">
//       <div className="flex flex-col gap-4 p-6 md:p-10">
//         <div className="flex justify-center gap-2 md:justify-start">
//           <a href="#" className="flex items-center gap-2 font-medium">
//             <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
//               <GalleryVerticalEnd className="size-4" />
//             </div>
//             Acme Inc.
//           </a>
//         </div>
//         <div className="flex flex-1 items-center justify-center">
//           <div className="w-full max-w-xs">
//             <LoginForm />
//           </div>
//         </div>
//       </div>
//       <div className="bg-muted relative hidden lg:block">
//         <img
//           src="/placeholder.svg"
//           alt="Image"
//           className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
//         />
//       </div>
//     </div>
//   )
// }