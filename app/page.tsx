
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage("Login failed: " + error.message);
      setLoading(false);
      return;
    }

    if (data.user?.app_metadata?.role === "admin") {
      setIsAdmin(true);
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
      setMessage("Password Reset Email পাঠানো হয়েছে। Gmail পরীক্ষা করো।");
    }

    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setEmail("");
    setPassword("");
    setMessage("Logout successful.");
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-5">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-2">
          আমার গ্রাম
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Admin Panel
        </p>

        {isAdmin ? (
          <div className="text-center">
            <h2 className="text-xl font-semibold text-green-700 mb-4">
              Welcome, Admin!
            </h2>
            <p className="text-gray-600 mb-6">
              তুমি সফলভাবে Admin Panel-এ প্রবেশ করেছ।
            </p>
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white py-3 rounded-lg"
            >
              Logout
            </button>
          </div>
        ) : forgotPassword ? (
          <form onSubmit={handleForgotPassword} className="space-y-5">
            <label className="block font-medium">
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
              className="w-full bg-green-700 text-white py-3 rounded-lg disabled:opacity-50"
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
