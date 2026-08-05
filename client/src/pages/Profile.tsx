import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BottomNav from "../components/BottomNav";
import { useAuth } from "../context/AuthContext";
import { apiClient } from "../api/client";

interface Address {
  _id: string;
  label: string;
  fullName: string;
  company?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
}

type Tab = "profile" | "password" | "addresses";

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  // Profile state
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState("");
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl ?? "");
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [savingPassword, setSavingPassword] = useState(false);

  // Address state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({ label: "Home", fullName: "", company: "", address: "", city: "", state: "", pincode: "", phone: "", isDefault: false });
  const [addressMsg, setAddressMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    apiClient.get("/profile").then((res) => {
      setPhone(res.data.phone ?? "");
      setAddresses(res.data.savedAddresses ?? []);
    }).catch(() => {});
  }, [user, navigate]);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);
    try {
      await apiClient.patch("/profile", { name, phone, photoUrl });
      updateUser({ name, photoUrl });
      setProfileMsg({ type: "success", text: "Profile updated successfully." });
    } catch (err: any) {
      setProfileMsg({ type: "error", text: err?.response?.data?.message || "Could not update profile." });
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMsg(null);
    if (newPassword !== confirmNewPassword) { setPasswordMsg({ type: "error", text: "New passwords don't match." }); return; }
    if (newPassword.length < 8) { setPasswordMsg({ type: "error", text: "Password must be at least 8 characters." }); return; }
    setSavingPassword(true);
    try {
      await apiClient.patch("/profile/change-password", { currentPassword, newPassword });
      setPasswordMsg({ type: "success", text: "Password changed successfully." });
      setCurrentPassword(""); setNewPassword(""); setConfirmNewPassword("");
    } catch (err: any) {
      setPasswordMsg({ type: "error", text: err?.response?.data?.message || "Could not change password." });
    } finally {
      setSavingPassword(false);
    }
  }

  async function handleAddAddress(e: React.FormEvent) {
    e.preventDefault();
    setSavingAddress(true);
    setAddressMsg(null);
    try {
      const { data } = await apiClient.post("/profile/addresses", addressForm);
      setAddresses(data);
      setShowAddressForm(false);
      setAddressForm({ label: "Home", fullName: "", company: "", address: "", city: "", state: "", pincode: "", phone: "", isDefault: false });
      setAddressMsg({ type: "success", text: "Address added successfully." });
    } catch (err: any) {
      setAddressMsg({ type: "error", text: err?.response?.data?.message || "Could not add address." });
    } finally {
      setSavingAddress(false);
    }
  }

  async function handleDeleteAddress(addressId: string) {
    try {
      const { data } = await apiClient.delete(`/profile/addresses/${addressId}`);
      setAddresses(data);
    } catch {}
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  if (!user) return null;

  const inputClass = "w-full h-11 px-sm bg-surface-container-low border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-body-sm";

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "profile", label: "Profile", icon: "person" },
    { key: "password", label: "Password", icon: "lock" },
    { key: "addresses", label: "Addresses", icon: "location_on" },
  ];

  return (
    <div className="min-h-screen bg-background text-on-surface pb-24 md:pb-0">
      <Navbar />

      <main className="max-w-container-max mx-auto px-sm md:px-lg py-md md:py-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-lg items-start">

          {/* Sidebar */}
          <div className="md:col-span-1 space-y-sm">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md text-center">
              <div className="relative inline-block mb-sm">
                {photoUrl ? (
                  <img src={photoUrl} alt={user.name} className="w-20 h-20 rounded-full object-cover border-2 border-primary mx-auto" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-primary text-on-primary flex items-center justify-center text-3xl font-bold mx-auto">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              <h2 className="font-bold text-on-surface">{user.name}</h2>
              <p className="text-body-sm text-secondary truncate">{user.email}</p>
              {user.isVerified && (
                <div className="flex items-center justify-center gap-1 mt-xs text-primary text-label-caps">
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  Verified
                </div>
              )}
            </div>

            <nav className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full flex items-center gap-sm px-md py-sm text-left transition-colors ${activeTab === tab.key ? "bg-primary text-on-primary font-bold" : "hover:bg-surface-container-low text-on-surface"}`}
                >
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: activeTab === tab.key ? "'FILL' 1" : "'FILL' 0" }}>{tab.icon}</span>
                  <span className="text-label-md">{tab.label}</span>
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-sm px-md py-sm text-left text-error hover:bg-error-container transition-colors border-t border-outline-variant"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
                <span className="text-label-md">Sign Out</span>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
                <div className="p-md border-b border-outline-variant">
                  <h2 className="text-headline-md font-headline-md">Personal Information</h2>
                </div>
                <div className="p-md">
                  {profileMsg && (
                    <div className={`mb-md text-body-sm rounded-lg px-sm py-xs ${profileMsg.type === "success" ? "bg-primary-container/30 text-primary" : "bg-error-container text-error"}`}>
                      {profileMsg.text}
                    </div>
                  )}
                  <form onSubmit={handleSaveProfile} className="space-y-md">
                    <div>
                      <label className="block text-label-md font-label-md mb-1">Profile Photo URL</label>
                      <div className="flex gap-sm items-center">
                        <input type="url" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} placeholder="https://example.com/photo.jpg" className={inputClass} />
                        {photoUrl && (
                          <img src={photoUrl} alt="Preview" className="w-11 h-11 rounded-full object-cover border border-outline-variant flex-shrink-0"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        )}
                      </div>
                      <p className="text-[11px] text-secondary mt-1">Paste a direct image URL. Google profile photos work automatically.</p>
                    </div>
                    <div>
                      <label className="block text-label-md font-label-md mb-1">Full Name <span className="text-error">*</span></label>
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-label-md font-label-md mb-1">Email</label>
                      <input type="email" value={user.email} disabled className={`${inputClass} opacity-60 cursor-not-allowed`} />
                      <p className="text-[11px] text-secondary mt-1">Email cannot be changed.</p>
                    </div>
                    <div>
                      <label className="block text-label-md font-label-md mb-1">Phone Number</label>
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className={inputClass} />
                    </div>
                    <button type="submit" disabled={savingProfile} className="bg-primary text-on-primary h-11 px-lg rounded-lg font-label-md hover:opacity-90 transition-all disabled:opacity-60">
                      {savingProfile ? "Saving..." : "Save Changes"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === "password" && (
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
                <div className="p-md border-b border-outline-variant">
                  <h2 className="text-headline-md font-headline-md">Change Password</h2>
                </div>
                <div className="p-md">
                  {passwordMsg && (
                    <div className={`mb-md text-body-sm rounded-lg px-sm py-xs ${passwordMsg.type === "success" ? "bg-primary-container/30 text-primary" : "bg-error-container text-error"}`}>
                      {passwordMsg.text}
                    </div>
                  )}
                  <form onSubmit={handleChangePassword} className="space-y-md max-w-md">
                    <div>
                      <label className="block text-label-md font-label-md mb-1">Current Password <span className="text-error">*</span></label>
                      <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-label-md font-label-md mb-1">New Password <span className="text-error">*</span></label>
                      <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-label-md font-label-md mb-1">Confirm New Password <span className="text-error">*</span></label>
                      <input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required className={inputClass} />
                    </div>
                    <button type="submit" disabled={savingPassword} className="bg-primary text-on-primary h-11 px-lg rounded-lg font-label-md hover:opacity-90 transition-all disabled:opacity-60">
                      {savingPassword ? "Changing..." : "Change Password"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === "addresses" && (
              <div className="space-y-md">
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
                  <div className="p-md border-b border-outline-variant flex items-center justify-between">
                    <h2 className="text-headline-md font-headline-md">Saved Addresses</h2>
                    <button onClick={() => setShowAddressForm((v) => !v)} className="bg-primary text-on-primary h-9 px-sm rounded-lg font-label-md text-label-md hover:opacity-90 transition-all flex items-center gap-1">
                      <span className="material-symbols-outlined text-[18px]">{showAddressForm ? "close" : "add"}</span>
                      {showAddressForm ? "Cancel" : "Add Address"}
                    </button>
                  </div>

                  {addressMsg && (
                    <div className={`mx-md mt-md text-body-sm rounded-lg px-sm py-xs ${addressMsg.type === "success" ? "bg-primary-container/30 text-primary" : "bg-error-container text-error"}`}>
                      {addressMsg.text}
                    </div>
                  )}

                  {showAddressForm && (
                    <form onSubmit={handleAddAddress} className="p-md border-b border-outline-variant space-y-md">
                      <div className="grid grid-cols-2 gap-md">
                        <div>
                          <label className="block text-label-md font-label-md mb-1">Label</label>
                          <select value={addressForm.label} onChange={(e) => setAddressForm((p) => ({ ...p, label: e.target.value }))} className={inputClass}>
                            <option>Home</option>
                            <option>Office</option>
                            <option>Warehouse</option>
                            <option>Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-label-md font-label-md mb-1">Full Name <span className="text-error">*</span></label>
                          <input type="text" value={addressForm.fullName} onChange={(e) => setAddressForm((p) => ({ ...p, fullName: e.target.value }))} required className={inputClass} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-label-md font-label-md mb-1">Company</label>
                        <input type="text" value={addressForm.company} onChange={(e) => setAddressForm((p) => ({ ...p, company: e.target.value }))} placeholder="Optional" className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-label-md font-label-md mb-1">Address <span className="text-error">*</span></label>
                        <input type="text" value={addressForm.address} onChange={(e) => setAddressForm((p) => ({ ...p, address: e.target.value }))} required className={inputClass} />
                      </div>
                      <div className="grid grid-cols-3 gap-md">
                        <div>
                          <label className="block text-label-md font-label-md mb-1">City <span className="text-error">*</span></label>
                          <input type="text" value={addressForm.city} onChange={(e) => setAddressForm((p) => ({ ...p, city: e.target.value }))} required className={inputClass} />
                        </div>
                        <div>
                          <label className="block text-label-md font-label-md mb-1">State <span className="text-error">*</span></label>
                          <input type="text" value={addressForm.state} onChange={(e) => setAddressForm((p) => ({ ...p, state: e.target.value }))} required className={inputClass} />
                        </div>
                        <div>
                          <label className="block text-label-md font-label-md mb-1">Pincode <span className="text-error">*</span></label>
                          <input type="text" value={addressForm.pincode} onChange={(e) => setAddressForm((p) => ({ ...p, pincode: e.target.value }))} required className={inputClass} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-label-md font-label-md mb-1">Phone <span className="text-error">*</span></label>
                        <input type="tel" value={addressForm.phone} onChange={(e) => setAddressForm((p) => ({ ...p, phone: e.target.value }))} required className={inputClass} />
                      </div>
                      <div className="flex items-center gap-sm">
                        <input type="checkbox" id="isDefault" checked={addressForm.isDefault} onChange={(e) => setAddressForm((p) => ({ ...p, isDefault: e.target.checked }))} className="h-4 w-4 text-primary" />
                        <label htmlFor="isDefault" className="text-label-md text-on-surface">Set as default address</label>
                      </div>
                      <button type="submit" disabled={savingAddress} className="bg-primary text-on-primary h-11 px-lg rounded-lg font-label-md hover:opacity-90 transition-all disabled:opacity-60">
                        {savingAddress ? "Saving..." : "Save Address"}
                      </button>
                    </form>
                  )}

                  <div className="p-md space-y-md">
                    {addresses.length === 0 ? (
                      <div className="text-center py-lg text-secondary">
                        <span className="material-symbols-outlined text-4xl block mb-2 text-outline">location_off</span>
                        No saved addresses yet. Add one to speed up checkout.
                      </div>
                    ) : (
                      addresses.map((addr) => (
                        <div key={addr._id} className={`border rounded-xl p-md relative ${addr.isDefault ? "border-primary bg-primary/5" : "border-outline-variant"}`}>
                          {addr.isDefault && (
                            <span className="absolute top-3 right-12 text-label-caps text-primary font-bold text-[11px] uppercase">Default</span>
                          )}
                          <button onClick={() => handleDeleteAddress(addr._id)} className="absolute top-3 right-3 text-secondary hover:text-error transition-colors">
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                          <div className="flex items-center gap-xs mb-xs">
                            <span className="material-symbols-outlined text-primary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                            <span className="font-bold text-label-md text-primary uppercase">{addr.label}</span>
                          </div>
                          <p className="font-bold text-on-surface">{addr.fullName}</p>
                          {addr.company && <p className="text-body-sm text-secondary">{addr.company}</p>}
                          <p className="text-body-sm text-on-surface-variant">{addr.address}</p>
                          <p className="text-body-sm text-on-surface-variant">{addr.city}, {addr.state} — {addr.pincode}</p>
                          <p className="text-body-sm text-secondary mt-xs">{addr.phone}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
