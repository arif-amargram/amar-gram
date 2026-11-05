
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Village = {
  id: string;
  name: string;
  history: string | null;
  description: string | null;
};
type Place = {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  image_url: string | null;
  status: string;
  village_id: string;
};
export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);

  const [villages, setVillages] = useState<Village[]>([]);
  const [selectedVillageId, setSelectedVillageId] = useState("");
  const [history, setHistory] = useState("");
  const [description, setDescription] = useState("");

  async function loadVillages() {
    const { data, error } = await supabase
      .from("villages")
      .select("id, name, history, description")
      .order("name");

    if (error) {
      setMessage("গ্রামের তথ্য লোড করা যায়নি: " + error.message);
      return;
    }

    setVillages(data || []);
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage("Login error: " + error.message);
      setLoading(false);
      return;
    }

    if (data.user?.app_metadata?.role === "admin") {
      setIsAdmin(true);
      await loadVillages();
      setMessage("স্বাগতম! Admin Login Successful.");
    } else {
      await supabase.auth.signOut();
      setMessage("তোমার Admin permission নেই।");
    }

    setLoading(false);
  }

  async function handleForgotPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo:
        "https://eloquent-flan-a40f60.netlify.app/auth/update-password",
    });

    if (error) {
      setMessage("Recovery failed: " + error.message);
    } else {
      setMessage("Recovery Email পাঠানো হয়েছে। Gmail পরীক্ষা করো।");
    }

    setLoading(false);
  }

  function handleVillageChange(id: string) {
    setSelectedVillageId(id);
    const village = villages.find((v) => v.id === id);
    setHistory(village?.history || "");
    setDescription(village?.description || "");
    setMessage("");
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!selectedVillageId) {
      setMessage("প্রথমে একটি গ্রাম নির্বাচন করো।");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase
      .from("villages")
      .update({ history, description })
      .eq("id", selectedVillageId);

    if (error) {
      setMessage("Save failed: " + error.message);
    } else {
      setVillages((previous) =>
        previous.map((village) =>
          village.id === selectedVillageId
            ? { ...village, history, description }
            : village
        )
      );
      setMessage("গ্রামের তথ্য সফলভাবে সংরক্ষণ হয়েছে!");
    }

    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setEmail("");
    setPassword("");
    setVillages([]);
    setSelectedVillageId("");
    setHistory("");
    setDescription("");
    setMessage("Logout successful.");
  }

  const selectedVillage = villages.find(
    (village) => village.id === selectedVillageId
  );

  return (
    <main className="min-h-screen bg-[#f3f7f2] text-gray-800">
      {!isAdmin ? (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#edf4eb]">
          <div className="w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-2xl grid md:grid-cols-2">
            <div className="relative min-h-[280px] md:min-h-[600px]">
              <img
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200"
                alt="সবুজ গ্রামের প্রকৃতি"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-green-950/55 flex flex-col justify-end p-8 md:p-12 text-white">
                <p className="text-green-200 font-semibold tracking-widest text-sm">
                  WELCOME TO
                </p>
                <h1 className="text-4xl md:text-5xl font-bold mt-3">
                  আমার গ্রাম
                </h1>
                <p className="mt-4 text-green-50 text-lg">
                  গ্রামের ইতিহাস, ঐতিহ্য ও পরিচয় সংরক্ষণের একটি ডিজিটাল
                  ঠিকানা।
                </p>
              </div>
            </div>

            <div className="p-7 md:p-12 flex flex-col justify-center">
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">🌿</div>
                <h2 className="text-3xl font-bold text-green-800">
                  {forgotPassword ? "Reset Password" : "Admin Login"}
                </h2>
                <p className="text-gray-500 mt-2">
                  আমার গ্রাম - Administration Portal
                </p>
              </div>

              {forgotPassword ? (
                <form onSubmit={handleForgotPassword} className="space-y-5">
                  <label className="block">
                    <span className="block mb-2 font-medium">Admin Email</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Enter your email"
                      className="w-full border border-gray-200 rounded-xl p-4 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-4 rounded-xl disabled:opacity-50"
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setForgotPassword(false);
                      setMessage("");
                    }}
                    className="w-full text-green-700 font-medium"
                  >
                    ← Back to Login
                  </button>
                </form>
              ) : (
                <form onSubmit={handleLogin} className="space-y-5">
                  <label className="block">
                    <span className="block mb-2 font-medium">Email Address</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Admin email"
                      className="w-full border border-gray-200 rounded-xl p-4 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                    />
                  </label>

                  <label className="block">
                    <span className="block mb-2 font-medium">Password</span>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter password"
                      className="w-full border border-gray-200 rounded-xl p-4 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-4 rounded-xl shadow-lg disabled:opacity-50"
                  >
                    {loading ? "Logging in..." : "Login to Dashboard →"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setForgotPassword(true);
                      setMessage("");
                    }}
                    className="w-full text-green-700 font-medium hover:underline"
                  >
                    Forgot Password?
                  </button>
                </form>
              )}

              {message && (
                <p className="mt-5 text-center text-sm text-gray-700 break-words">
                  {message}
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        
<div className="admin-dashboard">
  <aside className="admin-sidebar">
    <div style={{ fontSize: "35px" }}>🌿</div>
    <h2>আমার গ্রাম</h2>
    <p style={{ color: "#c6e5d2" }}>Admin Control Panel</p>

    <nav>
      <a href="#dashboard">📊 Dashboard</a>
      <a href="#village-management">🏡 Village Management</a>
      <a href="/">🌐 View Website</a>
    </nav>

    <button
      onClick={handleLogout}
      className="admin-logout"
    >
      ↪ Logout
    </button>
  </aside>

  <section className="admin-content">
    <div id="dashboard" className="admin-header">
      <p style={{ color: "#176b4a", fontWeight: "bold" }}>
        ADMINISTRATION PORTAL
      </p>
      <h1>Dashboard Overview</h1>
      <p>আমার গ্রাম ওয়েবসাইটের সকল তথ্য এখান থেকে পরিচালনা করুন।</p>
    </div>

    <div className="admin-stats">
      <div className="admin-stat-card">
        <div className="stat-icon">🏡</div>
        <p>মোট গ্রাম</p>
        <h3>{villages.length}</h3>
      </div>

      <div className="admin-stat-card">
        <div className="stat-icon">📝</div>
        <p>Village Information</p>
        <h3>Management</h3>
      </div>

      <div className="admin-stat-card">
        <div className="stat-icon">🌐</div>
        <p>Website Status</p>
        <h3>Connected</h3>
      </div>
    </div>

    <div id="village-management" className="admin-panel">
      <h2>🏡 Village Information Management</h2>
      <p>গ্রামের ইতিহাস ও পরিচিতি যোগ অথবা পরিবর্তন করুন।</p>

      <form onSubmit={handleSave}>
        <label>
          গ্রাম নির্বাচন করুন
          <select
            value={selectedVillageId}
            onChange={(e) => handleVillageChange(e.target.value)}
            required
          >
            <option value="">গ্রাম নির্বাচন করুন</option>
            {villages.map((village) => (
              <option key={village.id} value={village.id}>
                {village.name}
              </option>
            ))}
          </select>
        </label>

        {selectedVillage && (
          <p style={{ color: "#176b4a", marginTop: "15px" }}>
            নির্বাচিত গ্রাম: <strong>{selectedVillage.name}</strong>
          </p>
        )}

        <label>
          গ্রামের ইতিহাস
          <textarea
            value={history}
            onChange={(e) => setHistory(e.target.value)}
            rows={6}
            placeholder="এখানে গ্রামের ইতিহাস লিখুন..."
          />
        </label>

        <label>
          গ্রামের পরিচিতি
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            placeholder="এখানে গ্রামের পরিচিতি লিখুন..."
          />
        </label>

        <button type="submit" disabled={loading || !selectedVillageId}>
          {loading ? "Saving..." : "💾 তথ্য সংরক্ষণ করুন"}
        </button>
      </form>
    </div>

    {message && (
      <p className="admin-message">{message}</p>
    )}

    <div className="admin-footer">
      © 2026 Amar Gram | Admin Dashboard
    </div>
  </section>
</div>

      )}
    </main>
  );
}
