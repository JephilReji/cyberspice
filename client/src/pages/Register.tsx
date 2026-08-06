import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import { sendOtp, registerWithEmail, loginWithGoogle } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useSplash } from "../context/SplashContext";


type Step = "form" | "otp";

export default function Register() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const { triggerSplash } = useSplash();


  const [step, setStep] = useState<Step>("form");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) { setError("Passwords don't match."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (!agreedToTerms) { setError("Please agree to the Terms of Service and Privacy Policy."); return; }

    setLoading(true);
    try {
      await sendOtp(email);
      setStep("otp");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Could not send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOtp() {
    setResending(true);
    setError(null);
    try {
      await sendOtp(email);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Could not resend OTP.");
    } finally {
      setResending(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (otp.length !== 6) { setError("Please enter the 6-digit OTP."); return; }

    setLoading(true);
    try {
      const data = await registerWithEmail({ name: fullName, email, password, phone, otp });
      setAuth(data);
      triggerSplash();
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
      triggerSplash();
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Google sign-up failed.");
    }
  }

  const inputClass = "w-full h-12 px-sm bg-surface border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all duration-200";

  return (
    <main className="flex min-h-screen w-full">
      <section className="hidden lg:flex lg:w-1/2 min-h-screen relative overflow-hidden bg-primary">
        <div className="relative z-10 flex flex-col justify-center items-center p-xl w-full text-on-primary">
          <h1 className="font-headline-md text-6xl leading-none tracking-tight font-bold text-center"
            style={{ filter: "drop-shadow(rgba(255, 255, 255, 0.3) 0px 0px 15px)" }}>
            <span className="text-black">Cyber</span>
            <span className="text-white" style={{ WebkitTextStroke: "1px #173809" }}>Spice</span>
          </h1>
          <p className="text-on-primary/70 mt-4 text-center max-w-xs">The global B2B spice marketplace. Trade with verified producers worldwide.</p>
        </div>
      </section>

      <section className="w-full lg:w-1/2 min-h-screen bg-surface-container-lowest flex flex-col items-center justify-center">
        <div className="w-full max-w-md px-md py-xl">
          <div className="lg:hidden mb-lg">
            <h1 className="font-headline-md text-headline-md tracking-tight font-bold text-primary">CyberSpice</h1>
          </div>

          {step === "form" ? (
            <>
              <header className="mb-lg">
                <h2 className="font-headline-lg text-headline-lg text-on-surface">Create an account</h2>
                <p className="font-body-lg text-body-lg text-secondary mt-xs">Get started with your CyberSpice trading profile today.</p>
              </header>

              <div className="flex justify-center mb-md">
                <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError("Google sign-up failed.")} text="signup_with" width="384" />
              </div>

              <div className="relative flex py-6 items-center">
                <div className="flex-grow border-t border-outline-variant" />
                <span className="flex-shrink mx-4 text-label-caps text-outline uppercase">Or continue with email</span>
                <div className="flex-grow border-t border-outline-variant" />
              </div>

              {error && (
                <div className="text-body-sm text-error bg-error-container rounded-lg px-sm py-xs mb-md">{error}</div>
              )}

              <form className="space-y-md" onSubmit={handleSendOtp}>
                <div className="space-y-base">
                  <label className="block font-label-md text-label-md text-on-surface" htmlFor="fullName">
                    Full Name <span className="text-error">*</span>
                  </label>
                  <input id="fullName" type="text" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} required className={inputClass} />
                </div>

                <div className="space-y-base">
                  <label className="block font-label-md text-label-md text-on-surface" htmlFor="email">
                    Email Address <span className="text-error">*</span>
                  </label>
                  <input id="email" type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} />
                </div>

                <div className="space-y-base">
                  <label className="block font-label-md text-label-md text-on-surface" htmlFor="phone">
                    Phone Number
                  </label>
                  <input id="phone" type="tel" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
                </div>

                <div className="space-y-base">
                  <label className="block font-label-md text-label-md text-on-surface" htmlFor="password">
                    Create Password <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputClass} />
                    <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-sm top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-[20px]">{showPassword ? "visibility_off" : "visibility"}</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-base">
                  <label className="block font-label-md text-label-md text-on-surface" htmlFor="confirmPassword">
                    Confirm Password <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className={inputClass} />
                    <button type="button" onClick={() => setShowConfirmPassword((v) => !v)} className="absolute right-sm top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-[20px]">{showConfirmPassword ? "visibility_off" : "visibility"}</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-sm pt-xs">
                  <input id="terms" type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="h-4 w-4 mt-0.5 rounded border-outline-variant text-primary focus:ring-primary" />
                  <label className="font-body-sm text-body-sm text-secondary" htmlFor="terms">
                    I agree to the <a className="text-primary hover:underline underline-offset-4" href="#">Terms of Service</a> and{" "}
                    <a className="text-primary hover:underline underline-offset-4" href="#">Privacy Policy</a>.
                  </label>
                </div>

                <button type="submit" disabled={loading} className="w-full h-12 bg-primary text-on-primary font-label-md rounded-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-xs">
                  {loading ? "Sending OTP..." : "Send Verification Code"}
                  {!loading && <span className="material-symbols-outlined text-sm">arrow_forward</span>}
                </button>
              </form>

              <footer className="mt-lg text-center">
                <p className="font-body-lg text-body-lg text-secondary">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary font-semibold hover:underline underline-offset-4">Login</Link>
                </p>
              </footer>
            </>
          ) : (
            <>
              <header className="mb-lg">
                <div className="w-16 h-16 bg-primary-fixed-dim rounded-full flex items-center justify-center mb-md">
                  <span className="material-symbols-outlined text-primary text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>mark_email_read</span>
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface">Verify your email</h2>
                <p className="font-body-lg text-body-lg text-secondary mt-xs">
                  We sent a 6-digit code to <span className="font-bold text-on-surface">{email}</span>. Enter it below to complete your registration.
                </p>
              </header>

              {error && (
                <div className="text-body-sm text-error bg-error-container rounded-lg px-sm py-xs mb-md">{error}</div>
              )}

              <form className="space-y-md" onSubmit={handleVerifyOtp}>
                <div className="space-y-base">
                  <label className="block font-label-md text-label-md text-on-surface" htmlFor="otp">
                    Verification Code <span className="text-error">*</span>
                  </label>
                  <input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="w-full h-14 px-sm bg-surface border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-center text-2xl font-bold tracking-[0.5em]"
                  />
                </div>

                <button type="submit" disabled={loading || otp.length !== 6} className="w-full h-12 bg-primary text-on-primary font-label-md rounded-lg hover:opacity-90 transition-all disabled:opacity-60">
                  {loading ? "Verifying..." : "Verify & Create Account"}
                </button>
              </form>

              <div className="mt-md text-center space-y-sm">
                <button onClick={handleResendOtp} disabled={resending} className="text-primary font-label-md hover:underline disabled:opacity-50">
                  {resending ? "Resending..." : "Resend OTP"}
                </button>
                <p className="text-body-sm text-secondary">OTP expires in 10 minutes</p>
                <button onClick={() => { setStep("form"); setOtp(""); setError(null); }} className="text-secondary text-body-sm hover:text-primary transition-colors flex items-center gap-1 mx-auto">
                  <span className="material-symbols-outlined text-sm">arrow_back</span> Change email
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
