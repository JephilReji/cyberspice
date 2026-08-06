import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import { loginWithEmail, loginWithGoogle } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useSplash } from "../context/SplashContext";


export default function Login() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const { triggerSplash } = useSplash();


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await loginWithEmail(email, password);
      setAuth(data);
      triggerSplash();
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSuccess(credential: CredentialResponse) {
    if (!credential.credential) return;
    setError(null);
    try {
      const data = await loginWithGoogle(credential.credential);
      setAuth(data);
      triggerSplash();
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Google sign-in failed.");
    }
  }

  return (
    <main className="min-h-screen w-full flex flex-col md:flex-row">
      {/* Left Side: Brand Side */}
      <div
        className="hidden md:flex md:w-1/2 items-center justify-center p-xl"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC-LqX-W1F5WXaADt-VzHPV3yapyMx7UeoygRLPs0692ugfI1lpwttEe5E2A2kbHJo5yUPy7dOojNvN9PbIIs1f-gRy_372GzjuXtFvn6OD9uXVhM-TmrtgLhMDRyY57J04l5ExOPIPOAvk0smFpqasHUyJoLWuaTd4F5rvBljFLvKUbcZvhw-ObDA2oOdPk97uXuDiqbCIjMxvg-mIiga8SN9UN5GGZ3QCvpggdYiYM5taePFLTM9V')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="font-bold tracking-tight text-5xl lg:text-6xl">
          <span className="text-on-surface">Cyber</span>
          <span className="text-primary">Spice</span>
        </h1>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 md:w-1/2 bg-surface-container-lowest flex flex-col items-center justify-center p-md md:p-xl">
        <div className="md:hidden flex items-center gap-xs mb-xl">
          <h1 className="text-headline-md font-bold tracking-tight">
            <span className="text-on-surface">Cyber</span>
            <span className="text-primary">Spice</span>
          </h1>
        </div>

        <div className="w-full max-w-md">
          <div className="text-center mb-lg">
            <h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg text-on-surface mb-xs">
              Welcome !
            </h2>
            <p className="text-body-sm text-secondary">
              Join the premier global marketplace for premium spices.
            </p>
          </div>

          <div className="space-y-md">
            {/* Real Google Sign-In */}
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google sign-in failed.")}
                width="384"
              />
            </div>

            {/* Divider */}
            <div className="flex items-center gap-sm py-xs">
              <div className="h-[1px] flex-1 bg-outline-variant" />
              <span className="text-label-caps font-label-caps text-outline">OR</span>
              <div className="h-[1px] flex-1 bg-outline-variant" />
            </div>

            {error && (
              <div className="text-body-sm text-error bg-error-container rounded-lg px-sm py-xs">
                {error}
              </div>
            )}

            <form className="space-y-md" onSubmit={handleSubmit}>
              <div className="space-y-base">
                <label className="block text-label-md font-label-md text-on-surface-variant" htmlFor="email">
                  Email or Phone Number <span className="text-error">*</span>
                </label>
                <input
                  id="email"
                  type="text"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-sm py-md bg-surface-container-low border border-outline-variant rounded-lg focus:ring-1 focus:ring-on-primary-fixed-variant focus:border-on-primary-fixed-variant outline-none transition-all"
                />
              </div>

              <div className="space-y-base">
                <div className="flex justify-between items-center">
                  <label className="block text-label-md font-label-md text-on-surface-variant" htmlFor="password">
                    Password <span className="text-error">*</span>
                  </label>
                  <a className="text-label-md font-label-md text-on-primary-fixed-variant hover:underline" href="#">
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-sm py-md bg-surface-container-low border border-outline-variant rounded-lg focus:ring-1 focus:ring-on-primary-fixed-variant focus:border-on-primary-fixed-variant outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-on-primary-fixed-variant text-white font-label-md text-label-md rounded-lg hover:bg-primary transition-all active:scale-95 flex items-center justify-center gap-xs shadow-sm disabled:opacity-60"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <div className="pt-sm text-center">
              <p className="text-body-sm font-body-sm text-secondary">
                Don't have an account?{" "}
                <Link to="/register" className="text-on-primary-fixed-variant font-bold hover:underline">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
