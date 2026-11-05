
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Village = {
  id: string;
  name: string;
  history: string | null;
  description: string | null;
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
      setMessage("Admin Login Successful!");
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
      .update({
        history,
        description,
      })
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

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-5">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-2">
          আমার গ্রাম
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Admin Panel
        </p>

        {isAdmin ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-green-700">
                Welcome, Admin!
              </h2>

              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Logout
              </button>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-xl font-bold text-green-700 mb-5">
                গ্রামের তথ্য যোগ / পরিবর্তন
              </h2>

              <form onSubmit={handleSave} className="space-y-5">
                <div>
                  <label className="block mb-2 font-medium">
                    গ্রাম নির্বাচন করুন
                  </label>

                  <select
                    value={selectedVillageId}
                    onChange={(e) => handleVillageChange(e.target.value)}
                    required
                    className="w-full border rounded-lg p-3 bg-white"
                  >
                    <option value="">গ্রাম নির্বাচন করুন</option>

                    {villages.map((village) => (
                      <option key={village.id} value={village.id}>
                        {village.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    গ্রামের ইতিহাস
                  </label>

                  <textarea
                    value={history}
                    onChange={(e) => setHistory(e.target.value)}
                    rows={5}
                    placeholder="এখানে গ্রামের ইতিহাস লিখুন..."
                    className="w-full border rounded-lg p-3"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    গ্রামের পরিচিতি
                  </label>

                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    placeholder="এখানে গ্রামের পরিচিতি লিখুন..."
                    className="w-full border rounded-lg p-3"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !selectedVillageId}
                  className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
                >
                  {loading ? "Saving..." : "তথ্য সংরক্ষণ করুন"}
                </button>
              </form>
            </div>
          </div>
        ) : forgotPassword ? (
          <form onSubmit={handleForgotPassword} className="space-y-5">
            <div>
              <label className="block mb-2 font-medium">
                Admin Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border rounded-lg p-3"
                placeholder="Admin email"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 text-white py-3 rounded-lg disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <button
              type="button"
              onClick={() => {
                setForgotPassword(false);
                setMessage("");
              }}
              className="w-full text-green-700 underline"
            >
              Back to Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block mb-2 font-medium">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border rounded-lg p-3"
                placeholder="Admin email"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border rounded-lg p-3"
                placeholder="Password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <button
              type="button"
              onClick={() => {
                setForgotPassword(true);
                setMessage("");
              }}
              className="w-full text-green-700 underline"
            >
              Forgot Password?
            </button>
          </form>
        )}

        {message && (
          <p className="text-center mt-5 text-sm text-gray-700 break-words">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
