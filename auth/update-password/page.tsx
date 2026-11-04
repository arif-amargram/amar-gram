
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("Checking recovery link...");
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkSession() {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        setMessage("Recovery link invalid or expired. Please request a new link.");
        return;
      }

      setReady(true);
      setMessage("Enter your new password.");
    }

    checkSession();
  }, []);

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setMessage("Update failed: " + error.message);
    } else {
      setMessage("Password updated successfully! You can now login.");
      setReady(false);
      setPassword("");
      setConfirmPassword("");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-5">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-2">
          আমার গ্রাম
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Create New Password
        </p>

        {ready && (
          <form onSubmit={handleUpdate} className="space-y-5">
            <div>
              <label className="block mb-2 font-medium">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full border rounded-lg p-3"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="w-full border rounded-lg p-3"
                placeholder="Confirm new password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}

        <p className="text-center mt-5 text-sm text-gray-700">
          {message}
        </p>

        <a
          href="/admin"
          className="block text-center text-green-700 mt-5 underline"
        >
          Back to Admin Login
        </a>
      </div>
    </main>
  );
}
