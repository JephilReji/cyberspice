import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import { registerWithEmail } from "../api/auth";
import { loginWithGoogle } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (!agreedToTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setLoading(true);
    try {
      const data = await registerWithEmail({ name: fullName, email, password, phone });
      setAuth(data);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed. Please try again.");
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
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Google sign-up failed.");
    }
  }

  return (
    <main className="flex min-h-screen w-full">
      {/* Left Side: Brand */}
      <section className="hidden lg:flex lg:w-1/2 h-full relative overflow-hidden bg-primary">
        <div className="relative z-10 flex flex-col justify-center items-center p-xl w-full text-on-primary">
          <h1
            className="font-headline-md text-6xl leading-none tracking-tight font-bold text-center"
            style={{ filter: "drop-shadow(rgba(255, 255, 255, 0.3) 0px 0px 15px)" }}
          >
            <span className="text-black">Cyber</span>
            <span className="text-white" style={{ WebkitTextStroke: "1px #173809" }}>
              Spice
            </span>
          </h1>
        </div>
      </section>

      {/* Right Side: Signup Form */}
      <section className="w-full lg:w-1/2 min-h-screen bg-surface-container-lowest flex flex-col items-center">
        <div className="w-full max-w-md px-md py-xl lg:py-16">
          <div className="lg:hidden mb-lg">
            <h1 className="font-headline-md text-headline-md tracking-tight font-bold text-primary">
              CyberSpice
            </h1>
          </div>

          <header className="mb-lg">
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Create an account</h2>
            <p className="font-body-lg text-body-lg text-secondary mt-xs">
              Get started with your CyberSpice trading profile today.
            </p>
          </header>

          <div className="flex justify-center mb-md">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google sign-up failed.")}
              text="signup_with"
              width="384"
            />
          </div>

          <div className="relative flex py-8 items-center">
            <div className="flex-grow border-t border-outline-variant" />
            <span className="flex-shrink mx-4 text-label-caps text-outline uppercase">
              Or continue with email
            </span>
            <div className="flex-grow border-t border-outline-variant" />
          </div>

          {error && (
            <div className="text-body-sm text-error bg-error-container rounded-lg px-sm py-xs mb-md">
              {error}
            </div>
          )}

          <form className="space-y-md" onSubmit={handleSubmit}>
            <div className="space-y-base">
              <label className="block font-label-md text-label-md text-on-surface" htmlFor="fullName">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full h-12 px-sm bg-surface border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200"
              />
            </div>

            <div className="space-y-base">
              <label className="block font-label-md text-label-md text-on-surface" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-12 px-sm bg-surface border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200"
              />
            </div>

            <div className="space-y-base">
              <label className="block font-label-md text-label-md text-on-surface" htmlFor="phone">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-12 px-sm bg-surface border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200"
              />
            </div>

            <div className="space-y-base">
              <label className="block font-label-md text-label-md text-on-surface" htmlFor="password">
                Create Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-12 px-sm bg-surface border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-sm top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <div className="space-y-base">
              <label className="block font-label-md text-label-md text-on-surface" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full h-12 px-sm bg-surface border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-sm top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showConfirmPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-start gap-sm pt-xs">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
                />
              </div>
              <label className="font-body-sm text-body-sm text-secondary" htmlFor="terms">
                I agree to the <a className="text-primary hover:underline underline-offset-4" href="#">Terms of Service</a> and{" "}
                <a className="text-primary hover:underline underline-offset-4" href="#">Privacy Policy</a>.
              </label>
            </div>

            <div className="pt-md">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-primary text-on-primary font-headline-md text-headline-md rounded-lg hover:bg-primary-container active:scale-[0.98] transition-all duration-150 shadow-sm disabled:opacity-60"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </form>

          <footer className="mt-lg text-center">
            <p className="font-body-lg text-body-lg text-secondary">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-semibold hover:underline underline-offset-4 ml-xs">
                Login
              </Link>
            </p>
          </footer>
        </div>
      </section>
    </main>
  );
}